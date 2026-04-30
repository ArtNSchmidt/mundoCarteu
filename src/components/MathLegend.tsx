"use client";

import type { FunctionDegree } from "@/hooks/useGraphLogic";
import type { Point } from "@/utils/mathHelpers";

interface MathLegendProps {
  a: number;
  b: number;
  c: number;
  degree: FunctionDegree;
  roots: { x1: number; x2: number } | null;
  vertex: Point | null;
  yIntercept: number;
}

function fmt(n: number) {
  return parseFloat(n.toFixed(2)).toString();
}

export default function MathLegend({
  a, b, c, degree, roots, vertex, yIntercept,
}: MathLegendProps) {
  const delta = b * b - 4 * a * c;

  const rootsText = roots
    ? roots.x1 === roots.x2
      ? `x = ${fmt(roots.x1)}`
      : `${fmt(roots.x1)}, ${fmt(roots.x2)}`
    : "Nenhuma";

  const cards = [
    {
      label: "RAIZES (x1, x2)",
      value: rootsText,
      color: roots ? "#00dbe7" : "#ffb4ab",
    },
    {
      label: "VERTICE (xv, yv)",
      value: vertex && degree === 2 ? `(${fmt(vertex.x)}, ${fmt(vertex.y)})` : "---",
      color: "#00dbe7",
    },
    {
      label: "CONCAVIDADE",
      value: degree === 2 ? (a > 0 ? "Para cima" : "Para baixo") : "---",
      color: "#ebb2ff",
    },
    {
      label: "CORTE EIXO Y",
      value: `y = ${fmt(yIntercept)}`,
      color: "#dce4e4",
    },
  ];

  return (
    <div className="glass-panel rounded-xl p-5">
      <h3
        className="text-white text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <span className="material-symbols-outlined text-[#849495] text-xl">analytics</span>
        Informacoes
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-[#080f10] p-3 rounded-lg border border-[#3a494b]"
          >
            <span
              className="block text-[10px] uppercase tracking-widest text-[#849495] mb-1"
              style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
            >
              {label}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color, fontFamily: "Inter, sans-serif", fontWeight: 500 }}
            >
              {value}
            </span>
          </div>
        ))}

        {degree === 2 && (
          <div className="bg-[#080f10] p-3 rounded-lg border border-[#3a494b] col-span-2">
            <span
              className="block text-[10px] uppercase tracking-widest text-[#849495] mb-1"
              style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
            >
              DISCRIMINANTE (Delta)
            </span>
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: delta >= 0 ? "#00dbe7" : "#ffb4ab", fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {fmt(delta)}
              </span>
              <span
                className="text-[11px] italic text-[#849495]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {delta > 0 ? "Dois zeros reais" : delta === 0 ? "Raiz dupla" : "Nao corta o eixo x"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
