"use client";

import { useState } from "react";
import FunctionForm from "@/components/FunctionForm";
import GraphCanvas from "@/components/GraphCanvas";
import MathLegend from "@/components/MathLegend";
import { useGraphLogic } from "@/hooks/useGraphLogic";

export default function Home() {
  const [a, setA] = useState(1.5);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(1);

  const { points, roots, vertex, yIntercept, degree } = useGraphLogic(a, b, c);

  function handleChange(field: "a" | "b" | "c", value: number) {
    if (field === "a") setA(value);
    else if (field === "b") setB(value);
    else setC(value);
  }

  function handleReset() {
    setA(1.5);
    setB(-2);
    setC(1);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-5 h-14 bg-[#0d1515]/80 backdrop-blur-xl border-b border-[#3a494b]/50">
        <span className="material-symbols-outlined text-[#00dbe7]" style={{ fontSize: 22 }}>function</span>
        <h1
          className="text-lg font-bold text-[#00dbe7]"
          style={{ fontFamily: "Space Grotesk, sans-serif", textShadow: "0 0 8px rgba(0,219,231,0.7)" }}
        >
          MundoDescartes
        </h1>
        <div className="w-9" />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col xl:flex-row gap-5 p-4 pt-[72px] pb-6 px-4 xl:px-8 max-w-[1600px] w-full mx-auto">
        {/* Graph — top on mobile, right on desktop */}
        <div className="w-full xl:w-7/12 xl:order-2">
          <GraphCanvas
            points={points}
            vertex={vertex}
            roots={roots}
            yIntercept={yIntercept}
          />
        </div>

        {/* Controls + Info — below graph on mobile, left on desktop */}
        <div className="flex flex-col gap-5 w-full xl:w-5/12 xl:order-1">
          <FunctionForm
            a={a}
            b={b}
            c={c}
            degree={degree}
            onChange={handleChange}
            onReset={handleReset}
          />
          <MathLegend
            a={a}
            b={b}
            c={c}
            degree={degree}
            roots={roots}
            vertex={vertex}
            yIntercept={yIntercept}
          />
        </div>
      </main>
    </div>
  );
}
