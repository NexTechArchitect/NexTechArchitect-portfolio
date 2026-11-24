"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import {
  createTesseractEdges,
  createTesseractVertices,
  projectTesseractIntoBuffers,
} from "@/lib/tesseract4d";

// Pre-allocated scratch helpers to guarantee zero GC allocations inside the render loop
const _dummy = new THREE.Object3D();
const _colorDeep = new THREE.Color("#2A1B14");
const _colorMid = new THREE.Color("#C46218");
const _colorBright = new THREE.Color("#F48C06");
const _tmpColor = new THREE.Color();

function detectSoftwareWebGL(): boolean {
  if (typeof document === "undefined") return true;
  try {
    const probeCanvas = document.createElement("canvas");
    const gl = probeCanvas.getContext("webgl2");
    if (!gl) return true;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size * 0.04,
      size / 2,
      size / 2,
      size * 0.48
    );
    gradient.addColorStop(0, "rgba(35, 23, 18, 0.24)");
    gradient.addColorStop(0.45, "rgba(92, 75, 67, 0.10)");
    gradient.addColorStop(1, "rgba(250, 246, 240, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function Sculpture4D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webglReady, setWebglReady] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      window.requestAnimationFrame(() => setWebglReady(false));
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
    );
    renderer.setClearColor(0x000000, 0);

    const initialWidth = Math.max(container.clientWidth, 320);
    const initialHeight = Math.max(container.clientHeight, 320);
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("data-testid", "sculpture-4d-canvas");
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 4D tesseract and orbital bronze-glass sculpture"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Studio environment map for crisp metallic bronze and glass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      36,
      initialWidth / initialHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.25, 8.2);
    camera.lookAt(0, -0.05, 0);

    // 3-Point Warm Editorial Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffaf2, 0xcab59c, 1.15);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff2e0, 2.15);
    keyLight.position.set(5.5, 7.2, 6.4);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xe85d04, 2.8, 18, 1.4);
    rimLight.position.set(-4.6, -2.4, 3.8);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xf48c06, 0.85);
    fillLight.position.set(-5.0, 4.0, -4.5);
    scene.add(fillLight);

    // Master sculpture group
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(0, 0.14, 0);
    scene.add(sculptureGroup);

    // 1. Grounded contact shadow disc beneath the sculpture
    const shadowTexture = createContactShadowTexture();
    const shadowGeo = new THREE.CircleGeometry(2.35, 36);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -2.28, 0);
    scene.add(shadowMesh);

    // 2. Orbital Bronze-Glass Gimbal Rings (varied roughness >= 0.25 across parts)
    const outerRingGeo = new THREE.TorusGeometry(2.08, 0.028, 16, 84);
    const outerRingMat = new THREE.MeshPhysicalMaterial({
      color: 0x8c5a32,
      metalness: 0.9,
      roughness: 0.34,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerRing.rotation.set(Math.PI * 0.34, Math.PI * 0.12, 0);
    sculptureGroup.add(outerRing);

    // Machined bronze degree ticks along the outer armillary ring (InstancedMesh)
    const tickCount = 36;
    const tickGeo = new THREE.BoxGeometry(0.016, 0.095, 0.016);
    const tickMat = new THREE.MeshStandardMaterial({
      color: 0x3b261d,
      metalness: 0.8,
      roughness: 0.42,
    });
    const tickMesh = new THREE.InstancedMesh(tickGeo, tickMat, tickCount);
    for (let i = 0; i < tickCount; i += 1) {
      const angle = (i / tickCount) * Math.PI * 2;
      const r = 2.08;
      _dummy.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
      _dummy.rotation.set(0, 0, angle + Math.PI / 2);
      const isMajor = i % 3 === 0;
      _dummy.scale.set(isMajor ? 1.35 : 0.85, isMajor ? 1.5 : 0.8, 1);
      _dummy.updateMatrix();
      tickMesh.setMatrixAt(i, _dummy.matrix);
    }
    tickMesh.instanceMatrix.needsUpdate = true;
    tickMesh.computeBoundingSphere();
    outerRing.add(tickMesh);

    // Translucent warm-amber / burnt-orange refractive orbital band
    const amberRingGeo = new THREE.TorusGeometry(1.74, 0.044, 18, 72);
    const amberRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xd94e04,
      emissive: 0x7a2800,
      emissiveIntensity: 0.16,
      metalness: 0.18,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      ior: 1.54,
      transmission: isSoftwareGl ? 0 : 0.72,
      thickness: 0.7,
      attenuationColor: new THREE.Color(0xe85d04),
      attenuationDistance: 1.35,
      transparent: true,
      opacity: isSoftwareGl ? 0.74 : 0.94,
      depthWrite: false,
    });
    const amberRing = new THREE.Mesh(amberRingGeo, amberRingMat);
    amberRing.rotation.set(-Math.PI * 0.28, Math.PI * 0.22, Math.PI * 0.1);
    amberRing.renderOrder = 2;
    sculptureGroup.add(amberRing);

    // Satin espresso-bronze inner meridian ring
    const espressoRingGeo = new THREE.TorusGeometry(1.44, 0.018, 12, 64);
    const espressoRingMat = new THREE.MeshStandardMaterial({
      color: 0x2b1b15,
      metalness: 0.52,
      roughness: 0.66,
    });
    const espressoRing = new THREE.Mesh(espressoRingGeo, espressoRingMat);
    espressoRing.rotation.set(Math.PI * 0.16, -Math.PI * 0.4, Math.PI * 0.28);
    sculptureGroup.add(espressoRing);

    // 3. Central Refractive Glass Core + Faceted Espresso Nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.32, 0);
    const nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a1811,
      metalness: 0.86,
      roughness: 0.24,
      emissive: 0x6b2600,
      emissiveIntensity: 0.35,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    sculptureGroup.add(nucleusMesh);

    const glassCoreGeo = new THREE.IcosahedronGeometry(0.56, 1);
    const glassCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xe85d04,
      emissive: 0x9c3d00,
      emissiveIntensity: 0.14,
      metalness: 0.08,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      ior: 1.58,
      transmission: isSoftwareGl ? 0 : 0.86,
      thickness: 1.35,
      attenuationColor: new THREE.Color(0xe85d04),
      attenuationDistance: 1.5,
      transparent: true,
      opacity: isSoftwareGl ? 0.42 : 0.96,
      depthWrite: false,
    });
    const glassCoreMesh = new THREE.Mesh(glassCoreGeo, glassCoreMat);
    glassCoreMesh.renderOrder = 3;
    sculptureGroup.add(glassCoreMesh);

    // 4. 4D-Projected Tesseract Lattice (32 edges as BufferGeometry LineSegments)
    const tesseractVertices = createTesseractVertices();
    const tesseractEdges = createTesseractEdges();
    const projectedPositions = new Float32Array(tesseractVertices.length * 3);
    const projectedDepths = new Float32Array(tesseractVertices.length);

    const linePositions = new Float32Array(tesseractEdges.length * 2 * 3);
    const lineColors = new Float32Array(tesseractEdges.length * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    const linePosAttr = new THREE.BufferAttribute(linePositions, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    const lineColAttr = new THREE.BufferAttribute(lineColors, 3);
    lineColAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute("position", linePosAttr);
    lineGeometry.setAttribute("color", lineColAttr);

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
    });
    const tesseractLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    tesseractLines.frustumCulled = false;
    sculptureGroup.add(tesseractLines);

    // 5. 16 Tesseract Vertex Nodes (InstancedMesh of Metallic Bronze-Amber Spheres)
    const nodeGeo = new THREE.SphereGeometry(0.062, 16, 16);
    const nodeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.65,
      clearcoatRoughness: 0.14,
    });
    const vertexNodes = new THREE.InstancedMesh(
      nodeGeo,
      nodeMat,
      tesseractVertices.length
    );
    vertexNodes.frustumCulled = false;
    sculptureGroup.add(vertexNodes);

    // 6. 8 Orbital Refractive Glass Satellite Beads (InstancedMesh)
    const satelliteCount = 8;
    const satGeo = new THREE.SphereGeometry(0.068, 16, 16);
    const satMat = new THREE.MeshPhysicalMaterial({
      color: 0xf48c06,
      metalness: 0.15,
      roughness: 0.08,
      clearcoat: 1.0,
      ior: 1.54,
      transmission: isSoftwareGl ? 0 : 0.82,
      thickness: 0.8,
      transparent: true,
      opacity: isSoftwareGl ? 0.62 : 0.95,
    });
    const satellites = new THREE.InstancedMesh(satGeo, satMat, satelliteCount);
    satellites.frustumCulled = false;
    sculptureGroup.add(satellites);

    // Pre-warm shaders once on hardware GPUs
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer & Scroll interaction state
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerCurrentX = 0;
    let pointerCurrentY = 0;
    let scrollTarget = 0;
    let scrollCurrent = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerTargetX = THREE.MathUtils.clamp(nx, -1, 1);
      pointerTargetY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handlePointerLeave = () => {
      pointerTargetX = 0;
      pointerTargetY = 0;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(window.innerHeight, 600);
      scrollTarget = THREE.MathUtils.clamp(window.scrollY / maxScroll, 0, 1.2);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Update function for a given elapsed time
    const updateGeometry = (elapsed: number, delta: number) => {
      const dampDt = Math.min(delta, 0.08);
      pointerCurrentX = THREE.MathUtils.damp(
        pointerCurrentX,
        pointerTargetX,
        5.5,
        dampDt
      );
      pointerCurrentY = THREE.MathUtils.damp(
        pointerCurrentY,
        pointerTargetY,
        5.5,
        dampDt
      );
      scrollCurrent = THREE.MathUtils.damp(
        scrollCurrent,
        scrollTarget,
        4.5,
        dampDt
      );

      // 4D Plane Rotations (XW, YW, ZW + subtle XY)
      projectTesseractIntoBuffers(
        tesseractVertices,
        {
          xw: elapsed * 0.42 + pointerCurrentX * 0.55 + scrollCurrent * 0.9,
          yw: elapsed * 0.31 - pointerCurrentY * 0.48,
          zw: elapsed * 0.24 + scrollCurrent * 0.45,
          xy: elapsed * 0.12,
        },
        projectedPositions,
        projectedDepths,
        3.15,
        2.32
      );

      // Update 32 line segments & depth-graded espresso-to-amber colors in place
      for (let e = 0; e < tesseractEdges.length; e += 1) {
        const [a, b] = tesseractEdges[e];
        const aPos = a * 3;
        const bPos = b * 3;
        const outBase = e * 6;

        linePositions[outBase] = projectedPositions[aPos];
        linePositions[outBase + 1] = projectedPositions[aPos + 1];
        linePositions[outBase + 2] = projectedPositions[aPos + 2];

        linePositions[outBase + 3] = projectedPositions[bPos];
        linePositions[outBase + 4] = projectedPositions[bPos + 1];
        linePositions[outBase + 5] = projectedPositions[bPos + 2];

        // Vertex A color based on 4D depth
        const da = projectedDepths[a];
        if (da < 0.5) {
          _tmpColor.copy(_colorDeep).lerp(_colorMid, da * 2);
        } else {
          _tmpColor.copy(_colorMid).lerp(_colorBright, (da - 0.5) * 2);
        }
        lineColors[outBase] = _tmpColor.r;
        lineColors[outBase + 1] = _tmpColor.g;
        lineColors[outBase + 2] = _tmpColor.b;

        // Vertex B color based on 4D depth
        const db = projectedDepths[b];
        if (db < 0.5) {
          _tmpColor.copy(_colorDeep).lerp(_colorMid, db * 2);
        } else {
          _tmpColor.copy(_colorMid).lerp(_colorBright, (db - 0.5) * 2);
        }
        lineColors[outBase + 3] = _tmpColor.r;
        lineColors[outBase + 4] = _tmpColor.g;
        lineColors[outBase + 5] = _tmpColor.b;
      }

      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Update 16 tesseract vertex nodes
      for (let i = 0; i < tesseractVertices.length; i += 1) {
        const idx = i * 3;
        const depth = projectedDepths[i];
        _dummy.position.set(
          projectedPositions[idx],
          projectedPositions[idx + 1],
          projectedPositions[idx + 2]
        );
        _dummy.rotation.set(0, 0, 0);
        const s = 0.68 + depth * 0.72;
        _dummy.scale.setScalar(s);
        _dummy.updateMatrix();
        vertexNodes.setMatrixAt(i, _dummy.matrix);

        if (depth < 0.45) {
          _tmpColor.copy(_colorDeep).lerp(_colorMid, depth / 0.45);
        } else {
          _tmpColor.copy(_colorMid).lerp(_colorBright, (depth - 0.45) / 0.55);
        }
        vertexNodes.setColorAt(i, _tmpColor);
      }
      vertexNodes.instanceMatrix.needsUpdate = true;
      if (vertexNodes.instanceColor) {
        vertexNodes.instanceColor.needsUpdate = true;
      }

      // Orbital satellites tracing bronze & amber planes
      for (let i = 0; i < satelliteCount; i += 1) {
        const theta = elapsed * (i % 2 === 0 ? 0.52 : -0.44) + (i * Math.PI * 2) / satelliteCount;
        const radius = i % 2 === 0 ? 2.08 : 1.74;
        const tilt = i % 2 === 0 ? 0.95 : -0.78;
        const x = Math.cos(theta) * radius;
        const y = Math.sin(theta) * radius * Math.cos(tilt);
        const z = Math.sin(theta) * radius * Math.sin(tilt);
        _dummy.position.set(x, y, z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.setScalar(i % 2 === 0 ? 0.95 : 1.15);
        _dummy.updateMatrix();
        satellites.setMatrixAt(i, _dummy.matrix);
      }
      satellites.instanceMatrix.needsUpdate = true;

      // Smooth sculptural motion + pointer tilt + scroll depth
      sculptureGroup.rotation.y = elapsed * 0.16 + pointerCurrentX * 0.34;
      sculptureGroup.rotation.x = 0.16 + pointerCurrentY * 0.24 + scrollCurrent * 0.26;
      sculptureGroup.position.y =
        0.14 + Math.sin(elapsed * 0.9) * 0.06 - scrollCurrent * 0.35;

      outerRing.rotation.z = elapsed * 0.14;
      amberRing.rotation.y = Math.PI * 0.22 - elapsed * 0.22;
      espressoRing.rotation.x = Math.PI * 0.16 + elapsed * 0.19;

      nucleusMesh.rotation.x = elapsed * 0.45;
      nucleusMesh.rotation.y = elapsed * 0.62;
      glassCoreMesh.rotation.y = -elapsed * 0.3;
      glassCoreMesh.rotation.z = elapsed * 0.2;
    };

    // ResizeObserver for crisp viewport sizing
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(Math.floor(entry.contentRect.width), 240);
      const h = Math.max(Math.floor(entry.contentRect.height), 240);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    });
    resizeObserver.observe(container);

    // Pause animation when scrolled out of view or tab is hidden
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let disposed = false;
    let frameId = 0;
    let timerId = 0;
    let lastTime = performance.now();
    let elapsed = 0.85; // Start at an asymmetric sculptural angle on frame 1

    const scheduleSoftwareNext = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext | null;
      if (gl && typeof gl.fenceSync === "function") {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) {
            if (sync) gl.deleteSync(sync);
            return;
          }
          const status = sync
            ? gl.getSyncParameter(sync, gl.SYNC_STATUS)
            : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            timerId = window.setTimeout(poll, 6);
          } else {
            if (sync) gl.deleteSync(sync);
            timerId = window.setTimeout(cb, 80);
          }
        };
        timerId = window.setTimeout(poll, 6);
      } else {
        timerId = window.setTimeout(cb, 90);
      }
    };

    const tick = () => {
      if (disposed || !isVisible || !isTabVisible) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += delta;

      updateGeometry(elapsed, delta);
      renderer.render(scene, camera);

      if (prefersReducedMotion) return;

      if (isSoftwareGl) {
        scheduleSoftwareNext(tick);
      } else {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    const startLoop = () => {
      if (disposed || !isVisible || !isTabVisible) return;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
      lastTime = performance.now();
      tick();
    };

    const stopLoop = () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const nextVisible = entry.isIntersecting;
        if (nextVisible !== isVisible) {
          isVisible = nextVisible;
          if (isVisible) startLoop();
          else stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial render immediately so frame 1 is always populated
    updateGeometry(elapsed, 0.016);
    renderer.render(scene, camera);
    if (!prefersReducedMotion) {
      startLoop();
    }

    return () => {
      disposed = true;
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);

      // Complete GPU resource disposal
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      tickGeo.dispose();
      tickMat.dispose();
      amberRingGeo.dispose();
      amberRingMat.dispose();
      espressoRingGeo.dispose();
      espressoRingMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      glassCoreGeo.dispose();
      glassCoreMat.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      satGeo.dispose();
      satMat.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!webglReady) {
    return (
      <div className="w-full h-full flex items-center justify-center rounded-3xl border border-[#231712]/12 bg-[#F3ECE1]/60 p-8 text-center">
        <div>
          <p className="font-display italic text-2xl text-[#231712]">
            4D Tesseract Projection
          </p>
          <p className="mt-2 text-xs text-[#5C4B43]">
            Hardware WebGL context is unavailable on this browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full select-none">
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
