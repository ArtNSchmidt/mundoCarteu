"use client";

import { useMemo } from "react";
import {
  generateLinearPoints,
  generateQuadraticPoints,
  calcRoots,
  calcVertex,
  type Point,
} from "@/utils/mathHelpers";

export type FunctionDegree = 1 | 2;

export interface GraphLogic {
  points: Point[];
  roots: { x1: number; x2: number } | null;
  vertex: Point | null;
  yIntercept: number;
  degree: FunctionDegree;
}

export function useGraphLogic(a: number, b: number, c: number): GraphLogic {
  const degree: FunctionDegree = a !== 0 ? 2 : 1;

  const points = useMemo(() => {
    return degree === 2
      ? generateQuadraticPoints(a, b, c)
      : generateLinearPoints(b, c);
  }, [a, b, c, degree]);

  const roots = useMemo(() => calcRoots(a, b, c), [a, b, c]);
  const vertex = useMemo(() => calcVertex(a, b, c), [a, b, c]);

  return {
    points,
    roots,
    vertex,
    yIntercept: c,
    degree,
  };
}
