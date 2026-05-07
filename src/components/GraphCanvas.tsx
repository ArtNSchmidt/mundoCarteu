"use client";

import { useEffect, useRef, useState } from "react";
import type { Point } from "@/utils/mathHelpers";

interface GraphCanvasProps {
  points: Point[];
  vertex: Point | null;
  roots: { x1: number; x2: number } | null;
  yIntercept: number;
}

const PAD = 44;
const BG      = "#0d1515";
const GRID    = "rgba(132,148,149,0.12)";
const AXIS    = "rgba(132,148,149,0.45)";
const LABEL   = "#849495";
const CURVE   = "#00dbe7";
const V_COLOR = "#00dbe7";
const R_COLOR = "#ffb4ab";
const Y_COLOR = "rgba(255,255,255,0.85)";

export default function GraphCanvas({ points, vertex, roots, yIntercept }: GraphCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [vtxPos, setVtxPos] = useState<{ px: number; py: number } | null>(null);
  // increments when canvas is resized so the draw effect re-runs
  const [drawTick, setDrawTick] = useState(0);

  // Keep canvas dimensions in sync with its container
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        canvas.width  = w;
        canvas.height = h;
        setDrawTick((t) => t + 1);
      }
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Draw whenever data or canvas size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || points.length === 0 || canvas.width === 0 || canvas.height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W  = canvas.width;
    const H  = canvas.height;
    const iW = W - PAD * 2;
    const iH = H - PAD * 2;

    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);
    let xMin = -10, xMax = 10;
    let yMin = Math.min(...ys);
    let yMax = Math.max(...ys);
    const yPad = (yMax - yMin) * 0.15;
    yMin -= yPad;
    yMax += yPad;

    function tc(x: number, y: number): [number, number] {
      const cx = PAD + ((x - xMin) / (xMax - xMin)) * iW;
      const cy = PAD + ((yMax - y) / (yMax - yMin)) * iH;
      return [cx, cy];
    }

    // Background
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i += 2) {
      const [cx] = tc(i, 0);
      ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke();
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i += 5) {
      const [, cy] = tc(0, i);
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = AXIS;
    ctx.lineWidth = 1.5;
    if (yMin <= 0 && yMax >= 0) {
      const [, cy0] = tc(0, 0);
      ctx.beginPath(); ctx.moveTo(PAD, cy0); ctx.lineTo(W - PAD, cy0); ctx.stroke();
    }
    if (xMin <= 0 && xMax >= 0) {
      const [cx0] = tc(0, 0);
      ctx.beginPath(); ctx.moveTo(cx0, PAD); ctx.lineTo(cx0, H - PAD); ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = LABEL;
    ctx.font = "13px Inter, sans-serif";
    ctx.textAlign = "center";
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i += 4) {
      if (i === 0) continue;
      const [cx, cy0] = tc(i, 0);
      const ly = yMin <= 0 && yMax >= 0 ? cy0 + 18 : H - PAD + 18;
      ctx.fillText(String(i), cx, ly);
    }
    ctx.textAlign = "right";
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i += 10) {
      if (i === 0) continue;
      const [cx0, cy] = tc(0, i);
      const lx = xMin <= 0 && xMax >= 0 ? cx0 - 7 : PAD - 7;
      ctx.fillText(String(i), lx, cy + 6);
    }

    // Axis letter labels
    ctx.fillStyle = LABEL;
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    if (xMin <= 0 && xMax >= 0) {
      const [cx0] = tc(0, 0);
      ctx.fillText("Y", cx0 + 12, PAD - 8);
    }
    if (yMin <= 0 && yMax >= 0) {
      ctx.fillText("X", W - PAD + 10, tc(0, 0)[1]);
    }

    if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) {
      const [cx0, cy0] = tc(0, 0);
      ctx.fillStyle = LABEL;
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("0", cx0 + 4, cy0 + 13);
    }

    // Curve
    ctx.save();
    ctx.shadowColor = CURVE;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = CURVE;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
      const [cx, cy] = tc(p.x, p.y);
      if (i === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    });
    ctx.stroke();
    ctx.restore();

    // Roots
    if (roots) {
      [roots.x1, roots.x2].forEach((rx) => {
        if (rx < xMin || rx > xMax) return;
        const [cx, cy] = tc(rx, 0);
        ctx.save();
        ctx.shadowColor = R_COLOR;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = R_COLOR;
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = R_COLOR;
        ctx.font = "11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`x=${rx.toFixed(2)}`, cx, cy - 12);
      });
    }

    // Y-intercept dot
    if (xMin <= 0 && xMax >= 0) {
      const [cx0, cy0] = tc(0, yIntercept);
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(cx0, cy0, 4, 0, Math.PI * 2);
      ctx.fillStyle = Y_COLOR;
      ctx.fill();
      ctx.restore();
    }

    // Vertex dot
    if (vertex) {
      const [cx, cy] = tc(vertex.x, vertex.y);
      ctx.save();
      ctx.shadowColor = V_COLOR;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = V_COLOR;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#0d1515";
      ctx.fill();
      ctx.restore();
      setVtxPos({ px: cx / W, py: cy / H });
    } else {
      setVtxPos(null);
    }
  }, [points, vertex, roots, yIntercept, drawTick]);

  function fmt2(n: number) {
    return parseFloat(n.toFixed(2)).toString();
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 glass-panel rounded-xl overflow-hidden flex flex-col"
      style={{ minHeight: 320 }}
    >
      <div className="relative flex-1" style={{ minHeight: 280 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />
        {vtxPos && vertex && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `calc(${vtxPos.px * 100}% + 12px)`,
              top:  `calc(${vtxPos.py * 100}% - 16px)`,
            }}
          >
            <div
              className="bg-[#232b2c]/90 border border-[#3a494b] rounded-lg px-3 py-2 backdrop-blur-sm"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
            >
              <p className="text-[11px] font-semibold" style={{ color: V_COLOR, fontFamily: "Inter, sans-serif" }}>
                Vertice
              </p>
              <p className="text-[12px] text-white" style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
                ({fmt2(vertex.x)}, {fmt2(vertex.y)})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
