"use client";

import { useMemo } from "react";
import {
  generateLinearPoints,
  generateQuadraticPoints,
  generateCubicPoints,
  generateExponentialPoints,
  generateLogarithmicPoints,
  generateSinePoints,
  generateCosinePoints,
  generateTangentPoints,
  generateRationalPoints,
  generateAbsolutePoints,
  calcRoots,
  calcVertex,
  calcCubicInflection,
  type Point,
  type FunctionType,
} from "@/utils/mathHelpers";

export type { FunctionType };

export interface Asymptote {
  type: "vertical" | "horizontal";
  value: number;
}

export interface GraphData {
  points: Point[];
  asymptotes: Asymptote[];
  vertex: Point | null;
  inflection: Point | null;
  roots: { x1: number; x2: number } | null;
  yIntercept: number | null;
  period: number | null;
  amplitude: number | null;
  concavity: string | null;
  domain: string;
  image: string;
}

export function useGraphLogic(
  type: FunctionType,
  a: number,
  b: number,
  c: number,
  d: number
): GraphData {
  const points = useMemo(() => {
    switch (type) {
      case "linear":      return generateLinearPoints(a, b);
      case "quadratic":   return generateQuadraticPoints(a, b, c);
      case "cubic":       return generateCubicPoints(a, b, c, d);
      case "exponential": return generateExponentialPoints(a, b, c);
      case "logarithmic": return generateLogarithmicPoints(a, b, c);
      case "sine":        return generateSinePoints(a, b, c, d);
      case "cosine":      return generateCosinePoints(a, b, c, d);
      case "tangent":     return generateTangentPoints(a, b, c, d);
      case "rational":    return generateRationalPoints(a, b, c);
      case "absolute":    return generateAbsolutePoints(a, b, c);
    }
  }, [type, a, b, c, d]);

  const asymptotes = useMemo((): Asymptote[] => {
    switch (type) {
      case "rational":
        return [
          { type: "vertical",   value: b },
          { type: "horizontal", value: c },
        ];
      case "tangent": {
        if (b === 0) return [];
        const result: Asymptote[] = [];
        for (let n = -8; n <= 8; n++) {
          const x = (Math.PI / 2 + n * Math.PI - c) / b;
          if (x >= -10 && x <= 10) result.push({ type: "vertical", value: x });
        }
        return result;
      }
      case "logarithmic":
        return [{ type: "vertical", value: -b }];
      case "exponential":
        return [{ type: "horizontal", value: c }];
      default:
        return [];
    }
  }, [type, b, c]);

  const vertex = useMemo((): Point | null => {
    if (type === "quadratic") return calcVertex(a, b, c);
    if (type === "absolute")  return { x: b, y: c };
    return null;
  }, [type, a, b, c]);

  const inflection = useMemo((): Point | null => {
    if (type === "cubic") return calcCubicInflection(a, b, c, d);
    return null;
  }, [type, a, b, c, d]);

  const roots = useMemo(() => {
    if (type === "quadratic") return calcRoots(a, b, c);
    if (type === "linear")    return a === 0 ? null : { x1: -b / a, x2: -b / a };
    return null;
  }, [type, a, b, c]);

  const yIntercept = useMemo((): number | null => {
    switch (type) {
      case "linear":      return b;
      case "quadratic":   return c;
      case "cubic":       return d;
      case "exponential": return a + c;
      case "logarithmic": return b > 0 ? a * Math.log(b) + c : null;
      case "sine":        return a * Math.sin(c) + d;
      case "cosine":      return a * Math.cos(c) + d;
      case "tangent":     return isFinite(Math.tan(c)) ? a * Math.tan(c) + d : null;
      case "rational":    return b === 0 ? null : a / (0 - b) + c;
      case "absolute":    return a * Math.abs(0 - b) + c;
    }
  }, [type, a, b, c, d]);

  const period = useMemo((): number | null => {
    if (b === 0) return null;
    if (type === "sine" || type === "cosine") return (2 * Math.PI) / Math.abs(b);
    if (type === "tangent") return Math.PI / Math.abs(b);
    return null;
  }, [type, b]);

  const amplitude = useMemo((): number | null => {
    if (type === "sine" || type === "cosine") return Math.abs(a);
    return null;
  }, [type, a]);

  const concavity = useMemo((): string | null => {
    switch (type) {
      case "quadratic":
        return a > 0 ? "Para cima  (a > 0)" : a < 0 ? "Para baixo  (a < 0)" : null;
      case "cubic":
        return a > 0 ? "↓ côncava → ↑ convexa" : "↑ convexa → ↓ côncava";
      case "exponential":
        return a * b * b > 0 ? "Côncava para cima" : "Côncava para baixo";
      case "logarithmic":
        return a > 0 ? "Côncava para baixo" : "Côncava para cima";
      case "absolute":
        return a > 0 ? "Abre para cima" : a < 0 ? "Abre para baixo" : null;
      case "sine":
      case "cosine":
        return "Alterna (periódica)";
      default:
        return null;
    }
  }, [type, a, b]);

  const domain = useMemo((): string => {
    switch (type) {
      case "logarithmic": return `x > ${parseFloat((-b).toFixed(2))}`;
      case "rational":    return `x ≠ ${parseFloat(b.toFixed(2))}`;
      default:            return "ℝ";
    }
  }, [type, b]);

  const image = useMemo((): string => {
    const fmt = (n: number) => parseFloat(n.toFixed(2)).toString();
    switch (type) {
      case "sine":
      case "cosine":      return `[${fmt(d - Math.abs(a))},  ${fmt(d + Math.abs(a))}]`;
      case "exponential": return a > 0 ? `(${fmt(c)},  +∞)` : `(-∞,  ${fmt(c)})`;
      case "absolute":    return a > 0 ? `[${fmt(c)},  +∞)` : `(-∞,  ${fmt(c)}]`;
      case "rational":    return `y ≠ ${fmt(c)}`;
      default:            return "ℝ";
    }
  }, [type, a, c, d]);

  return {
    points,
    asymptotes,
    vertex,
    inflection,
    roots,
    yIntercept,
    period,
    amplitude,
    concavity,
    domain,
    image,
  };
}
