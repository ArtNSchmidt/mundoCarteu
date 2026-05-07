export type Point = { x: number; y: number };

export type FunctionType =
  | "linear"
  | "quadratic"
  | "cubic"
  | "exponential"
  | "logarithmic"
  | "sine"
  | "cosine"
  | "tangent"
  | "rational"
  | "absolute";

// ── Polynomial ───────────────────────────────────────────────────────────────

// f(x) = a·x + b
export function generateLinearPoints(a: number, b: number, range = 10, steps = 200): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    pts.push({ x, y: a * x + b });
  }
  return pts;
}

// f(x) = a·x² + b·x + c
export function generateQuadraticPoints(a: number, b: number, c: number, range = 10, steps = 200): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    pts.push({ x, y: a * x * x + b * x + c });
  }
  return pts;
}

// f(x) = a·x³ + b·x² + c·x + d
export function generateCubicPoints(a: number, b: number, c: number, d: number, range = 5, steps = 300): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    pts.push({ x, y: a * x ** 3 + b * x ** 2 + c * x + d });
  }
  return pts;
}

// ── Growth & Scale ───────────────────────────────────────────────────────────

// f(x) = a·e^(b·x) + c
export function generateExponentialPoints(a: number, b: number, c: number, range = 6, steps = 300): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    const y = a * Math.exp(b * x) + c;
    pts.push({ x, y: Math.abs(y) > 1e5 ? NaN : y });
  }
  return pts;
}

// f(x) = a·ln(x + b) + c  — domain: x + b > 0
export function generateLogarithmicPoints(a: number, b: number, c: number, range = 10, steps = 300): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    const arg = x + b;
    pts.push({ x, y: arg > 0 ? a * Math.log(arg) + c : NaN });
  }
  return pts;
}

// ── Periodic ─────────────────────────────────────────────────────────────────

// f(x) = a·sin(b·x + c) + d
export function generateSinePoints(a: number, b: number, c: number, d: number, range = 10, steps = 400): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    pts.push({ x, y: a * Math.sin(b * x + c) + d });
  }
  return pts;
}

// f(x) = a·cos(b·x + c) + d
export function generateCosinePoints(a: number, b: number, c: number, d: number, range = 10, steps = 400): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    pts.push({ x, y: a * Math.cos(b * x + c) + d });
  }
  return pts;
}

// f(x) = a·tan(b·x + c) + d  — discontinuous at b·x + c = π/2 + n·π
export function generateTangentPoints(a: number, b: number, c: number, d: number, range = 5, steps = 600): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  let prevY: number | null = null;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    const raw = a * Math.tan(b * x + c) + d;
    const y = isFinite(raw) ? raw : NaN;
    if (prevY !== null && isFinite(y) && Math.abs(y - prevY) > 80) {
      pts.push({ x, y: NaN });
    } else {
      pts.push({ x, y });
    }
    prevY = isFinite(y) ? y : null;
  }
  return pts;
}

// ── Relation & Break ─────────────────────────────────────────────────────────

// f(x) = a / (x − b) + c  — vertical asymptote at x = b
export function generateRationalPoints(a: number, b: number, c: number, range = 10, steps = 400): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  let prevY: number | null = null;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    const denom = x - b;
    const raw = Math.abs(denom) < 0.001 ? NaN : a / denom + c;
    const y = isFinite(raw) ? raw : NaN;
    if (prevY !== null && isFinite(y) && Math.abs(y - prevY) > 80) {
      pts.push({ x, y: NaN });
    } else {
      pts.push({ x, y });
    }
    prevY = isFinite(y) ? y : null;
  }
  return pts;
}

// f(x) = a·|x − b| + c
export function generateAbsolutePoints(a: number, b: number, c: number, range = 10, steps = 200): Point[] {
  const pts: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    pts.push({ x, y: a * Math.abs(x - b) + c });
  }
  return pts;
}

// ── Analytical Helpers ────────────────────────────────────────────────────────

// Bhaskara for a·x² + b·x + c = 0
export function calcRoots(a: number, b: number, c: number): { x1: number; x2: number } | null {
  if (a === 0) {
    if (b === 0) return null;
    return { x1: -c / b, x2: -c / b };
  }
  const delta = b * b - 4 * a * c;
  if (delta < 0) return null;
  return {
    x1: (-b + Math.sqrt(delta)) / (2 * a),
    x2: (-b - Math.sqrt(delta)) / (2 * a),
  };
}

// Vertex of a·x² + b·x + c
export function calcVertex(a: number, b: number, c: number): Point | null {
  if (a === 0) return null;
  const xv = -b / (2 * a);
  const yv = -(b * b - 4 * a * c) / (4 * a);
  return { x: xv, y: yv };
}

// Inflection point of a·x³ + b·x² + c·x + d  (where f'' = 0)
export function calcCubicInflection(a: number, b: number, c: number, d: number): Point | null {
  if (a === 0) return null;
  const xi = -b / (3 * a);
  const yi = a * xi ** 3 + b * xi ** 2 + c * xi + d;
  return { x: xi, y: yi };
}
