"use client";

import type { FunctionType } from "@/hooks/useGraphLogic";
import type { GraphData } from "@/hooks/useGraphLogic";

interface MathLegendProps {
  funcType: FunctionType;
  params: { a: number; b: number; c: number; d: number };
  graphData: GraphData;
}

function fmt(n: number) {
  return parseFloat(n.toFixed(2)).toString();
}

interface Card {
  label: string;
  value: string;
  color: string;
  wide?: boolean;
}

function buildCards(
  funcType: FunctionType,
  params: { a: number; b: number; c: number; d: number },
  g: GraphData
): Card[] {
  const { a, b, c } = params;
  const cards: Card[] = [];

  // ── Domain & Image (always) ───────────────────────────────
  cards.push({ label: "DOMÍNIO", value: g.domain, color: "#dce4e4" });
  cards.push({ label: "IMAGEM",  value: g.image,  color: "#dce4e4" });

  // ── Concavity (when applicable) ───────────────────────────
  if (g.concavity) {
    cards.push({
      label: "CONCAVIDADE",
      value: g.concavity,
      color: "#ebb2ff",
    });
  }

  // ── Y-intercept ───────────────────────────────────────────
  if (g.yIntercept !== null && isFinite(g.yIntercept)) {
    cards.push({
      label: "CORTE EIXO Y",
      value: `y = ${fmt(g.yIntercept)}`,
      color: "#dce4e4",
    });
  }

  // ── Type-specific ─────────────────────────────────────────
  switch (funcType) {
    case "quadratic": {
      const delta = b * b - 4 * a * c;
      cards.push({
        label: "RAÍZES",
        value: g.roots
          ? g.roots.x1 === g.roots.x2
            ? `x = ${fmt(g.roots.x1)}`
            : `${fmt(g.roots.x1)},  ${fmt(g.roots.x2)}`
          : "Nenhuma",
        color: g.roots ? "#00dbe7" : "#ffb4ab",
      });
      cards.push({
        label: "VÉRTICE",
        value: g.vertex ? `(${fmt(g.vertex.x)},  ${fmt(g.vertex.y)})` : "---",
        color: "#00dbe7",
      });
      cards.push({
        label: "DISCRIMINANTE (Δ)",
        value: `${fmt(delta)}  —  ${delta > 0 ? "2 zeros reais" : delta === 0 ? "raiz dupla" : "sem raízes reais"}`,
        color: delta >= 0 ? "#00dbe7" : "#ffb4ab",
        wide: true,
      });
      break;
    }

    case "linear": {
      cards.push({
        label: "RAIZ",
        value: g.roots ? `x = ${fmt(g.roots.x1)}` : "---",
        color: "#00dbe7",
      });
      break;
    }

    case "cubic": {
      cards.push({
        label: "PONTO DE INFLEXÃO",
        value: g.inflection
          ? `(${fmt(g.inflection.x)},  ${fmt(g.inflection.y)})`
          : "---",
        color: "#ebb2ff",
      });
      break;
    }

    case "exponential": {
      cards.push({
        label: "ASSÍNTOTA H.",
        value: `y = ${fmt(c)}`,
        color: "#b4ffb0",
      });
      cards.push({
        label: b > 0 ? "CRESCIMENTO" : "DECRESCIMENTO",
        value: b > 0 ? "Crescente" : "Decrescente",
        color: b > 0 ? "#2ae500" : "#ffb4ab",
      });
      break;
    }

    case "logarithmic": {
      cards.push({
        label: "ASSÍNTOTA V.",
        value: `x = ${fmt(-b)}`,
        color: "#ffb480",
      });
      break;
    }

    case "sine":
    case "cosine": {
      cards.push({
        label: "AMPLITUDE",
        value: g.amplitude !== null ? fmt(g.amplitude) : "---",
        color: "#ebb2ff",
      });
      cards.push({
        label: "PERÍODO",
        value: g.period !== null ? `${fmt(g.period)}  (≈${fmt(g.period / Math.PI)}π)` : "---",
        color: "#ffd6a5",
        wide: true,
      });
      break;
    }

    case "tangent": {
      cards.push({
        label: "PERÍODO",
        value: g.period !== null ? `${fmt(g.period)}  (≈${fmt(g.period / Math.PI)}π)` : "---",
        color: "#ffd6a5",
      });
      cards.push({
        label: "ASSÍNTOTAS V.",
        value: `x = π/(2·${fmt(params.b)}) + n·π/${fmt(params.b)}`,
        color: "#ffb480",
        wide: true,
      });
      break;
    }

    case "rational": {
      cards.push({
        label: "ASSÍNTOTA V.",
        value: `x = ${fmt(b)}`,
        color: "#ffb480",
      });
      cards.push({
        label: "ASSÍNTOTA H.",
        value: `y = ${fmt(c)}`,
        color: "#b4ffb0",
      });
      break;
    }

    case "absolute": {
      cards.push({
        label: "VÉRTICE",
        value: g.vertex ? `(${fmt(g.vertex.x)},  ${fmt(g.vertex.y)})` : "---",
        color: "#00dbe7",
      });
      break;
    }
  }

  return cards;
}

export default function MathLegend({ funcType, params, graphData }: MathLegendProps) {
  const cards = buildCards(funcType, params, graphData);

  return (
    <div className="glass-panel rounded-xl p-5">
      <h3
        className="text-white text-xl font-semibold mb-4 flex items-center gap-2"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        <span className="material-symbols-outlined text-[#849495] text-xl">analytics</span>
        Informações
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {cards.map(({ label, value, color, wide }) => (
          <div
            key={label}
            className={`bg-[#080f10] p-3 rounded-lg border border-[#3a494b] ${wide ? "col-span-2" : ""}`}
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
      </div>
    </div>
  );
}
