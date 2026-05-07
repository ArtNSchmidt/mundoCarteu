"use client";

import { type ChangeEvent } from "react";
import type { FunctionType } from "@/hooks/useGraphLogic";
import {
  CATEGORIES,
  TYPE_CONFIGS,
  getConfig,
  getTypesForCategory,
  type Category,
} from "@/utils/funcTypes";

interface FunctionFormProps {
  funcType: FunctionType;
  params: { a: number; b: number; c: number; d: number };
  onTypeChange: (type: FunctionType) => void;
  onParamChange: (key: "a" | "b" | "c" | "d", value: number) => void;
}

function fmt(n: number) {
  return parseFloat(n.toFixed(2)).toString();
}

function renderFormula(
  type: FunctionType,
  a: number,
  b: number,
  c: number,
  d: number
) {
  const f = (n: number) => parseFloat(n.toFixed(1)).toString();
  const abs = Math.abs;
  const s = (n: number) => (n >= 0 ? "+" : "−");

  const A = "#ebb2ff", B = "#2ae500", C = "#ffffff", D = "#ffd6a5";
  const X = "#dce4e4", EQ = "#849495";

  const span = (val: string, color: string, key: string) => (
    <span key={key} style={{ color }}>
      {val}
    </span>
  );

  switch (type) {
    case "linear":
      return [
        span(f(a), A, "a"), span("x", X, "x"),
        span(` ${s(b)} `, EQ, "sb"), span(f(abs(b)), B, "b"),
      ];
    case "quadratic":
      return [
        span(f(a), A, "a"), span("x²", X, "x2"),
        span(` ${s(b)} `, EQ, "sb"), span(f(abs(b)), B, "b"), span("x", X, "x"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"),
      ];
    case "cubic":
      return [
        span(f(a), A, "a"), span("x³", X, "x3"),
        span(` ${s(b)} `, EQ, "sb"), span(f(abs(b)), B, "b"), span("x²", X, "x2"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"), span("x", X, "x"),
        span(` ${s(d)} `, EQ, "sd"), span(f(abs(d)), D, "d"),
      ];
    case "exponential":
      return [
        span(f(a), A, "a"), span("·e", X, "e"),
        span("^(", EQ, "lp"), span(f(b), B, "b"), span("x)", X, "x"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"),
      ];
    case "logarithmic":
      return [
        span(f(a), A, "a"), span("·ln(x", X, "ln"),
        span(` ${s(b)} `, EQ, "sb"), span(f(abs(b)), B, "b"), span(")", X, "rp"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"),
      ];
    case "sine":
      return [
        span(f(a), A, "a"), span("·sen(", X, "sin"),
        span(f(b), B, "b"), span("x", X, "x"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"), span(")", X, "rp"),
        span(` ${s(d)} `, EQ, "sd"), span(f(abs(d)), D, "d"),
      ];
    case "cosine":
      return [
        span(f(a), A, "a"), span("·cos(", X, "cos"),
        span(f(b), B, "b"), span("x", X, "x"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"), span(")", X, "rp"),
        span(` ${s(d)} `, EQ, "sd"), span(f(abs(d)), D, "d"),
      ];
    case "tangent":
      return [
        span(f(a), A, "a"), span("·tan(", X, "tan"),
        span(f(b), B, "b"), span("x", X, "x"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"), span(")", X, "rp"),
        span(` ${s(d)} `, EQ, "sd"), span(f(abs(d)), D, "d"),
      ];
    case "rational":
      return [
        span(f(a), A, "a"), span(" / (x", X, "den"),
        span(` ${b >= 0 ? "−" : "+"} `, EQ, "sb"), span(f(abs(b)), B, "b"), span(")", X, "rp"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"),
      ];
    case "absolute":
      return [
        span(f(a), A, "a"), span("·|x", X, "abs"),
        span(` ${b >= 0 ? "−" : "+"} `, EQ, "sb"), span(f(abs(b)), B, "b"), span("|", X, "rp"),
        span(` ${s(c)} `, EQ, "sc"), span(f(abs(c)), C, "c"),
      ];
  }
}

const TYPE_BADGE_LABELS: Record<FunctionType, string> = {
  linear:      "Linear",
  quadratic:   "Quadrática",
  cubic:       "Cúbica",
  exponential: "Exponencial",
  logarithmic: "Logarítmica",
  sine:        "Seno",
  cosine:      "Cosseno",
  tangent:     "Tangente",
  rational:    "Racional",
  absolute:    "Módulo",
};

export default function FunctionForm({
  funcType,
  params,
  onTypeChange,
  onParamChange,
}: FunctionFormProps) {
  const config = getConfig(funcType);
  const currentCategory = config.category;

  function handleParamInput(key: "a" | "b" | "c" | "d") {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      onParamChange(key, isNaN(v) ? 0 : v);
    };
  }

  function handleCategoryClick(cat: Category) {
    const first = getTypesForCategory(cat)[0];
    onTypeChange(first.type);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Category selector */}
      <div className="glass-panel rounded-xl p-4">
        <span
          className="block text-[10px] uppercase tracking-widest text-[#849495] mb-3"
          style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
        >
          CATEGORIA
        </span>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ id, label, icon }) => {
            const active = id === currentCategory;
            return (
              <button
                key={id}
                onClick={() => handleCategoryClick(id)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-center transition-all ${
                  active
                    ? "border-[#00dbe7] bg-[#00dbe7]/10 text-[#00dbe7]"
                    : "border-[#3a494b] bg-[#080f10] text-[#849495] hover:border-[#00dbe7]/50 hover:text-[#dce4e4]"
                }`}
              >
                <span className="material-symbols-outlined text-base">{icon}</span>
                <span
                  className="text-[9px] uppercase tracking-wide leading-tight"
                  style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-type chips */}
        <div className="flex flex-wrap gap-2 mt-3">
          {getTypesForCategory(currentCategory).map(({ type, label }) => {
            const active = type === funcType;
            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  active
                    ? "border-[#00dbe7] bg-[#00dbe7]/15 text-[#00dbe7]"
                    : "border-[#3a494b] text-[#849495] hover:border-[#00dbe7]/40 hover:text-[#dce4e4]"
                }`}
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equation display */}
      <div className="glass-panel rounded-xl p-5 math-glow-border">
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] uppercase tracking-widest text-[#849495]"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
          >
            FUNÇÃO ATUAL
          </span>
          <span
            className="bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] px-2 py-0.5 rounded uppercase tracking-wider"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 }}
          >
            {TYPE_BADGE_LABELS[funcType]}
          </span>
        </div>
        <div
          className="flex flex-wrap items-center justify-center gap-x-0.5 bg-[#080f10] rounded-lg py-3 px-4 border border-[#3a494b] glow-text-cyan"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: 17 }}
        >
          <span style={{ color: "#00dbe7" }}>f(x)</span>
          <span style={{ color: "#849495" }}>&nbsp;=&nbsp;</span>
          {renderFormula(funcType, params.a, params.b, params.c, params.d)}
        </div>
      </div>

      {/* Parameter sliders */}
      <div className="glass-panel rounded-xl p-5">
        <h3
          className="text-[#00dbe7] text-xl font-semibold mb-5 flex items-center gap-2"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <span className="material-symbols-outlined text-xl">tune</span>
          Parâmetros
        </h3>
        <div className="flex flex-col gap-6">
          {config.params.map(({ key, label, color, min, max, step }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-sm font-medium"
                  style={{ color, fontFamily: "Inter, sans-serif" }}
                >
                  {label}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step={step}
                  min={min}
                  max={max}
                  value={params[key]}
                  onChange={handleParamInput(key)}
                  className="bg-[#080f10] border border-[#3a494b] px-3 py-1 rounded text-sm w-20 text-right focus:outline-none focus:ring-2 focus:ring-[#00dbe7] transition-colors"
                  style={{ color, fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                />
              </div>
              <input
                className="clay-slider"
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={handleParamInput(key)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
