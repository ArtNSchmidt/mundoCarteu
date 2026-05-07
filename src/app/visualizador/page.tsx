"use client";

import { useState } from "react";
import FunctionForm from "@/components/FunctionForm";
import GraphCanvas from "@/components/GraphCanvas";
import MathLegend from "@/components/MathLegend";
import { useGraphLogic } from "@/hooks/useGraphLogic";

export default function VisualizadorPage() {
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
      <main className="flex-1 flex flex-col xl:flex-row gap-5 p-4 pt-6 pb-6 px-4 xl:px-8 max-w-[1600px] w-full mx-auto">
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
