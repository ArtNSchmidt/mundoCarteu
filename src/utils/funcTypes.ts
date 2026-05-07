import type { FunctionType } from "./mathHelpers";

export type Category = "polynomial" | "growth" | "periodic" | "relation";

export interface ParamDef {
  key: "a" | "b" | "c" | "d";
  label: string;
  color: string;
  min: number;
  max: number;
  step: number;
}

export interface TypeConfig {
  type: FunctionType;
  category: Category;
  label: string;
  categoryLabel: string;
  params: ParamDef[];
  defaults: { a: number; b: number; c: number; d: number };
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "polynomial", label: "Polinomial", icon: "functions" },
  { id: "growth",     label: "Crescimento", icon: "trending_up" },
  { id: "periodic",   label: "Periódica",   icon: "waves" },
  { id: "relation",   label: "Relação",     icon: "alt_route" },
];

export const TYPE_CONFIGS: TypeConfig[] = [
  // ── Polynomial ──────────────────────────────────────────────
  {
    type: "linear",
    category: "polynomial",
    label: "Linear",
    categoryLabel: "Polinomial",
    params: [
      { key: "a", label: "a  (inclinação)", color: "#ebb2ff", min: -10, max: 10, step: 0.1 },
      { key: "b", label: "b  (intercepto)", color: "#2ae500", min: -20, max: 20, step: 0.1 },
    ],
    defaults: { a: 2, b: -1, c: 0, d: 0 },
  },
  {
    type: "quadratic",
    category: "polynomial",
    label: "Quadrática",
    categoryLabel: "Polinomial",
    params: [
      { key: "a", label: "a  (concavidade)", color: "#ebb2ff", min: -10, max: 10, step: 0.1 },
      { key: "b", label: "b  (simetria)",    color: "#2ae500", min: -20, max: 20, step: 0.1 },
      { key: "c", label: "c  (intercepto y)",color: "#ffffff", min: -20, max: 20, step: 0.1 },
    ],
    defaults: { a: 1.5, b: -2, c: 1, d: 0 },
  },
  {
    type: "cubic",
    category: "polynomial",
    label: "Cúbica",
    categoryLabel: "Polinomial",
    params: [
      { key: "a", label: "a  (grau 3)",   color: "#ebb2ff", min: -5,  max: 5,  step: 0.1 },
      { key: "b", label: "b  (grau 2)",   color: "#2ae500", min: -10, max: 10, step: 0.1 },
      { key: "c", label: "c  (grau 1)",   color: "#ffffff", min: -10, max: 10, step: 0.1 },
      { key: "d", label: "d  (constante)",color: "#ffd6a5", min: -10, max: 10, step: 0.1 },
    ],
    defaults: { a: 1, b: 0, c: -3, d: 2 },
  },

  // ── Growth & Scale ───────────────────────────────────────────
  {
    type: "exponential",
    category: "growth",
    label: "Exponencial",
    categoryLabel: "Crescimento",
    params: [
      { key: "a", label: "a  (amplitude)",    color: "#ebb2ff", min: -5,  max: 5,  step: 0.1  },
      { key: "b", label: "b  (taxa)",          color: "#2ae500", min: -3,  max: 3,  step: 0.05 },
      { key: "c", label: "c  (deslocamento v)",color: "#ffffff", min: -10, max: 10, step: 0.1  },
    ],
    defaults: { a: 1, b: 0.5, c: 0, d: 0 },
  },
  {
    type: "logarithmic",
    category: "growth",
    label: "Logarítmica",
    categoryLabel: "Crescimento",
    params: [
      { key: "a", label: "a  (escala)",         color: "#ebb2ff", min: -5, max: 5,  step: 0.1 },
      { key: "b", label: "b  (deslocamento h.)", color: "#2ae500", min: -5, max: 10, step: 0.1 },
      { key: "c", label: "c  (deslocamento v.)", color: "#ffffff", min:-10, max: 10, step: 0.1 },
    ],
    defaults: { a: 1, b: 1, c: 0, d: 0 },
  },

  // ── Periodic ─────────────────────────────────────────────────
  {
    type: "sine",
    category: "periodic",
    label: "Seno",
    categoryLabel: "Periódica",
    params: [
      { key: "a", label: "A  (amplitude)",       color: "#ebb2ff", min: -5,    max: 5,    step: 0.1  },
      { key: "b", label: "B  (frequência)",       color: "#2ae500", min: -5,    max: 5,    step: 0.1  },
      { key: "c", label: "C  (fase)",             color: "#ffffff", min: -3.14, max: 3.14, step: 0.05 },
      { key: "d", label: "D  (deslocamento v.)",  color: "#ffd6a5", min: -5,    max: 5,    step: 0.1  },
    ],
    defaults: { a: 1, b: 1, c: 0, d: 0 },
  },
  {
    type: "cosine",
    category: "periodic",
    label: "Cosseno",
    categoryLabel: "Periódica",
    params: [
      { key: "a", label: "A  (amplitude)",       color: "#ebb2ff", min: -5,    max: 5,    step: 0.1  },
      { key: "b", label: "B  (frequência)",       color: "#2ae500", min: -5,    max: 5,    step: 0.1  },
      { key: "c", label: "C  (fase)",             color: "#ffffff", min: -3.14, max: 3.14, step: 0.05 },
      { key: "d", label: "D  (deslocamento v.)",  color: "#ffd6a5", min: -5,    max: 5,    step: 0.1  },
    ],
    defaults: { a: 1, b: 1, c: 0, d: 0 },
  },
  {
    type: "tangent",
    category: "periodic",
    label: "Tangente",
    categoryLabel: "Periódica",
    params: [
      { key: "a", label: "A  (escala)",          color: "#ebb2ff", min: -5,    max: 5,    step: 0.1  },
      { key: "b", label: "B  (frequência)",       color: "#2ae500", min: -5,    max: 5,    step: 0.1  },
      { key: "c", label: "C  (fase)",             color: "#ffffff", min: -3.14, max: 3.14, step: 0.05 },
      { key: "d", label: "D  (deslocamento v.)",  color: "#ffd6a5", min: -5,    max: 5,    step: 0.1  },
    ],
    defaults: { a: 1, b: 1, c: 0, d: 0 },
  },

  // ── Relation & Break ─────────────────────────────────────────
  {
    type: "rational",
    category: "relation",
    label: "Racional",
    categoryLabel: "Relação",
    params: [
      { key: "a", label: "a  (numerador)",    color: "#ebb2ff", min: -10, max: 10, step: 0.1 },
      { key: "b", label: "b  (assíntota x=b)",color: "#2ae500", min: -8,  max: 8,  step: 0.1 },
      { key: "c", label: "c  (assíntota y=c)",color: "#ffffff", min: -8,  max: 8,  step: 0.1 },
    ],
    defaults: { a: 1, b: 0, c: 0, d: 0 },
  },
  {
    type: "absolute",
    category: "relation",
    label: "Módulo",
    categoryLabel: "Relação",
    params: [
      { key: "a", label: "a  (inclinação)", color: "#ebb2ff", min: -5, max: 5, step: 0.1 },
      { key: "b", label: "b  (vértice x)",  color: "#2ae500", min: -8, max: 8, step: 0.1 },
      { key: "c", label: "c  (vértice y)",  color: "#ffffff", min: -8, max: 8, step: 0.1 },
    ],
    defaults: { a: 1, b: 0, c: 0, d: 0 },
  },
];

export function getConfig(type: FunctionType): TypeConfig {
  return TYPE_CONFIGS.find((t) => t.type === type)!;
}

export function getTypesForCategory(cat: Category): TypeConfig[] {
  return TYPE_CONFIGS.filter((t) => t.category === cat);
}
