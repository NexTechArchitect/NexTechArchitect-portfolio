"use client";

import { useEffect, useRef, useState } from "react";

interface ShaderCanvasProps {
  variant?: "hero" | "footer";
  className?: string;
}

const VERTEX_SHADER_300 = `#version 300 es
precision highp float;

in vec2 a_position;
out vec2 vUv;

void main() {
  vUv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_300 = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_variant;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
  for (int i = 0; i < 4; i++) {
    value += amp * noise(p);
    p = rot * p * 2.02 + vec2(1.7, 9.2);
    amp *= 0.5;
  }
  return value;
}

float fluidField(vec2 p, float t, vec2 mouseOffset) {
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.14 + mouseOffset * 0.25),
    fbm(p + vec2(5.2, 1.3) - t * 0.11 - mouseOffset * 0.20)
  );

  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 0.09),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 0.08)
  );

  return fbm(p + 2.4 * r);
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.25;
  vec2 m = (u_mouse - 0.5) * vec2(aspect, 1.0) * 2.25;

  float distToMouse = length(p - m);
  float lensInfluence = exp(-distToMouse * distToMouse * 1.35);
  vec2 mouseOffset = (p - m) * lensInfluence * 0.52;

  float t = u_time * 0.55;
  vec2 warpedP = p + mouseOffset;

  float h0 = fluidField(warpedP, t, mouseOffset);
  float eps = 0.04;
  float hx = fluidField(warpedP + vec2(eps, 0.0), t, mouseOffset);
  float hy = fluidField(warpedP + vec2(0.0, eps), t, mouseOffset);

  vec2 grad = vec2(hx - h0, hy - h0) / eps;
  vec3 normal = normalize(vec3(-grad.x * 1.5, -grad.y * 1.5, 1.0));

  vec3 lightDir = normalize(vec3(0.45 + (u_mouse.x - 0.5) * 0.8, 0.55 + (u_mouse.y - 0.5) * 0.8, 0.9));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfVec = normalize(lightDir + viewDir);

  float spec = pow(max(dot(normal, halfVec), 0.0), 18.0);
  float causticRibbon = smoothstep(0.44, 0.72, h0) * (1.0 - smoothstep(0.72, 0.95, h0));
  float ridge = smoothstep(0.20, 0.78, length(grad));

  // Subtle chromatic dispersion across optical glass
  float hR = fluidField(warpedP + normal.xy * 0.04, t, mouseOffset);
  float hB = fluidField(warpedP - normal.xy * 0.04, t, mouseOffset);
  float dispersion = clamp(abs(hR - hB) * 2.8, 0.0, 1.0);

  vec3 alabaster = vec3(0.9725, 0.9804, 0.9882); // #F8FAFC
  vec3 cobalt = vec3(0.0, 0.3216, 1.0);          // #0052FF
  vec3 teal = vec3(0.0314, 0.5686, 0.6980);      // #0891B2
  vec3 indigo = vec3(0.2470, 0.3176, 0.7098);    // #3F51B5
  vec3 frostWhite = vec3(1.0, 1.0, 1.0);

  vec3 primaryTint = mix(cobalt, indigo, u_variant * 0.45);
  vec3 secondaryTint = mix(teal, cobalt, u_variant * 0.25);

  vec3 color = alabaster;

  // Fluid optical glass wash kept airy so dark ink retains > 10:1 contrast
  float washMask = smoothstep(0.24, 0.86, h0);
  color = mix(color, mix(alabaster, primaryTint, 0.135), washMask);
  color = mix(color, mix(alabaster, secondaryTint, 0.145), smoothstep(0.32, 0.86, hB));

  // Refractive glass caustic ribbons
  color = mix(color, mix(primaryTint, secondaryTint, 0.5), causticRibbon * 0.17);
  color = mix(color, mix(alabaster, primaryTint, 0.22), ridge * 0.18);

  // Optical chromatic edge dispersion
  color = mix(color, mix(cobalt, teal, uv.x), dispersion * 0.18);

  // Specular highlights & cursor optical bloom
  color = mix(color, frostWhite, clamp(spec * 0.55 + lensInfluence * 0.18, 0.0, 0.65));
  color = mix(color, mix(alabaster, cobalt, 0.18), lensInfluence * 0.24);

  // Seamless vertical fade into #F8FAFC
  float edgeFade = smoothstep(0.0, 0.18, uv.y) * smoothstep(1.0, 0.82, uv.y);
  color = mix(alabaster, color, mix(0.35, 1.0, edgeFade));

  fragColor = vec4(color, 1.0);
}
`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderCanvas({
  variant = "hero",
  className = "",
}: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rendererMode, setRendererMode] = useState<"webgl2" | "fallback">("webgl2");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      setRendererMode("fallback");
      return;
    }

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_300);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_300);
    if (!vert || !frag) {
      if (vert) gl.deleteShader(vert);
      if (frag) gl.deleteShader(frag);
      setRendererMode("fallback");
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      setRendererMode("fallback");
      return;
    }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      setRendererMode("fallback");
      return;
    }

    const vao = gl.createVertexArray();
    const vbo = gl.createBuffer();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uVariant = gl.getUniformLocation(program, "u_variant");

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const rendererStr = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "")
      : String(gl.getParameter(gl.RENDERER) || "");
    const isSoftwareGl = /swiftshader|llvmpipe|software|mesa/i.test(rendererStr);
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 1;
    let height = 1;
    let rafId = 0;
    let isVisible = true;
    let disposed = false;

    const targetMouse = { x: 0.72, y: 0.45 };
    const currentMouse = { x: 0.72, y: 0.45 };
    const startTime = performance.now();
    let lastRenderTime = 0;

    const drawFrame = (now: number) => {
      if (disposed) return;

      const minInterval = isSoftwareGl ? 120 : 16;
      if (now - lastRenderTime >= minInterval || lastRenderTime === 0) {
        lastRenderTime = now;
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.065;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.065;

        const elapsed =
          prefersReducedMotion || isSoftwareGl
            ? 2.2
            : (now - startTime) * 0.001 + 1.2;

        gl.clearColor(0.9725, 0.9804, 0.9882, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.uniform2f(uResolution, width, height);
        gl.uniform1f(uTime, elapsed);
        gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
        gl.uniform1f(uVariant, variant === "footer" ? 1.0 : 0.0);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      if (!prefersReducedMotion && !isSoftwareGl && isVisible) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const isMobile = window.innerWidth < 768;
      const dprCap = isSoftwareGl ? 0.5 : isMobile ? 1.25 : 1.75;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, width, height);
      drawFrame(performance.now());
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1.0 - (event.clientY - rect.top) / rect.height;
      targetMouse.x = Math.min(1, Math.max(0, nx));
      targetMouse.y = Math.min(1, Math.max(0, ny));
      if (isSoftwareGl && isVisible) {
        drawFrame(performance.now());
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = Boolean(entry?.isIntersecting);
        if (isVisible) {
          drawFrame(performance.now());
          if (!prefersReducedMotion && !isSoftwareGl && !rafId) {
            rafId = requestAnimationFrame(drawFrame);
          }
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { threshold: 0.02 }
    );

    resize();
    observer.observe(canvas);

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.bindVertexArray(null);
      if (vbo) gl.deleteBuffer(vbo);
      if (vao) gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [variant]);

  if (rendererMode === "fallback") {
    return (
      <div
        data-testid={`shader-canvas-${variant}`}
        data-renderer="fallback"
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none ${className}`}
        style={{
          background:
            variant === "footer"
              ? "radial-gradient(ellipse at 70% 25%, rgba(0,82,255,0.11), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(8,145,178,0.10), transparent 55%), #F8FAFC"
              : "radial-gradient(ellipse at 75% 30%, rgba(0,82,255,0.12), transparent 55%), radial-gradient(ellipse at 25% 75%, rgba(8,145,178,0.10), transparent 55%), #F8FAFC",
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      data-testid={`shader-canvas-${variant}`}
      data-renderer="webgl2"
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none block bg-[#F8FAFC] ${className}`}
    />
  );
}
