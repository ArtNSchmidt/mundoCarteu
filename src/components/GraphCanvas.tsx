"use client";

import { useEffect, useRef, useState } from "react";
import type { Point, FunctionType } from "@/utils/mathHelpers";
import type { Asymptote } from "@/hooks/useGraphLogic";

interface GraphCanvasProps {
  points: Point[];
  asymptotes: Asymptote[];
  vertex: Point | null;
  inflection: Point | null;
  roots: { x1: number; x2: number } | null;
  yIntercept: number | null;
  funcType: FunctionType;
}

const PAD      = 44;
const BG       = "#0d1515";
const GRID     = "rgba(132,148,149,0.12)";
const AXIS     = "rgba(132,148,149,0.45)";
const LABEL    = "#849495";
const CURVE    = "#00dbe7";
const V_COLOR  = "#00dbe7";
const I_COLOR  = "#ebb2ff";
const R_COLOR  = "#ffb4ab";
const Y_COLOR  = "rgba(255,255,255,0.85)";
const ASYM_V   = "rgba(255,180,80,0.65)";
const ASYM_H   = "rgba(180,255,150,0.5)";

export default function GraphCanvas({
  points,
  asymptotes,
  vertex,
  inflection,
  roots,
  yIntercept,
  funcType,
}: GraphCanvasProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipPoint, setTooltipPoint] = useState<{
    px: number; py: number; label: string; sub: string; color: string;
  } | null>(null);
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

    // ── Coordinate range ──────────────────────────────────────
    const validYs = points.map((p) => p.y).filter((y) => isFinite(y));
    const xMin = Math.min(...points.map((p) => p.x));
    const xMax = Math.max(...points.map((p) => p.x));

    // Cap extreme y values (tangent / rational near asymptotes)
    let yMin = Math.max(Math.min(...validYs), -200);
    let yMax = Math.min(Math.max(...validYs),  200);

    if (!isFinite(yMin) || !isFinite(yMax) || yMin === yMax) {
      yMin = -10; yMax = 10;
    }
    const yPad = (yMax - yMin) * 0.12;
    yMin -= yPad;
    yMax += yPad;

    function tc(x: number, y: number): [number, number] {
      const cx = PAD + ((x - xMin) / (xMax - xMin)) * iW;
      const cy = PAD + ((yMax - y) / (yMax - yMin)) * iH;
      return [cx, cy];
    }

    // ── Background ────────────────────────────────────────────
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // ── Grid ─────────────────────────────────────────────────
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    const xStep = (xMax - xMin) > 15 ? 4 : 2;
    const yStep = (yMax - yMin) > 80 ? 20 : (yMax - yMin) > 30 ? 10 : 5;

    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i += xStep) {
      const [cx] = tc(i, 0);
      ctx.beginPath(); ctx.moveTo(cx, PAD); ctx.lineTo(cx, H - PAD); ctx.stroke();
    }
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i += yStep) {
      const [, cy] = tc(0, i);
      ctx.beginPath(); ctx.moveTo(PAD, cy); ctx.lineTo(W - PAD, cy); ctx.stroke();
    }

    // ── Asymptotes ────────────────────────────────────────────
    for (const asym of asymptotes) {
      if (asym.type === "vertical") {
        if (asym.value < xMin || asym.value > xMax) continue;
        const [ax] = tc(asym.value, 0);
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = ASYM_V;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ax, PAD);
        ctx.lineTo(ax, H - PAD);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = ASYM_V;
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`x=${asym.value.toFixed(1)}`, ax, PAD - 5);
        ctx.restore();
      } else {
        if (asym.value < yMin || asym.value > yMax) continue;
        const [, ay] = tc(0, asym.value);
        ctx.save();
        ctx.setLineDash([6, 4]);
        ctx.strokeStyle = ASYM_H;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(PAD, ay);
        ctx.lineTo(W - PAD, ay);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = ASYM_H;
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`y=${asym.value.toFixed(1)}`, W - PAD - 3, ay - 4);
        ctx.restore();
      }
    }

    // ── Axes ──────────────────────────────────────────────────
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

    // ── Axis labels ───────────────────────────────────────────
    ctx.fillStyle = LABEL;
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";
    for (let i = Math.ceil(xMin); i <= Math.floor(xMax); i += xStep * 2) {
      if (i === 0) continue;
      const [cx, cy0] = tc(i, 0);
      const ly = yMin <= 0 && yMax >= 0 ? cy0 + 18 : H - PAD + 18;
      ctx.fillText(String(i), cx, ly);
    }
    ctx.textAlign = "right";
    for (let i = Math.ceil(yMin); i <= Math.floor(yMax); i += yStep * 2) {
      if (i === 0) continue;
      const [cx0, cy] = tc(0, i);
      const lx = xMin <= 0 && xMax >= 0 ? cx0 - 7 : PAD - 7;
      ctx.fillText(String(i), lx, cy + 5);
    }

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

    // ── Curve (handles NaN as segment break) ─────────────────
    ctx.save();
    ctx.shadowColor = CURVE;
    ctx.shadowBlur  = 12;
    ctx.strokeStyle = CURVE;
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    let penDown = false;
    for (const p of points) {
      if (!isFinite(p.y)) {
        penDown = false;
        continue;
      }
      const [cx, cy] = tc(p.x, p.y);
      if (!penDown) { ctx.moveTo(cx, cy); penDown = true; }
      else            ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();

    // ── Roots ─────────────────────────────────────────────────
    if (roots) {
      const seen = new Set<number>();
      [roots.x1, roots.x2].forEach((rx) => {
        if (!isFinite(rx) || rx < xMin || rx > xMax || seen.has(rx)) return;
        seen.add(rx);
        const [cx, cy] = tc(rx, 0);
        ctx.save();
        ctx.shadowColor = R_COLOR;
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        ctx.fillStyle = R_COLOR;
        ctx.fill();
        ctx.restore();
        ctx.fillStyle   = R_COLOR;
        ctx.font        = "11px Inter, sans-serif";
        ctx.textAlign   = "center";
        ctx.fillText(`x=${rx.toFixed(2)}`, cx, cy - 12);
      });
    }

    // ── Y-intercept ───────────────────────────────────────────
    if (yIntercept !== null && isFinite(yIntercept) && xMin <= 0 && xMax >= 0) {
      const [cx0, cy0] = tc(0, yIntercept);
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.7)";
      ctx.shadowBlur  = 10;
      ctx.beginPath();
      ctx.arc(cx0, cy0, 4, 0, Math.PI * 2);
      ctx.fillStyle = Y_COLOR;
      ctx.fill();
      ctx.restore();
    }

    // ── Vertex (quadratic / absolute) ─────────────────────────
    let newTooltip: typeof tooltipPoint = null;
    if (vertex && vertex.x >= xMin && vertex.x <= xMax) {
      const [cx, cy] = tc(vertex.x, vertex.y);
      ctx.save();
      ctx.shadowColor = V_COLOR;
      ctx.shadowBlur  = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = V_COLOR;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = BG;
      ctx.fill();
      ctx.restore();
      newTooltip = {
        px:    cx / W,
        py:    cy / H,
        label: funcType === "absolute" ? "Vértice" : "Vértice",
        sub:   `(${vertex.x.toFixed(2)}, ${vertex.y.toFixed(2)})`,
        color: V_COLOR,
      };
    }

    // ── Inflection (cubic) ────────────────────────────────────
    if (inflection && inflection.x >= xMin && inflection.x <= xMax) {
      const [cx, cy] = tc(inflection.x, inflection.y);
      ctx.save();
      ctx.shadowColor = I_COLOR;
      ctx.shadowBlur  = 14;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = I_COLOR;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = BG;
      ctx.fill();
      ctx.restore();
      newTooltip = {
        px:    cx / W,
        py:    cy / H,
        label: "Inflexão",
        sub:   `(${inflection.x.toFixed(2)}, ${inflection.y.toFixed(2)})`,
        color: I_COLOR,
      };
    }

    setTooltipPoint(newTooltip);
  }, [points, asymptotes, vertex, inflection, roots, yIntercept, funcType, drawTick]);

  return (
    <div
      ref={containerRef}
      className="w-full flex-1 glass-panel rounded-xl overflow-hidden flex flex-col"
      style={{ minHeight: 320 }}
    >
      <div className="relative flex-1" style={{ minHeight: 360 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: "block" }}
        />
        {tooltipPoint && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: `calc(${tooltipPoint.px * 100}% + 12px)`,
              top:  `calc(${tooltipPoint.py * 100}% - 16px)`,
            }}
          >
            <div
              className="bg-[#232b2c]/90 border border-[#3a494b] rounded-lg px-3 py-2 backdrop-blur-sm"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
            >
              <p
                className="text-[11px] font-semibold"
                style={{ color: tooltipPoint.color, fontFamily: "Inter, sans-serif" }}
              >
                {tooltipPoint.label}
              </p>
              <p
                className="text-[12px] text-white"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {tooltipPoint.sub}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
