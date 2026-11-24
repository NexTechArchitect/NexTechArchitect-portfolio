export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Vec3WithDepth {
  x: number;
  y: number;
  z: number;
  w: number;
  scale: number;
}

export interface Rotation4D {
  xw: number;
  yw: number;
  zw: number;
  xy?: number;
}

export type EdgePair = readonly [number, number];

/**
 * Generates the 16 canonical vertices of a unit 4D hypercube (tesseract)
 * at coordinates (+-1, +-1, +-1, +-1).
 */
export function createTesseractVertices(): readonly Vec4[] {
  const vertices: Vec4[] = [];
  for (let i = 0; i < 16; i += 1) {
    vertices.push({
      x: i & 1 ? 1 : -1,
      y: i & 2 ? 1 : -1,
      z: i & 4 ? 1 : -1,
      w: i & 8 ? 1 : -1,
    });
  }
  return vertices;
}

/**
 * Generates the 32 unique edges connecting vertices that differ in exactly
 * one coordinate (Hamming distance 1 in 4-bit vertex index).
 */
export function createTesseractEdges(): readonly EdgePair[] {
  const edges: EdgePair[] = [];
  for (let i = 0; i < 16; i += 1) {
    for (let bit = 0; bit < 4; bit += 1) {
      const j = i ^ (1 << bit);
      if (i < j) {
        edges.push([i, j]);
      }
    }
  }
  return edges;
}

/**
 * Rotates a 4D point sequentially across the XW, YW, ZW, and optional XY planes.
 * Preserves the 4D Euclidean norm.
 */
export function rotate4DPoint(point: Vec4, angles: Rotation4D): Vec4 {
  let { x, y, z, w } = point;

  // XW plane rotation
  const cosXW = Math.cos(angles.xw);
  const sinXW = Math.sin(angles.xw);
  const x1 = x * cosXW - w * sinXW;
  const w1 = x * sinXW + w * cosXW;
  x = x1;
  w = w1;

  // YW plane rotation
  const cosYW = Math.cos(angles.yw);
  const sinYW = Math.sin(angles.yw);
  const y1 = y * cosYW - w * sinYW;
  const w2 = y * sinYW + w * cosYW;
  y = y1;
  w = w2;

  // ZW plane rotation
  const cosZW = Math.cos(angles.zw);
  const sinZW = Math.sin(angles.zw);
  const z1 = z * cosZW - w * sinZW;
  const w3 = z * sinZW + w * cosZW;
  z = z1;
  w = w3;

  // Optional subtle XY plane rotation
  if (angles.xy) {
    const cosXY = Math.cos(angles.xy);
    const sinXY = Math.sin(angles.xy);
    const x2 = x * cosXY - y * sinXY;
    const y2 = x * sinXY + y * cosXY;
    x = x2;
    y = y2;
  }

  return { x, y, z, w };
}

/**
 * Stereographic / perspective projection from 4D into 3D space.
 * cameraDistance must be strictly greater than max(|w|), typically ~3.1.
 */
export function project4DTo3D(
  point: Vec4,
  cameraDistance = 3.15,
  scaleFactor = 1.15
): Vec3WithDepth {
  const denom = Math.max(0.65, cameraDistance - point.w);
  const inv = 1 / denom;
  const scale = inv * scaleFactor;
  return {
    x: point.x * scale,
    y: point.y * scale,
    z: point.z * scale,
    w: point.w,
    scale,
  };
}

/**
 * Zero-allocation projection helper for 60fps WebGL render loops.
 * Writes projected (x, y, z) into outPositions (length >= vertices.length * 3)
 * and normalized w depth [0..1] into outDepths (length >= vertices.length).
 */
export function projectTesseractIntoBuffers(
  vertices: readonly Vec4[],
  angles: Rotation4D,
  outPositions: Float32Array,
  outDepths: Float32Array,
  cameraDistance = 3.15,
  scaleFactor = 1.65
): void {
  const cosXW = Math.cos(angles.xw);
  const sinXW = Math.sin(angles.xw);
  const cosYW = Math.cos(angles.yw);
  const sinYW = Math.sin(angles.yw);
  const cosZW = Math.cos(angles.zw);
  const sinZW = Math.sin(angles.zw);
  const hasXY = Boolean(angles.xy);
  const cosXY = hasXY ? Math.cos(angles.xy ?? 0) : 1;
  const sinXY = hasXY ? Math.sin(angles.xy ?? 0) : 0;

  for (let i = 0; i < vertices.length; i += 1) {
    const v = vertices[i];
    let x = v.x;
    let y = v.y;
    let z = v.z;
    let w = v.w;

    const x1 = x * cosXW - w * sinXW;
    const w1 = x * sinXW + w * cosXW;
    x = x1;
    w = w1;

    const y1 = y * cosYW - w * sinYW;
    const w2 = y * sinYW + w * cosYW;
    y = y1;
    w = w2;

    const z1 = z * cosZW - w * sinZW;
    const w3 = z * sinZW + w * cosZW;
    z = z1;
    w = w3;

    if (hasXY) {
      const x2 = x * cosXY - y * sinXY;
      const y2 = x * sinXY + y * cosXY;
      x = x2;
      y = y2;
    }

    const denom = Math.max(0.65, cameraDistance - w);
    const factor = scaleFactor / denom;

    const offset = i * 3;
    outPositions[offset] = x * factor;
    outPositions[offset + 1] = y * factor;
    outPositions[offset + 2] = z * factor;

    // Normalize w from [-2, 2] into [0, 1] for vertex color & node scale modulation
    outDepths[i] = Math.min(1, Math.max(0, (w + 1.8) / 3.6));
  }
}
