export type Point = { x: number; y: number };

/**
 * Gera pontos para função de 1º grau: f(x) = bx + c
 * O coeficiente 'a' deve ser 0 para 1º grau.
 */
export function generateLinearPoints(b: number, c: number, range = 10, steps = 200): Point[] {
  const points: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    const y = b * x + c;
    points.push({ x, y });
  }
  return points;
}

/**
 * Gera pontos para função de 2º grau: f(x) = ax² + bx + c
 */
export function generateQuadraticPoints(a: number, b: number, c: number, range = 10, steps = 200): Point[] {
  const points: Point[] = [];
  const step = (range * 2) / steps;
  for (let i = 0; i <= steps; i++) {
    const x = -range + i * step;
    const y = a * x * x + b * x + c;
    points.push({ x, y });
  }
  return points;
}

/**
 * Calcula as raízes de ax² + bx + c = 0 via Bhaskara.
 * Retorna null se não houver raízes reais.
 */
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

/**
 * Calcula o vértice da parábola: V = (-b/2a, -Δ/4a)
 */
export function calcVertex(a: number, b: number, c: number): Point | null {
  if (a === 0) return null;
  const xv = -b / (2 * a);
  const yv = -(b * b - 4 * a * c) / (4 * a);
  return { x: xv, y: yv };
}
