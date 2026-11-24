import test from "node:test";
import assert from "node:assert/strict";
import {
  createTesseractVertices,
  createTesseractEdges,
  rotate4DPoint,
  project4DTo3D,
  projectTesseractIntoBuffers,
} from "./tesseract4d";

test("tesseract geometry contains 16 unique vertices and 32 unit edges", () => {
  const vertices = createTesseractVertices();
  const edges = createTesseractEdges();

  assert.equal(vertices.length, 16);
  assert.equal(edges.length, 32);

  const uniqueKeys = new Set(
    vertices.map((v) => `${v.x},${v.y},${v.z},${v.w}`)
  );
  assert.equal(uniqueKeys.size, 16);

  for (const [a, b] of edges) {
    const va = vertices[a];
    const vb = vertices[b];
    const distSq =
      (va.x - vb.x) ** 2 +
      (va.y - vb.y) ** 2 +
      (va.z - vb.z) ** 2 +
      (va.w - vb.w) ** 2;
    assert.equal(distSq, 4, `Edge (${a},${b}) should have squared length 4`);
  }
});

test("4D plane rotations preserve Euclidean norm", () => {
  const vertices = createTesseractVertices();
  const angles = { xw: 0.73, yw: 1.41, zw: -0.58, xy: 0.31 };

  for (const v of vertices) {
    const rotated = rotate4DPoint(v, angles);
    const normSq =
      rotated.x ** 2 + rotated.y ** 2 + rotated.z ** 2 + rotated.w ** 2;
    assert.ok(
      Math.abs(normSq - 4) < 1e-10,
      `Expected norm squared 4, got ${normSq}`
    );
  }
});

test("4D-to-3D projection scales nearer W coordinates larger than farther W", () => {
  const near = project4DTo3D({ x: 1, y: 1, z: 1, w: 1 }, 3.2, 1.5);
  const far = project4DTo3D({ x: 1, y: 1, z: 1, w: -1 }, 3.2, 1.5);

  assert.ok(Number.isFinite(near.x) && Number.isFinite(far.x));
  assert.ok(near.scale > far.scale);
  assert.ok(near.x > far.x);
});

test("zero-allocation buffer projection populates finite coordinates and [0,1] depths", () => {
  const vertices = createTesseractVertices();
  const positions = new Float32Array(vertices.length * 3);
  const depths = new Float32Array(vertices.length);

  projectTesseractIntoBuffers(
    vertices,
    { xw: 0.5, yw: 0.9, zw: 0.25, xy: 0.15 },
    positions,
    depths
  );

  for (let i = 0; i < positions.length; i += 1) {
    assert.ok(Number.isFinite(positions[i]));
  }
  for (let i = 0; i < depths.length; i += 1) {
    assert.ok(depths[i] >= 0 && depths[i] <= 1);
  }
});
