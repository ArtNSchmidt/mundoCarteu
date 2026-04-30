"use client";

import type { ChangeEvent } from "react";
import type { FunctionDegree } from "@/hooks/useGraphLogic";

interface FunctionFormProps {
  a: number;
  b: number;
  c: number;
  degree: FunctionDegree;
  onChange: (field: "a" | "b" | "c", value: number) => void;
  onReset: () => void;
}

function fmt(n: number) {
  return parseFloat(n.toFixed(1)).toString();
}

const PARAMS: { field: "a" | "b" | "c"; color: string }[] = [
  { field: "a", color: "#ebb2ff" },
  { field: "b", color: "#2ae500" },
  { field: "c", color: "#ffffff" },
];

export default function FunctionForm({
  a, b, c, degree, onChange, onReset,
}: FunctionFormProps) {
  const vals: Record<"a" | "b" | "c", number> = { a, b, c };

  function handle(field: "a" | "b" | "c") {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      onChange(field, isNaN(v) ? 0 : v);
    };
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Equation display */}
      <div className="glass-panel rounded-xl p-5 math-glow-border">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] uppercase tracking-widest text-[#849495]"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
          >
            FUNCAO ATUAL
          </span>
          <span
            className="bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
          >
            {degree === 2 ? "Quadratica" : "Linear"}
          </span>
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-x-1 bg-[#080f10] rounded-lg py-3 px-4 border border-[#3a494b] glow-text-cyan"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 18 }}
        >
          <span style={{ color: "#00dbe7" }}>f(x)</span>
          <span style={{ color: "#849495" }}>=</span>
          {degree === 2 && (
            <>
              <span style={{ color: "#ebb2ff", fontWeight: 700 }}>{fmt(a)}</span>
              <span style={{ color: "#dce4e4" }}>x&sup2;</span>
              <span style={{ color: "#849495" }}>{b >= 0 ? "+" : "−"}</span>
              <span style={{ color: "#2ae500", fontWeight: 700 }}>{fmt(Math.abs(b))}</span>
              <span style={{ color: "#dce4e4" }}>x</span>
              <span style={{ color: "#849495" }}>{c >= 0 ? "+" : "−"}</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>{fmt(Math.abs(c))}</span>
            </>
          )}
          {degree === 1 && (
            <>
              <span style={{ color: "#2ae500", fontWeight: 700 }}>{fmt(b)}</span>
              <span style={{ color: "#dce4e4" }}>x</span>
              <span style={{ color: "#849495" }}>{c >= 0 ? "+" : "−"}</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>{fmt(Math.abs(c))}</span>
            </>
          )}
        </div>
      </div>

      {/* Parameter sliders */}
      <div className="glass-panel rounded-xl p-5">
        <h3
          className="text-[#00dbe7] text-xl font-semibold mb-5 flex items-center gap-2"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span className="material-symbols-outlined text-xl">tune</span>
          Parametros
        </h3>
        <div className="flex flex-col gap-6">
          {PARAMS.map(({ field, color }) => (
            <div key={field} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-xl font-medium"
                  style={{ color, fontFamily: "Inter, sans-serif" }}
                >
                  {field}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="-50"
                  max="50"
                  value={vals[field]}
                  onChange={handle(field)}
                  className="bg-[#080f10] border border-[#3a494b] px-3 py-1 rounded text-sm w-16 text-right focus:outline-none focus:ring-2 focus:ring-[#00dbe7] transition-colors"
                  style={{ color, fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                  aria-label={`Editar parâmetro ${field}`}
                />
              </div>
              <input
                className="clay-slider"
                type="range"
                min="-50"
                max="50"
                step="0.1"
                value={vals[field]}
                onChange={handle(field)}
              />
            </div>
          ))}
        </div>
        {/* Botões removidos conforme solicitado */}
      </div>
    </div>
  );
}
