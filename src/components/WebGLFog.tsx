import React, { useEffect, useRef } from 'react';

/**
 * WebGLFog
 * 
 * A single WebGL atmospheric canvas rendering a procedural FBM noise shader.
 * Completely replaces heavy CSS overlays/PNG stacks with an interactive,
 * GPU-accelerated volumetric fog effect. Designed to be warm, cinematic, 
 * and structurally responsive to mouse movement with smooth inertia while 
 * keeping the center of the composition perfectly clear for underlying visuals.
 */
export const WebGLFog: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false });
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Vertex Shader: A simple full-screen triangle.
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      
      // Simplex 2D noise
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 5; ++i) {
          v += a * snoise(x);
          x = rot * x * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        
        // 1. Random organic drift
        vec2 movement = vec2(u_time * 0.02, u_time * 0.015);
        
        // 2. Subtle mouse influence: slight displacement, smooth inertia from JS
        vec2 mouseOffset = u_mouse * 0.03; 
        
        // Base coordinate with movement and mouse displacement
        vec2 q = uv * 2.0 + movement + mouseOffset;
        
        // Organic domain warping for more misty feel (air turbulence)
        vec2 r = vec2(0.0);
        r.x = fbm(q + vec2(1.7, 9.2) + 0.1 * u_time);
        r.y = fbm(q + vec2(8.3, 2.8) + 0.08 * u_time);
        
        float f = fbm(q + r);
        
        // 3. Subtle transparency & color: Warm white / soft gray / tiny beige
        // Updated to a pearl/smoky cinematic glass tone
        vec3 fogColor = vec3(0.85, 0.86, 0.88); 
        
        // Calculate raw fog density
        float density = smoothstep(0.0, 1.0, f);
        
        // 4. Keep center clearer than edges
        float distToCenter = distance(uv, vec2(0.5));
        float edgeMask = smoothstep(0.1, 0.9, distToCenter);
        
        // 5. Protect text readability on the left side
        float leftProtectMask = smoothstep(0.05, 0.45, uv.x);
        
        // 6. Combine layers
        float alpha = density * 0.35; // base max opacity ~35%
        alpha *= mix(0.2, 1.0, edgeMask); // center is at 20% of normal fog density
        alpha *= mix(0.1, 1.0, leftProtectMask); // left edge is at 10%
        
        // Subtle global density shift based on mouse, but no targeted blob
        alpha += (u_mouse.x * u_mouse.y) * 0.03;
        alpha = clamp(alpha, 0.0, 0.6);
        
        // Premultiplied Alpha
        gl_FragColor = vec4(fogColor * alpha, alpha);
      }
    `;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full screen triangle to render the shader locally on the GPU
    const vertices = new Float32Array([
      -1, -1,
       3, -1,
      -1,  3
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // WebGL Interaction and Render Loop Setup
    let animationFrame: number;
    let startTime = performance.now();
    
    // Inertia variables
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onPointerMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });

    const resize = () => {
      // Massive optimization: render soft fog at half density directly via the canvas pixel surface.
      // High-DPI screens completely waste GPU cycles rendering blurry volumes.
      // This cuts fragment calculations by ~75% minimum with zero perceived loss in softness.
      const dpr = 0.5; // Always rendering smaller than logical pixel space purposefully
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Disable internal GL blending completely so our output writes directly to the backbuffer. 
    // This is mathematically strictly required for proper browser DOM compositing over HTML.
    gl.disable(gl.BLEND);

    let isVisible = true;
    let isRendering = false;
    let simulatedTime = 0;
    let lastTime = performance.now();
    
    // Strict Halt: WebGL completely sleeps the RAF cycle if scrolled past to save battery/fans 
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !isRendering) {
        lastTime = performance.now(); // Reset time diff tracking properly
        render(lastTime);
      }
    });

    const render = (now: number) => {
      if (!isVisible) {
        isRendering = false;
        return; // Complete RAF detachment
      }
      isRendering = true;
      animationFrame = requestAnimationFrame(render);
      
      const delta = now - lastTime;
      lastTime = now;
      simulatedTime += delta;

      // Ultra-smooth, elegant inertia for a weighty, premium interaction
      mouseX += (targetMouseX - mouseX) * 0.015;
      mouseY += (targetMouseY - mouseY) * 0.015;

      gl.uniform1f(uTime, simulatedTime / 1000);
      
      // Safety check: ensure uMouse exists in uniform array before uploading
      if (uMouse !== null) {
        gl.uniform2f(uMouse, mouseX, mouseY);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    observer.observe(canvas);
    
    // Explicitly kickstart the render in case the IO triggers after we scroll past or we need it immediately
    // IO is asynchronous; if it's already visible, it will trigger soon, but sometimes the first frame drops
    lastTime = performance.now();
    render(lastTime);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', resize);
      observer.disconnect();
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }} // Back underneath primary UI and exact framing
    />
  );
};
