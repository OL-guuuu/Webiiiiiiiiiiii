import React, { useEffect, useRef } from 'react';
import { getSurfaceIntensity, subscribeInteractionSnapshot } from '../utils/interactionMaterial';

const vsSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fsSource = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_intensity;
uniform float u_velocity;

varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 uv = v_uv;
  vec2 mouseUv = u_mouse / u_resolution;

  vec2 aspect = vec2(u_resolution.x / max(u_resolution.y, 1.0), 1.0);
  vec2 delta = (uv - mouseUv) * aspect;
  float dist = length(delta);

  float core = smoothstep(0.28, 0.0, dist);
  float ring = smoothstep(0.34, 0.14, dist) - smoothstep(0.14, 0.02, dist);

  float ripple = sin(dist * 120.0 - u_time * 11.0 + u_velocity * 9.0);
  float scan = sin((uv.y + u_time * 0.18) * 920.0) * 0.5 + 0.5;
  float grain = hash(gl_FragCoord.xy * 0.22 + u_time * 73.0) - 0.5;

  float pulse = core * (0.42 + 0.58 * scan);
  float stressedRing = ring * (0.35 + 0.65 * abs(ripple)) * (0.65 + u_velocity * 0.9);
  float microNoise = core * grain * 0.22;

  float response = (pulse + stressedRing + microNoise) * u_intensity;
  float alpha = clamp(response * 0.44, 0.0, 0.42);

  vec3 brightTint = vec3(0.78, 0.88, 1.0);
  vec3 deepTint = vec3(0.12, 0.17, 0.24);
  float toneMix = clamp(ring * 0.7 + max(0.0, ripple) * 0.38, 0.0, 1.0);
  vec3 color = mix(brightTint, deepTint, toneMix);

  gl_FragColor = vec4(color, alpha);
}
`;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('SiteMaterialSurface shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
};

export const SiteMaterialSurface: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const metricsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });

  const uniformsRef = useRef<{
    u_resolution: WebGLUniformLocation | null;
    u_mouse: WebGLUniformLocation | null;
    u_time: WebGLUniformLocation | null;
    u_intensity: WebGLUniformLocation | null;
    u_velocity: WebGLUniformLocation | null;
  }>({
    u_resolution: null,
    u_mouse: null,
    u_time: null,
    u_intensity: null,
    u_velocity: null,
  });

  const stateRef = useRef({
    rawMouseX: 0,
    rawMouseY: 0,
    mouseX: 0,
    mouseY: 0,
    prevMouseX: 0,
    prevMouseY: 0,
    velocity: 0,
    currentIntensity: 0,
    targetIntensity: 0,
    needsRender: true,
    time: 0,
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
    const normalizedX = clamp01((clientX - metrics.left) / metrics.width);
    const normalizedY = clamp01((clientY - metrics.top) / metrics.height);

    stateRef.current.rawMouseX = normalizedX * canvas.width;
    stateRef.current.rawMouseY = normalizedY * canvas.height;
    stateRef.current.needsRender = true;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      preserveDrawingBuffer: false,
      antialias: false,
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('SiteMaterialSurface program link error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    uniformsRef.current = {
      u_resolution: gl.getUniformLocation(program, 'u_resolution'),
      u_mouse: gl.getUniformLocation(program, 'u_mouse'),
      u_time: gl.getUniformLocation(program, 'u_time'),
      u_intensity: gl.getUniformLocation(program, 'u_intensity'),
      u_velocity: gl.getUniformLocation(program, 'u_velocity'),
    };

    glRef.current = gl;
    programRef.current = program;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    syncCanvasMetrics();

    const state = stateRef.current;
    state.rawMouseX = canvas.width * 0.5;
    state.rawMouseY = canvas.height * 0.5;
    state.mouseX = state.rawMouseX;
    state.mouseY = state.rawMouseY;
    state.prevMouseX = state.mouseX;
    state.prevMouseY = state.mouseY;
    state.needsRender = true;

    return () => {
      if (vbo) gl.deleteBuffer(vbo);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      glRef.current = null;
      programRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stateRef.current.targetIntensity = 0;
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
      stateRef.current.targetIntensity = getSurfaceIntensity(snapshot.surface, 'site');
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

  useEffect(() => {
    let animationFrameId = 0;
    let previousTime = performance.now();

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      const gl = glRef.current;
      const program = programRef.current;
      if (!gl || !program) return;

      const dt = Math.min((now - previousTime) * 0.001, 0.1);
      previousTime = now;

      const state = stateRef.current;

      state.currentIntensity += (state.targetIntensity - state.currentIntensity) * 10.5 * dt;

      const mouseLerp = 1.0 - Math.exp(-20 * dt);
      state.mouseX += (state.rawMouseX - state.mouseX) * mouseLerp;
      state.mouseY += (state.rawMouseY - state.mouseY) * mouseLerp;

      const dx = state.mouseX - state.prevMouseX;
      const dy = state.mouseY - state.prevMouseY;
      const deltaPx = Math.sqrt(dx * dx + dy * dy);
      const canvasDiagonal = Math.max(1, Math.hypot(gl.canvas.width, gl.canvas.height));
      const normalizedVelocity = deltaPx / canvasDiagonal;

      state.velocity += (normalizedVelocity * 6.5 - state.velocity) * 9.0 * dt;
      state.prevMouseX = state.mouseX;
      state.prevMouseY = state.mouseY;

      state.time += dt;

      const isMoving = state.velocity > 0.0015;
      const isFading = Math.abs(state.currentIntensity - state.targetIntensity) > 0.001;

      if (!isMoving && !isFading && !state.needsRender && state.currentIntensity < 0.001) {
        return;
      }

      gl.useProgram(program);
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uniformsRef.current.u_resolution, gl.canvas.width, gl.canvas.height);
      gl.uniform2f(uniformsRef.current.u_mouse, state.mouseX, state.mouseY);
      gl.uniform1f(uniformsRef.current.u_time, state.time);
      gl.uniform1f(uniformsRef.current.u_intensity, state.currentIntensity);
      gl.uniform1f(uniformsRef.current.u_velocity, state.velocity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      state.needsRender = false;
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 block w-full h-full pointer-events-none z-[220]"
      aria-hidden="true"
    />
  );
};
