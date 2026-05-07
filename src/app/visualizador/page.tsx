"use client";

import { useState } from "react";
import FunctionForm from "@/components/FunctionForm";
import GraphCanvas from "@/components/GraphCanvas";
import MathLegend from "@/components/MathLegend";
import { useGraphLogic, type FunctionType } from "@/hooks/useGraphLogic";
import { getConfig } from "@/utils/funcTypes";

export default function VisualizadorPage() {
  const [funcType, setFuncType] = useState<FunctionType>("quadratic");
  const [params, setParams] = useState({ a: 1.5, b: -2, c: 1, d: 0 });

  const graphData = useGraphLogic(funcType, params.a, params.b, params.c, params.d);

  function handleTypeChange(newType: FunctionType) {
    setFuncType(newType);
    setParams(getConfig(newType).defaults);
  }

  function handleParamChange(key: "a" | "b" | "c" | "d", value: number) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col xl:flex-row gap-5 p-4 pt-6 pb-6 px-4 xl:px-8 max-w-[1600px] w-full mx-auto">
        {/* Graph */}
        <div className="w-full xl:w-7/12 xl:order-2">
          <GraphCanvas
            points={graphData.points}
            asymptotes={graphData.asymptotes}
            vertex={graphData.vertex}
            inflection={graphData.inflection}
            roots={graphData.roots}
            yIntercept={graphData.yIntercept}
            funcType={funcType}
          />
        </div>

        {/* Controls + Legend */}
        <div className="flex flex-col gap-5 w-full xl:w-5/12 xl:order-1">
          <FunctionForm
            funcType={funcType}
            params={params}
            onTypeChange={handleTypeChange}
            onParamChange={handleParamChange}
          />
          <MathLegend
            funcType={funcType}
            params={params}
            graphData={graphData}
          />
        </div>
      </main>
    </div>
  );
}
