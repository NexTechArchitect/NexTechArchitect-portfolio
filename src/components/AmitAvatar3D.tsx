"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

interface AmitAvatar3DProps {
  onOpenGallery: () => void;
  onInspectYulGas: () => void;
  onOpenResume: () => void;
  onAskAnything: () => void;
  onScrollToContact: () => void;
  darkTopStage?: boolean;
}

const WELCOME_HEADLINES = [
  "Hi there, I'm Amit.",
  "Welcome to my portfolio.",
  "Let's explore DeFi systems.",
] as const;

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
      size * 0.06,
      size / 2,
      size / 2,
      size * 0.48
    );
    gradient.addColorStop(0, "rgba(24, 17, 13, 0.28)");
    gradient.addColorStop(0.55, "rgba(36, 26, 21, 0.1)");
    gradient.addColorStop(1, "rgba(250, 246, 240, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function AmitAvatar3D({
  onOpenGallery,
  onInspectYulGas,
  onOpenResume,
  onAskAnything,
  onScrollToContact,
  darkTopStage = false,
}: AmitAvatar3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const waveProgressRef = useRef(0);
  const [webglReady, setWebglReady] = useState(true);
  const [welcomeIndex, setWelcomeIndex] = useState(0);
  const [activeSpotlightIndex, setActiveSpotlightIndex] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);

  const spotlightItems = useMemo(
    () => [
      {
        id: "open-gallery",
        prompt: "Want to see my protocols?",
        ctaLabel: "Open Gallery",
        direction: "up-right" as const,
        emphasis: "espresso" as const,
        onAction: onOpenGallery,
      },
      {
        id: "view-resume",
        prompt: "Looking for my resume?",
        ctaLabel: "View Resume",
        direction: "up-right" as const,
        emphasis: "espresso" as const,
        onAction: onOpenResume,
      },
      {
        id: "ask-agent",
        prompt: "Have a question about my work?",
        ctaLabel: "Ask Agent",
        direction: "up-right" as const,
        emphasis: "orange" as const,
        onAction: onAskAnything,
      },
      {
        id: "inspect-yul",
        prompt: "Want to inspect my Yul gas optimizations?",
        ctaLabel: "View Code",
        direction: "down" as const,
        emphasis: "orange" as const,
        onAction: onInspectYulGas,
      },
      {
        id: "go-contact",
        prompt: "Want to get in touch?",
        ctaLabel: "Contact",
        direction: "down" as const,
        emphasis: "espresso" as const,
        onAction: onScrollToContact,
      },
    ],
    [
      onOpenGallery,
      onOpenResume,
      onAskAnything,
      onInspectYulGas,
      onScrollToContact,
    ]
  );

  // Cycle refined welcome headline above the 3D avatar every 2.8 seconds
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setWelcomeIndex((prev) => (prev + 1) % WELCOME_HEADLINES.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, []);

  // Auto-rotate compact quick-action prompt below the 3D avatar every 1.8 seconds
  useEffect(() => {
    if (isSpotlightPaused) return;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveSpotlightIndex((prev) => (prev + 1) % spotlightItems.length);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [isSpotlightPaused, spotlightItems.length]);

  // Automatic smooth welcome wave & nod gesture on initial page landing
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      waveProgressRef.current = 1.0;
    }, 450);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAvatarClick = useCallback(() => {
    waveProgressRef.current = 1.0;
    onAskAnything();
  }, [onAskAnything]);

  const activeSpotlight = spotlightItems[activeSpotlightIndex];

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
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = false;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5)
    );
    renderer.setClearColor(0x000000, 0);

    const initialW = Math.max(container.clientWidth, 280);
    const initialH = Math.max(container.clientHeight, 280);
    renderer.setSize(initialW, initialH, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.setAttribute("data-testid", "amit-avatar-3d-canvas");
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive 3D developer character of Amit Kumar"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(
      34,
      initialW / initialH,
      0.1,
      40
    );
    camera.position.set(0, 0.24, 5.85);
    camera.lookAt(0, 0.22, 0);

    // Soft Warm 3-Point Editorial Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xfffaf3, 0xbca590, 1.32);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.15);
    keyLight.position.set(4.2, 5.8, 5.4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf3e4d4, 0.98);
    fillLight.position.set(-4.5, 2.4, 3.8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xe85d04, 3.6, 15, 1.45);
    rimLight.position.set(-2.8, 2.1, -2.2);
    scene.add(rimLight);

    const warmBounce = new THREE.PointLight(0xd96b27, 1.45, 12, 1.5);
    warmBounce.position.set(2.6, -0.4, 2.8);
    scene.add(warmBounce);

    const disposablesGeo: THREE.BufferGeometry[] = [];
    const disposablesMat: THREE.Material[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      disposablesGeo.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      disposablesMat.push(m);
      return m;
    };

    // Matte & Satin PBR Character Material Palette
    const skinMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9a07b,
        roughness: 0.62,
        metalness: 0.02,
      })
    );
    const skinShadowMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xc48864,
        roughness: 0.66,
        metalness: 0.02,
      })
    );
    const hairMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1a120e,
        roughness: 0.42,
        metalness: 0.08,
      })
    );
    const hoodieMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x201612,
        roughness: 0.85,
        metalness: 0.04,
      })
    );
    const hoodieTrimMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xe85d04,
        roughness: 0.46,
        metalness: 0.14,
      })
    );
    const copperMetalMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xd96b27,
        roughness: 0.22,
        metalness: 0.88,
        clearcoat: 0.45,
      })
    );
    const bronzeFrameMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x2e1f17,
        roughness: 0.2,
        metalness: 0.86,
      })
    );
    const scleraMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfbf8f3,
        roughness: 0.14,
        metalness: 0.0,
      })
    );
    const irisMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x18110d,
        roughness: 0.08,
        metalness: 0.06,
      })
    );
    const catchlightMat = trackMat(
      new THREE.MeshBasicMaterial({ color: 0xfffaf2 })
    );

    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, 0, 0);
    scene.add(rootGroup);

    // 1. Soft Ambient Floating Shadow Beneath Bust
    const shadowTexture = createContactShadowTexture();
    const shadowMesh = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(1.18, 36)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          depthWrite: false,
          opacity: 0.4,
        })
      )
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -1.06, 0.1);
    rootGroup.add(shadowMesh);

    // 2. Clean Compact Character Rig (~0.95x scale)
    const characterRig = new THREE.Group();
    const BASE_CHARACTER_Y = -0.82;
    characterRig.position.set(0, BASE_CHARACTER_Y, 0.1);
    characterRig.scale.setScalar(0.95);
    rootGroup.add(characterRig);

    const upperBody = new THREE.Group();
    characterRig.add(upperBody);

    // Tailored sculpted matte espresso hoodie bust
    const torsoProfile = [
      new THREE.Vector2(0.01, 0.04),
      new THREE.Vector2(0.32, 0.06),
      new THREE.Vector2(0.45, 0.14),
      new THREE.Vector2(0.51, 0.3),
      new THREE.Vector2(0.55, 0.62),
      new THREE.Vector2(0.58, 0.86),
      new THREE.Vector2(0.52, 1.04),
      new THREE.Vector2(0.32, 1.18),
      new THREE.Vector2(0.24, 1.2),
    ];
    const torso = new THREE.Mesh(
      trackGeo(new THREE.LatheGeometry(torsoProfile, 40)),
      hoodieMat
    );
    torso.scale.set(1.06, 1.0, 0.72);
    torso.position.set(0, 0.0, 0);
    upperBody.add(torso);

    // Smooth tailored shoulder slope
    const shoulders = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.24, 0.76, 16, 28)),
      hoodieMat
    );
    shoulders.rotation.z = Math.PI / 2;
    shoulders.scale.set(1.0, 1.0, 0.88);
    shoulders.position.set(0, 0.96, -0.02);
    upperBody.add(shoulders);

    // Sculpted hoodie collar + burnt-orange inner accent trim
    const outerCollar = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.31, 0.095, 18, 36)),
      hoodieMat
    );
    outerCollar.rotation.x = Math.PI / 2 + 0.18;
    outerCollar.position.set(0, 1.19, 0.02);
    upperBody.add(outerCollar);

    const burntOrangeCollarAccent = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.265, 0.035, 16, 36)),
      hoodieTrimMat
    );
    burntOrangeCollarAccent.rotation.x = Math.PI / 2 + 0.18;
    burntOrangeCollarAccent.position.set(0, 1.23, 0.04);
    upperBody.add(burntOrangeCollarAccent);

    // Minimal front zipper accent
    const frontSeam = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.012, 0.36, 8, 12)),
      copperMetalMat
    );
    frontSeam.position.set(0, 0.95, 0.415);
    frontSeam.rotation.x = -0.08;
    upperBody.add(frontSeam);

    // Minimal hoodie drawstrings with copper aglets
    const cordGeo = trackGeo(new THREE.CapsuleGeometry(0.011, 0.22, 8, 12));
    const agletGeo = trackGeo(new THREE.CylinderGeometry(0.015, 0.015, 0.042, 12));
    [-0.12, 0.12].forEach((xPos, idx) => {
      const cord = new THREE.Mesh(cordGeo, hoodieTrimMat);
      cord.position.set(xPos, 0.97, 0.415);
      cord.rotation.z = idx === 0 ? 0.06 : -0.06;
      upperBody.add(cord);

      const aglet = new THREE.Mesh(agletGeo, copperMetalMat);
      aglet.position.set(xPos * 1.08, 0.84, 0.425);
      upperBody.add(aglet);
    });

    // Left Arm (relaxed natural posture)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.59, 0.94, 0);
    upperBody.add(leftArmGroup);

    const leftDeltoid = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.165, 20, 20)),
      hoodieMat
    );
    leftArmGroup.add(leftDeltoid);

    const leftUpperArm = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.142, 0.44, 12, 22)),
      hoodieMat
    );
    leftUpperArm.position.set(-0.07, -0.28, 0.02);
    leftUpperArm.rotation.z = -0.15;
    leftArmGroup.add(leftUpperArm);

    const leftForearm = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.125, 0.32, 12, 22)),
      hoodieMat
    );
    leftForearm.position.set(-0.12, -0.62, 0.11);
    leftForearm.rotation.set(-0.32, 0, -0.05);
    leftArmGroup.add(leftForearm);

    const leftCuff = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.115, 0.02, 12, 24)),
      hoodieTrimMat
    );
    leftCuff.position.set(-0.13, -0.78, 0.17);
    leftCuff.rotation.x = Math.PI / 2 - 0.32;
    leftArmGroup.add(leftCuff);

    const leftHandGroup = new THREE.Group();
    leftHandGroup.position.set(-0.135, -0.87, 0.205);
    leftArmGroup.add(leftHandGroup);

    const leftPalm = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.118, 22, 22)),
      skinMat
    );
    leftPalm.scale.set(0.92, 1.12, 0.56);
    leftHandGroup.add(leftPalm);

    const leftThumb = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.032, 0.075, 8, 12)),
      skinMat
    );
    leftThumb.position.set(0.095, 0.01, 0.02);
    leftThumb.rotation.z = -0.65;
    leftHandGroup.add(leftThumb);

    // Right Arm (articulated shoulder -> forearm -> hand for friendly wave)
    const rightShoulderPivot = new THREE.Group();
    rightShoulderPivot.position.set(0.59, 0.94, 0);
    upperBody.add(rightShoulderPivot);

    const rightDeltoid = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.165, 20, 20)),
      hoodieMat
    );
    rightShoulderPivot.add(rightDeltoid);

    const rightUpperArm = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.142, 0.42, 12, 22)),
      hoodieMat
    );
    rightUpperArm.position.set(0.07, -0.26, 0.02);
    rightUpperArm.rotation.z = 0.16;
    rightShoulderPivot.add(rightUpperArm);

    const rightElbowPivot = new THREE.Group();
    rightElbowPivot.position.set(0.13, -0.49, 0.05);
    rightShoulderPivot.add(rightElbowPivot);

    const rightForearm = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.122, 0.34, 12, 22)),
      hoodieMat
    );
    rightForearm.position.set(0.02, -0.2, 0.09);
    rightForearm.rotation.set(-0.32, 0, 0.06);
    rightElbowPivot.add(rightForearm);

    const rightCuff = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.115, 0.02, 12, 24)),
      hoodieTrimMat
    );
    rightCuff.position.set(0.04, -0.37, 0.15);
    rightCuff.rotation.x = Math.PI / 2 - 0.32;
    rightElbowPivot.add(rightCuff);

    const rightHandGroup = new THREE.Group();
    rightHandGroup.position.set(0.045, -0.46, 0.185);
    rightElbowPivot.add(rightHandGroup);

    const palm = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.118, 22, 22)),
      skinMat
    );
    palm.scale.set(0.92, 1.12, 0.56);
    rightHandGroup.add(palm);

    const thumb = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.032, 0.075, 8, 12)),
      skinMat
    );
    thumb.position.set(-0.095, 0.01, 0.02);
    thumb.rotation.z = 0.65;
    rightHandGroup.add(thumb);

    // Neck
    const neck = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.165, 0.2, 0.34, 28)),
      skinShadowMat
    );
    neck.position.set(0, 1.32, 0.01);
    upperBody.add(neck);

    // Articulated Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.77, 0.02);
    upperBody.add(headGroup);

    const headMesh = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.51, 36, 36)),
      skinMat
    );
    headMesh.scale.set(0.9, 1.08, 0.95);
    headGroup.add(headMesh);

    const chin = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.21, 24, 24)),
      skinMat
    );
    chin.scale.set(1.0, 0.85, 0.88);
    chin.position.set(0, -0.36, 0.14);
    headGroup.add(chin);

    const earGeo = trackGeo(new THREE.SphereGeometry(0.095, 18, 18));
    [-0.45, 0.45].forEach((x) => {
      const ear = new THREE.Mesh(earGeo, skinShadowMat);
      ear.scale.set(0.54, 1.05, 0.82);
      ear.position.set(x, -0.02, -0.02);
      headGroup.add(ear);
    });

    // Sleek Modern Styled Hair
    const hairCrown = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.525, 36, 36)),
      hairMat
    );
    hairCrown.scale.set(0.93, 0.86, 0.99);
    hairCrown.position.set(0, 0.15, -0.05);
    headGroup.add(hairCrown);

    const hairTopWave = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.155, 0.44, 14, 24)),
      hairMat
    );
    hairTopWave.position.set(-0.04, 0.41, 0.12);
    hairTopWave.rotation.set(0.22, 0.14, 1.38);
    headGroup.add(hairTopWave);

    const hairFringe = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.115, 0.34, 12, 20)),
      hairMat
    );
    hairFringe.position.set(0.11, 0.34, 0.27);
    hairFringe.rotation.set(0.28, -0.22, 1.24);
    headGroup.add(hairFringe);

    const hairLeftFade = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.11, 0.28, 12, 20)),
      hairMat
    );
    hairLeftFade.position.set(-0.41, 0.13, -0.02);
    hairLeftFade.rotation.z = 0.08;
    headGroup.add(hairLeftFade);

    const hairRightFade = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.11, 0.28, 12, 20)),
      hairMat
    );
    hairRightFade.position.set(0.41, 0.13, -0.02);
    hairRightFade.rotation.z = -0.08;
    headGroup.add(hairRightFade);

    const hairBack = new THREE.Mesh(
      trackGeo(new THREE.SphereGeometry(0.45, 24, 24)),
      hairMat
    );
    hairBack.scale.set(0.96, 0.92, 0.72);
    hairBack.position.set(0, 0.04, -0.22);
    headGroup.add(hairBack);

    // Cursor-Tracking Eyes
    const createEye = (xOffset: number) => {
      const eyeSocket = new THREE.Group();
      eyeSocket.position.set(xOffset, 0.03, 0.43);

      const sclera = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.082, 22, 22)),
        scleraMat
      );
      sclera.scale.set(1.0, 1.0, 0.65);
      eyeSocket.add(sclera);

      const pupilGroup = new THREE.Group();
      const iris = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.049, 18, 18)),
        irisMat
      );
      iris.position.set(0, 0, 0.045);
      iris.scale.set(1.0, 1.0, 0.55);
      pupilGroup.add(iris);

      const catchlight = new THREE.Mesh(
        trackGeo(new THREE.SphereGeometry(0.014, 10, 10)),
        catchlightMat
      );
      catchlight.position.set(0.017, 0.017, 0.07);
      pupilGroup.add(catchlight);

      eyeSocket.add(pupilGroup);
      headGroup.add(eyeSocket);
      return pupilGroup;
    };

    const leftPupil = createEye(-0.165);
    const rightPupil = createEye(0.165);

    const browGeo = trackGeo(new THREE.CapsuleGeometry(0.019, 0.115, 8, 12));
    const leftBrow = new THREE.Mesh(browGeo, hairMat);
    leftBrow.position.set(-0.165, 0.165, 0.445);
    leftBrow.rotation.z = Math.PI / 2 - 0.07;
    headGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, hairMat);
    rightBrow.position.set(0.165, 0.165, 0.445);
    rightBrow.rotation.z = Math.PI / 2 + 0.07;
    headGroup.add(rightBrow);

    // Thin brushed-bronze architect glasses
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.03, 0.505);
    headGroup.add(glassesGroup);

    const frameRingGeo = trackGeo(new THREE.TorusGeometry(0.128, 0.011, 12, 36));
    const leftLensRing = new THREE.Mesh(frameRingGeo, bronzeFrameMat);
    leftLensRing.position.set(-0.17, 0, 0);
    glassesGroup.add(leftLensRing);

    const rightLensRing = new THREE.Mesh(frameRingGeo, bronzeFrameMat);
    rightLensRing.position.set(0.17, 0, 0);
    glassesGroup.add(rightLensRing);

    const bridge = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.009, 0.072, 6, 10)),
      bronzeFrameMat
    );
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0.014, 0);
    glassesGroup.add(bridge);

    const templeGeo = trackGeo(new THREE.CapsuleGeometry(0.0085, 0.43, 6, 10));
    [-0.305, 0.305].forEach((x) => {
      const temple = new THREE.Mesh(templeGeo, bronzeFrameMat);
      temple.rotation.x = Math.PI / 2;
      temple.position.set(x, 0.01, -0.23);
      glassesGroup.add(temple);
    });

    const nose = new THREE.Mesh(
      trackGeo(new THREE.CapsuleGeometry(0.03, 0.068, 10, 14)),
      skinShadowMat
    );
    nose.position.set(0, -0.065, 0.485);
    nose.rotation.x = 0.22;
    headGroup.add(nose);

    const smile = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.098, 0.014, 10, 24, Math.PI * 0.7)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x6b3c2c,
          roughness: 0.45,
          metalness: 0.0,
        })
      )
    );
    smile.position.set(0, -0.17, 0.465);
    smile.rotation.z = Math.PI + Math.PI * 0.15;
    headGroup.add(smile);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let isVisible = true;
    let isTabVisible = !document.hidden;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let lastPointerTime = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isVisible || !isTabVisible) return;
      const now = performance.now();
      if (now - lastPointerTime < 33) return;
      lastPointerTime = now;

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetX = THREE.MathUtils.clamp(nx, -1, 1);
      targetY = THREE.MathUtils.clamp(ny, -1, 1);
    };

    const handlePointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave);

    const updatePose = (elapsed: number, delta: number) => {
      const dt = Math.min(delta, 0.08);
      currentX = THREE.MathUtils.damp(currentX, targetX, 5.2, dt);
      currentY = THREE.MathUtils.damp(currentY, targetY, 5.2, dt);

      // Gentle idle breathing
      const breath = Math.sin(elapsed * 1.9);
      upperBody.position.y = breath * 0.02;
      upperBody.scale.set(1 + breath * 0.008, 1 + breath * 0.01, 1);

      // Friendly wave & warm nod decay
      let waveAmount = 0;
      let nodOffset = 0;
      if (waveProgressRef.current > 0.001) {
        waveProgressRef.current = Math.max(
          0,
          waveProgressRef.current - dt * 0.44
        );
        const p = waveProgressRef.current;
        waveAmount = Math.sin(p * Math.PI);
        nodOffset = Math.sin(p * Math.PI * 2) * 0.12 * waveAmount;
      }

      // Head tracking toward cursor + subtle nod
      headGroup.rotation.y = currentX * 0.34;
      headGroup.rotation.x = currentY * 0.2 + nodOffset;
      headGroup.rotation.z = -currentX * 0.05;

      // Subtle eye tracking inside sockets
      const eyeX = currentX * 0.022;
      const eyeY = -currentY * 0.016;
      leftPupil.position.set(eyeX, eyeY, 0);
      rightPupil.position.set(eyeX, eyeY, 0);

      // Right arm friendly wave articulation
      const waveOsc = Math.sin(elapsed * 11.5) * 0.34 * waveAmount;
      rightShoulderPivot.rotation.z = THREE.MathUtils.lerp(
        0.04,
        1.78,
        waveAmount
      );
      rightShoulderPivot.rotation.x = THREE.MathUtils.lerp(
        0,
        -0.38,
        waveAmount
      );
      rightElbowPivot.rotation.z = THREE.MathUtils.lerp(
        0,
        0.58 + waveOsc,
        waveAmount
      );
      rightHandGroup.rotation.z = waveOsc * 0.6;

      // Gentle studio floating drift & subtle body sway
      const floatY = Math.sin(elapsed * 1.35) * 0.04;
      characterRig.position.y = BASE_CHARACTER_Y + floatY;
      characterRig.rotation.y = Math.sin(elapsed * 0.6) * 0.055 + currentX * 0.11;
      const shadowScale = 1 - floatY * 0.65;
      shadowMesh.scale.set(shadowScale, shadowScale, 1);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(Math.floor(entry.contentRect.width), 240);
      const h = Math.max(Math.floor(entry.contentRect.height), 260);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    });
    resizeObserver.observe(container);

    let disposed = false;
    let frameId = 0;
    let timerId = 0;
    let lastTime = performance.now();
    let elapsed = 0.85;

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

      updatePose(elapsed, delta);
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
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible && isVisible) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    updatePose(elapsed, 0.016);
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

      disposablesGeo.forEach((g) => g.dispose());
      disposablesMat.forEach((m) => m.dispose());
      shadowTexture.dispose();
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Refined Animated Welcome Headline Above 3D Avatar (Zero Box, Zero Border) */}
      <div
        data-testid="avatar-welcome-headline"
        className="relative z-20 min-h-[38px] mb-2 flex items-center justify-center text-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={WELCOME_HEADLINES[welcomeIndex]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-full bg-[#FF5E0E] shrink-0 shadow-[0_0_12px_rgba(255,94,14,0.7)]"
            />
            <p
              className={`font-display text-xl sm:text-2xl font-semibold tracking-tight ${
                darkTopStage
                  ? "text-[#1C1410] lg:text-[#FAF6F0]"
                  : "text-[#1C1410]"
              }`}
            >
              {WELCOME_HEADLINES[welcomeIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compact Studio Stage + Interactive 3D Amit Character (~0.95x, Warm Rim Lighting Across Horizon) */}
      <div className="relative w-full max-w-[360px] h-[280px] sm:h-[310px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-full opacity-90"
          style={{
            background: darkTopStage
              ? "radial-gradient(circle at 50% 42%, rgba(255, 94, 14, 0.24) 0%, rgba(244, 162, 97, 0.14) 42%, rgba(250, 246, 240, 0) 74%)"
              : "radial-gradient(circle, rgba(244, 140, 6, 0.14) 0%, rgba(232, 93, 4, 0.05) 48%, rgba(250, 246, 240, 0) 74%)",
          }}
        />
        {webglReady ? (
          <div
            ref={mountRef}
            onClick={handleAvatarClick}
            role="button"
            tabIndex={0}
            aria-label="Wave to Amit and open Ask Amit assistant"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleAvatarClick();
              }
            }}
            className="relative z-10 w-full h-full cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] rounded-3xl"
          />
        ) : (
          <button
            type="button"
            onClick={handleAvatarClick}
            className="relative z-10 w-full h-full rounded-3xl bg-[#F0E7DB] border border-[#18110D]/12 flex flex-col items-center justify-center p-8 text-center cursor-pointer"
          >
            <span className="w-16 h-16 rounded-full bg-[#18110D] text-[#FBF8F3] font-display font-bold text-xl flex items-center justify-center">
              AK
            </span>
            <span className="mt-4 font-display font-bold text-lg text-[#18110D]">
              Amit Kumar
            </span>
          </button>
        )}
      </div>

      {/* Compact 1.8s Rotating Single-Line Quick-Action Prompt Below 3D Avatar */}
      <div
        data-testid="avatar-floating-prompt"
        onMouseEnter={() => setIsSpotlightPaused(true)}
        onMouseLeave={() => setIsSpotlightPaused(false)}
        onFocusCapture={() => setIsSpotlightPaused(true)}
        onBlurCapture={() => setIsSpotlightPaused(false)}
        className="relative z-20 mt-2 w-full max-w-[460px] min-h-[54px] px-2 flex items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSpotlight.id}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center"
          >
            <p
              data-testid="spotlight-prompt-text"
              className="font-display text-[15px] sm:text-[16px] font-semibold tracking-[-0.015em] leading-[1.35] text-[#2F241E]"
            >
              {activeSpotlight.prompt}
            </p>

            <button
              type="button"
              data-testid="spotlight-action-button"
              onClick={activeSpotlight.onAction}
              className={`group inline-flex items-center justify-center gap-1.5 min-h-[44px] px-4.5 py-2 rounded-full text-[13.5px] font-semibold active:scale-[0.98] transition-[background-color,transform] duration-150 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E85D04] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF6F0] ${
                activeSpotlight.emphasis === "orange"
                  ? "bg-[#E85D04] hover:bg-[#D14F00] text-[#FAF6F0] shadow-[0_10px_24px_-12px_rgba(232,93,4,0.68)]"
                  : "bg-[#140E0B] hover:bg-[#E85D04] text-[#FAF6F0] shadow-[0_10px_22px_-12px_rgba(20,14,11,0.52)]"
              }`}
            >
              <span>{activeSpotlight.ctaLabel}</span>
              {activeSpotlight.direction === "up-right" ? (
                <ArrowUpRight
                  className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDown
                  className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              )}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
