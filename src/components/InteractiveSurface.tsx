import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getSurfaceIntensity, subscribeInteractionSnapshot } from '../utils/interactionMaterial';

// Shader implementations
const vsSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
    // Convert from pixel coordinates to clip space (-1.0 to 1.0)
    v_uv = a_position * 0.5 + 0.5;
    // Flip Y to match standard texture mapping
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fsSource = `
precision highp float;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_intensity;       // The target surface intensity
uniform float u_velocity;        // Current mouse movement momentum

varying vec2 v_uv;

void main() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 mouse_uv = u_mouse / u_resolution;
  // Mouse coordinates are already mapped to the same top-left UV space as v_uv.
    
    vec2 frag_uv_aspect = v_uv * aspect;
    vec2 mouse_uv_aspect = mouse_uv * aspect;
    
    float dist = distance(frag_uv_aspect, mouse_uv_aspect);
    
    // Core parameters
    float radius = 0.15; // 15% of screen height
    float max_bulge = 0.08 * u_intensity;
    
    vec2 final_uv = v_uv;
    
    // If inside the influence radius and active
    if (dist < radius && u_intensity > 0.001) {
        float falloff = smoothstep(radius, 0.0, dist);
        
        vec2 dir = normalize(frag_uv_aspect - mouse_uv_aspect);
        dir.x /= aspect.x; // Un-aspect the direction for UV offsetting
        
        // 1. Digital Magnification / Bulge
        float bulge_amount = falloff * max_bulge;
        vec2 bulge_uv = v_uv - dir * bulge_amount;
        
        // 2. Pixel Quantization (Digital Breakup effect driven by velocity)
        // High velocity = smaller blocks = harsher digital tearing
        // Low velocity = larger blocks = softer optical refraction
        float grid_scale = mix(80.0, 30.0, clamp(u_velocity * 0.5, 0.0, 1.0));
        vec2 quantized_uv = floor(bulge_uv * grid_scale) / grid_scale;
        
        // 3. Blend based on velocity to simulate physical surface stress
        // High movement brings out the digital quantization, slow hovering is just magnification
        float quantize_blend = clamp(u_velocity * 1.5, 0.0, 1.0) * falloff * u_intensity;
        
        final_uv = mix(bulge_uv, quantized_uv, quantize_blend);
    }
    
    vec4 color = texture2D(u_texture, final_uv);
    gl_FragColor = color;
}
`;

export interface InteractiveSurfaceRef {
  /** Called exclusively by MasterSequence when a new frame is fully drawn */
  updateTexture: () => void;
}

interface Props {
  sourceCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const InteractiveSurface = forwardRef<InteractiveSurfaceRef, Props>(({ sourceCanvasRef }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const metricsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  
  // WebGL State Receptacles
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texRef = useRef<WebGLTexture | null>(null);
  const locRef = useRef<{
    position: number;
    u_texture: WebGLUniformLocation | null;
    u_resolution: WebGLUniformLocation | null;
    u_mouse: WebGLUniformLocation | null;
    u_intensity: WebGLUniformLocation | null;
    u_velocity: WebGLUniformLocation | null;
  }>({ position: 0, u_texture: null, u_resolution: null, u_mouse: null, u_intensity: null, u_velocity: null });
  
  // Animation States
  const stateRef = useRef({
    rawMouseX: 0,
    rawMouseY: 0,
    mouseX: 0,
    mouseY: 0,
    prevMouseX: 0,
    prevMouseY: 0,
    velocity: 0,
    currentIntensity: 0,
    targetIntensity: 0.4,
    needsRender: true,
  });

  const syncCanvasMetrics = () => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    metricsRef.current = {
      left: rect.left,
      top: rect.top,
      width: Math.max(1, rect.width),
      height: Math.max(1, rect.height),
    };

    if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
      gl.viewport(0, 0, nextWidth, nextHeight);
      stateRef.current.needsRender = true;
    }
  };

  const updateMouseFromViewport = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const metrics = metricsRef.current;
    const normalizedX = Math.min(Math.max((clientX - metrics.left) / metrics.width, 0), 1);
    const normalizedY = Math.min(Math.max((clientY - metrics.top) / metrics.height, 0), 1);

    stateRef.current.rawMouseX = normalizedX * canvas.width;
    stateRef.current.rawMouseY = normalizedY * canvas.height;
    stateRef.current.needsRender = true;
  };

  // 1. Initialization and WebGL Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Performance: Preserve drawing buffer false, alpha false for maximum speed on full-screen quads.
    const gl = canvas.getContext('webgl', { alpha: false, preserveDrawingBuffer: false, antialias: false });
    if (!gl) return;
    glRef.current = gl;

    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Fullscreen quad buffer
    const vertices = new Float32Array([
      -1, -1, 
       1, -1, 
      -1,  1, 
      -1,  1, 
       1, -1, 
       1,  1
    ]);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    locRef.current = {
      position: gl.getAttribLocation(program, 'a_position'),
      u_texture: gl.getUniformLocation(program, 'u_texture'),
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
      u_intensity: gl.getUniformLocation(program, 'u_intensity'),
      u_velocity: gl.getUniformLocation(program, 'u_velocity'),
    };

    gl.enableVertexAttribArray(locRef.current.position);
    gl.vertexAttribPointer(locRef.current.position, 2, gl.FLOAT, false, 0, 0);

    // Initial Texture Setup
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Wrap to clamp tightly and linearly to cleanly handle standard cinematic frames
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    texRef.current = texture;

    if (locRef.current.u_texture) {
      gl.uniform1i(locRef.current.u_texture, 0);
    }

    syncCanvasMetrics();

    const state = stateRef.current;
    state.rawMouseX = canvas.width * 0.5;
    state.rawMouseY = canvas.height * 0.5;
    state.mouseX = state.rawMouseX;
    state.mouseY = state.rawMouseY;
    state.prevMouseX = state.mouseX;
    state.prevMouseY = state.mouseY;
    state.needsRender = true;

  }, []);

  // 2. High-Performance Expose for Texture Updating
  useImperativeHandle(ref, () => ({
    updateTexture: () => {
      const gl = glRef.current;
      const source = sourceCanvasRef.current;
      if (!gl || !source || source.width === 0 || source.height === 0) return;

      syncCanvasMetrics();

      // Explicitly upload the source to the GPU
      gl.bindTexture(gl.TEXTURE_2D, texRef.current);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      
      // Wake up the render loop if texture changes
      stateRef.current.needsRender = true;
    }
  }));

  // 3. Render Loop + Logic Decay
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const renderLoop = (time: number) => {
      animationFrameId = requestAnimationFrame(renderLoop);
      const dt = Math.min((time - lastTime) * 0.001, 0.1); // clamp delta time
      lastTime = time;

      const state = stateRef.current;
      const gl = glRef.current;
      const program = programRef.current;

      if (!gl || !program) return;

      // --- Math / Physics Decay ---
      // Smoothly interpolate current intensity to Target Surface Intensity
      state.currentIntensity += (state.targetIntensity - state.currentIntensity) * 10.0 * dt;

      // Keep smoothing tight so the effect stays visually anchored to the real cursor.
      const mouseLerp = 1.0 - Math.exp(-24.0 * dt);
      state.mouseX += (state.rawMouseX - state.mouseX) * mouseLerp;
      state.mouseY += (state.rawMouseY - state.mouseY) * mouseLerp;
      
      // Calculate true velocity from position delta
      const dx = state.mouseX - state.prevMouseX;
      const dy = state.mouseY - state.prevMouseY;
      const deltaPx = Math.sqrt(dx * dx + dy * dy);
      const canvasDiagonal = Math.max(1, Math.hypot(gl.canvas.width, gl.canvas.height));
      const rawVel = deltaPx / canvasDiagonal;
      
      // Dampen velocity to prevent instantaneous flashing
      state.velocity += (rawVel * 6.5 - state.velocity) * 8.0 * dt;
      
      // Update prev
      state.prevMouseX = state.mouseX;
      state.prevMouseY = state.mouseY;

      // Precision sleep: If intensity matched, velocity is essentially zero, and no hard re-render flagged, skip WebGL draw.
      const isMoving = state.velocity > 0.001;
      const isFading = Math.abs(state.currentIntensity - state.targetIntensity) > 0.001;
      
      if (!isMoving && !isFading && !state.needsRender && state.currentIntensity < 0.001) {
          return; // Totally idle
      }

      // --- WebGL Draw ---
      gl.useProgram(program);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(locRef.current.u_resolution, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(locRef.current.u_mouse, state.mouseX, state.mouseY);
      gl.uniform1f(locRef.current.u_intensity, state.currentIntensity);
      gl.uniform1f(locRef.current.u_velocity, state.velocity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      
      // Consume the manual render flag
      state.needsRender = false;
    };

    animationFrameId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // 4. Global Raycasting / Mouse Monitor
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
       stateRef.current.targetIntensity = 0.0;
       return;
    }

    const unsubscribe = subscribeInteractionSnapshot((snapshot) => {
      syncCanvasMetrics();

      if (!snapshot.hasPointer) {
        stateRef.current.targetIntensity = 0;
        stateRef.current.needsRender = true;
        return;
      }

      updateMouseFromViewport(snapshot.clientX, snapshot.clientY);
      stateRef.current.targetIntensity = getSurfaceIntensity(snapshot.surface, 'media');
    });

    const handleViewportChange = () => {
      syncCanvasMetrics();
      stateRef.current.needsRender = true;
    };

    window.addEventListener('resize', handleViewportChange, { passive: true });
    window.addEventListener('scroll', handleViewportChange, { passive: true, capture: true });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, []);

  // Set the z-index strictly to 0 so it lives perfectly beneath standard UI and Fog.
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full block pointer-events-none z-[0] bg-black" 
    />
  );
});
