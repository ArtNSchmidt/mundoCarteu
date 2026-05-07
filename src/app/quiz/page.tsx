"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Difficulty = "basico" | "inter" | "avancado";
type Tab = "quiz" | "challenge" | "teoria" | "explorador";
type Screen = "welcome" | "quiz" | "gameover" | "result";
type ToastType = "correct" | "wrong" | "combo" | "timeout";
type FuncType = "linear" | "quad" | "cubic" | "abs" | "inv" | "sqrt";
type OptState = "" | "correct" | "wrong";

interface Question {
  t: string;
  f: string | null;
  o: string[];
  c: number;
  ex: string;
}

interface GcFunc {
  fn: (x: number) => number | null;
  label: string;
  color: string;
  info: string;
}

// ── Question Bank ──────────────────────────────────────────────────────────
const QB: Record<Difficulty, Question[]> = {
  basico: [
    { t: "De acordo com a definição de função, qual das afirmações é correta?", f: null,
      o: ["Toda relação é uma função.", "Uma função associa cada elemento do domínio a um único elemento do contradomínio.", "Uma função associa cada elemento do contradomínio a um único elemento do domínio.", "Uma função não pode ser representada por diagramas de Venn."],
      c: 1, ex: "Definição: f: A → B associa cada x ∈ A a exatamente um y ∈ B. A unicidade do y é o que distingue função de relação genérica." },
    { t: "Em uma função f: A → B, o conjunto A é chamado de:", f: null,
      o: ["Contradomínio", "Imagem", "Domínio", "Conjunto das partes"],
      c: 2, ex: "O conjunto A é o Domínio D(f) — os valores de entrada (x). O conjunto B é o contradomínio." },
    { t: "Se uma função é definida como par, qual propriedade ela satisfaz?", f: null,
      o: ["f(x) = –f(x) para todo x", "f(–x) = –f(x) para todo x", "f(–x) = f(x) para todo x", "f(x) = 0 para todo x"],
      c: 2, ex: "Função PAR: f(–x) = f(x). O gráfico é simétrico em relação ao eixo y. Exemplo clássico: f(x) = x²." },
    { t: "O gráfico de uma função ímpar é simétrico em relação a:", f: null,
      o: ["Ao eixo x", "Ao eixo y", "À reta y = x", "À origem (0,0)"],
      c: 3, ex: "Função ímpar: f(–x) = –f(x). O gráfico é simétrico em relação à ORIGEM. Se (x, y) está no gráfico, (–x, –y) também está." },
    { t: "Se o domínio de f é D = {1, 2, 3} e o contradomínio é CD = {a, b, c, d}, quantos elementos no máximo pode ter a imagem?", f: null,
      o: ["3", "4", "7", "12"],
      c: 0, ex: "A imagem é limitada pelo domínio: cada elemento do domínio gera no máximo um elemento na imagem. Logo Im(f) tem no máximo 3 elementos." },
    { t: "Uma função f: A → B é representada simbolicamente por:", f: null,
      o: ["f : B → A", "(x, y) ∈ A × A", "f(x) = y, com x ∈ A e y ∈ B", "A ⊂ B"],
      c: 2, ex: "f(x) = y com x ∈ A e y ∈ B é a notação correta. Indica que f transforma entradas do domínio A em saídas do contradomínio B." },
    { t: "Qual das opções NÃO é uma forma válida de representar uma função?", f: null,
      o: ["Diagrama de Venn", "Gráfico cartesiano", "Conjunto de pares ordenados", "Expressão com quantificador existencial apenas"],
      c: 3, ex: "Funções podem ser representadas por diagramas de Venn, gráficos, pares ordenados ou fórmulas. Uma expressão existencial sozinha não garante unicidade — requisito da função." },
    { t: "O conjunto formado por todos os valores y = f(x), com x pertencente ao domínio, chama-se:", f: null,
      o: ["Contradomínio", "Domínio", "Imagem", "Produto cartesiano"],
      c: 2, ex: "A Imagem Im(f) é o conjunto de todos os y efetivamente produzidos por f. Diferente do contradomínio, que pode ser maior." },
    { t: "Se o domínio é {0, 1, 2} e a regra é f(x) = x + 1, qual é o conjunto imagem?", f: "f(x) = x + 1",
      o: ["{0, 1, 2}", "{1, 2, 3}", "{1, 2}", "{0, 1, 2, 3}"],
      c: 1, ex: "f(0)=1, f(1)=2, f(2)=3. Portanto Im(f) = {1, 2, 3}." },
    { t: "Em uma função do tipo f(x) = ax + b (a ≠ 0), seu gráfico é sempre:", f: "f(x) = ax + b, a ≠ 0",
      o: ["Uma parábola", "Uma reta", "Uma curva com concavidade para cima", "Uma hipérbole"],
      c: 1, ex: "f(x) = ax + b é função de 1º grau — gráfico sempre é uma RETA. Se a > 0: crescente. Se a < 0: decrescente." },
  ],
  inter: [
    { t: "Se o domínio A tem 5 elementos e o contradomínio B tem 8, qual o número máximo de elementos que a imagem pode ter?", f: null,
      o: ["5", "8", "13", "40"],
      c: 0, ex: "A imagem é limitada pelo domínio: cada x gera no máximo 1 y. Com 5 elementos em A, a imagem tem no máximo 5 elementos." },
    { t: "Seja f(x) = –x². Podemos afirmar que:", f: "f(x) = –x²",
      o: ["f é par e parábola com concavidade para cima.", "f é ímpar e simétrica à origem.", "f é par, mas concavidade é voltada para baixo.", "f não é par nem ímpar."],
      c: 2, ex: "f(–x) = –(–x)² = –x² = f(x) → função PAR. Coeficiente a = –1 < 0 → concavidade para BAIXO." },
    { t: "Qual regra representa uma reta crescente passando pela origem?", f: null,
      o: ["f(x) = –2x", "f(x) = x + 1", "f(x) = 3x", "f(x) = –x + 5"],
      c: 2, ex: "f(x) = 3x: passa pela origem (f(0)=0), coeficiente a=3 > 0 → crescente. f(x)=x+1 não passa pela origem." },
    { t: "Na função área A(x) = 100x – 2x² de um terreno retangular, qual condição deve ser imposta ao domínio?", f: "A(x) = 100x – 2x²",
      o: ["x pode ser qualquer número real.", "x deve ser maior que 100.", "x deve ser positivo e tal que o comprimento também seja positivo.", "x deve ser inteiro."],
      c: 2, ex: "Largura x > 0 e comprimento y = 100–2x > 0 → x < 50. Portanto domínio real do problema: 0 < x < 50." },
    { t: "Para que uma relação R: A → B seja considerada uma função, qual condição é necessária e suficiente?", f: null,
      o: ["Todos os elementos de B relacionados com algum elemento de A.", "Cada elemento de A se relaciona com exatamente um elemento de B.", "A relação deve ser reflexiva e simétrica.", "O conjunto imagem deve ser igual ao contradomínio."],
      c: 1, ex: "Definição de função: todo x ∈ A tem exatamente um y ∈ B associado. Nem mais, nem menos." },
    { t: "Se f(–x) = –f(x) para todo x real, o gráfico de f é simétrico:", f: "f(–x) = –f(x)",
      o: ["Em relação ao eixo y", "Em relação à reta y = x", "Em relação ao eixo x", "Em relação à origem do plano cartesiano"],
      c: 3, ex: "f(–x) = –f(x) é a definição de função ÍMPAR. Simetria em relação à ORIGEM." },
    { t: "Uma parábola tem vértice em (3, 5) e concavidade para baixo. Qual afirmação é verdadeira?", f: null,
      o: ["f possui valor máximo em x = 3.", "f possui valor mínimo em x = 3.", "f é uma função constante.", "f é uma função do primeiro grau."],
      c: 0, ex: "Concavidade para baixo (a < 0) → vértice é PONTO DE MÁXIMO. O valor máximo é f(3) = 5." },
    { t: "Sejam A = {1, 2, 3} e B = {4, 5, 6, 7}. Quantas funções distintas f: A → B podem ser definidas?", f: null,
      o: ["3", "4", "12", "64"],
      c: 3, ex: "Cada elemento de A pode ser mapeado para qualquer um dos 4 elementos de B. Total: 4³ = 64 funções." },
    { t: "Em f: A → B, o que ocorre se um elemento x ∈ A não estiver relacionado a nenhum y ∈ B?", f: null,
      o: ["f ainda é função, pois basta um y.", "f não é função — todo x ∈ A deve ter exatamente um y correspondente.", "Apenas se o contradomínio for vazio.", "É permitido se a imagem for vazia."],
      c: 1, ex: "Toda função exige que TODOS os elementos do domínio tenham imagem. Se algum x não tem y, a relação não é função." },
    { t: "f(x) = ax² + bx + c com duas raízes reais e distintas, a > 0. Então:", f: "f(x) = ax² + bx + c, a > 0",
      o: ["Concavidade para baixo e vértice é ponto de máximo.", "Concavidade para cima e vértice é ponto de mínimo.", "O gráfico não intercepta o eixo x.", "O vértice está sempre na origem."],
      c: 1, ex: "a > 0 → parábola com concavidade para CIMA (∪) → vértice é ponto de MÍNIMO. Duas raízes confirmam que o gráfico corta o eixo x em 2 pontos." },
  ],
  avancado: [
    { t: "Para que a função composta g∘f: A → C exista, qual condição é necessária?", f: "(g∘f)(x) = g(f(x))",
      o: ["O domínio de g deve ser igual ao contradomínio de f.", "A imagem de f deve estar contida no domínio de g.", "f deve ser sobrejetora.", "g deve ser injetora."],
      c: 1, ex: "Para aplicar g após f, os valores produzidos por f (imagem de f) precisam ser entradas válidas para g. Im(f) ⊆ D(g)." },
    { t: "Uma função f: IR → IR é sobrejetora quando:", f: null,
      o: ["Cada elemento do contradomínio é imagem de pelo menos um elemento do domínio.", "Cada elemento do domínio tem imagem única.", "A função é par e ímpar ao mesmo tempo.", "O gráfico é uma reta horizontal."],
      c: 0, ex: "Sobrejetora: Im(f) = CD(f). Todo y ∈ B tem pelo menos um x ∈ A tal que f(x) = y." },
    { t: "Dada f(x) = –x² + 10x com domínio [0, 10], qual é o valor máximo?", f: "f(x) = –x² + 10x",
      o: ["0", "10", "25", "50"],
      c: 2, ex: "Vértice em x = –b/(2a) = –10/(–2) = 5. f(5) = –25 + 50 = 25. Como a < 0, o vértice é ponto de MÁXIMO." },
    { t: "O domínio da função composta f∘g, onde f(x) = x² e g(x) = √x, é:", f: "f(x) = x²  |  g(x) = √x",
      o: ["Todos os reais", "Reais não negativos (x ≥ 0)", "Reais positivos (x > 0)", "Reais negativos"],
      c: 1, ex: "(f∘g)(x) = f(√x) = (√x)² = x. Mas g(x) = √x exige x ≥ 0. Logo domínio de f∘g é [0, +∞)." },
    { t: "Uma relação R ⊂ A × A é uma função se:", f: null,
      o: ["R for reflexiva e transitiva.", "Para cada x ∈ A, existir exatamente um y ∈ A com (x, y) ∈ R.", "Para cada y ∈ A, existir exatamente um x ∈ A com (x, y) ∈ R.", "R for simétrica e antissimétrica."],
      c: 1, ex: "Definição de função (endorrelação): cada x tem exatamente uma imagem y. A opção C descreve injetividade, não função em geral." },
    { t: "Uma função f é ímpar e periódica com período T = 2. Qual igualdade é verdadeira para todo x?", f: null,
      o: ["f(x+2) = –f(x)", "f(x+2) = f(–x)", "f(x+2) = f(x)  e  f(–x) = –f(x)", "f(x+2) = f(–x) = –f(x)"],
      c: 2, ex: "Periódica T=2: f(x+2) = f(x). Ímpar: f(–x) = –f(x). As duas propriedades coexistem independentemente." },
    { t: "f tem a propriedade f(ab) = f(a)+f(b) para a,b positivos. Se f(2) = 1, qual é f(8)?", f: "f(ab) = f(a) + f(b)  |  f(2) = 1",
      o: ["1", "2", "3", "4"],
      c: 2, ex: "f(4) = f(2·2) = f(2)+f(2) = 2. f(8) = f(2·4) = f(2)+f(4) = 1+2 = 3. (Propriedade logarítmica!)" },
    { t: "f(x) = ax²+bx+c com domínio [0,10] e vértice em x=6. Com a < 0, onde ocorre o máximo?", f: "Vértice em x = 6  |  a < 0",
      o: ["a > 0 → máximo em x = 6", "a > 0 → máximo em x = 0 ou x = 10", "a < 0 → máximo em x = 6", "a < 0 → máximo em x = 0 ou x = 10"],
      c: 2, ex: "a < 0 → concavidade para baixo → vértice é MÁXIMO. Vértice x=6 ∈ [0,10] → máximo ocorre em x = 6." },
    { t: "Sejam A = {1, 2} e B = {a, b, c}. Quantas funções injetoras f: A → B existem?", f: null,
      o: ["2", "3", "6", "8"],
      c: 2, ex: "Injetora: imagens distintas. 1º elemento: 3 escolhas em B. 2º elemento: 2 restantes. Total: 3×2 = 6." },
    { t: "f(x+y) = f(x)+f(y) para todo x,y. Se f(1) = 5, então f(0) e f(–1) valem:", f: "f(x+y) = f(x)+f(y)  |  f(1) = 5",
      o: ["0 e –5", "5 e 0", "0 e 5", "1 e –1"],
      c: 0, ex: "f(0): f(0+0)=2f(0) → f(0)=0. f(–1): f(1)+f(–1)=f(0)=0 → f(–1)=–f(1)=–5." },
  ],
};

// ── Graph Challenge Functions ──────────────────────────────────────────────
const GC_FUNCS: GcFunc[] = [
  { fn: (x) => 2 * x,                         label: "f(x) = 2x",  color: "#818cf8", info: "Linear — reta com inclinação 2" },
  { fn: (x) => x * x,                          label: "f(x) = x²",  color: "#22d3ee", info: "Quadrática — parábola ∪" },
  { fn: (x) => -x * x,                         label: "f(x) = −x²", color: "#fb923c", info: "Quadrática negativa — parábola ∩" },
  { fn: (x) => x * x * x,                      label: "f(x) = x³",  color: "#4ade80", info: "Cúbica — forma S" },
  { fn: (x) => Math.abs(x),                    label: "f(x) = |x|", color: "#f472b6", info: "Módulo — forma V" },
  { fn: (x) => (x !== 0 ? 1 / x : null),       label: "f(x) = 1/x", color: "#fbbf24", info: "Inversa — hipérbole" },
  { fn: () => 4,                                label: "f(x) = 4",   color: "#a78bfa", info: "Constante — reta horizontal" },
  { fn: (x) => (x >= 0 ? Math.sqrt(x) : null), label: "f(x) = √x",  color: "#34d399", info: "Raiz quadrada — metade de parábola" },
];

// ── Explorer definitions ───────────────────────────────────────────────────
const FTYPES: Record<FuncType, { fn: (x: number, a: number) => number | null; info: (a: number) => string }> = {
  linear: { fn: (x, a) => a * x,                            info: (a) => `f(x) = ${a}x — reta. a>0: crescente; a<0: decrescente; a=0: constante.` },
  quad:   { fn: (x, a) => a * x * x,                        info: (a) => `f(x) = ${a}x² — parábola. ${a > 0 ? "a>0: concavidade ∪ (mínimo em 0)" : "a<0: concavidade ∩ (máximo em 0)"}. Função PAR.` },
  cubic:  { fn: (x, a) => a * x * x * x,                    info: (a) => `f(x) = ${a}x³ — cúbica. ${a > 0 ? "a>0: crescente" : "a<0: decrescente"}. Função ÍMPAR.` },
  abs:    { fn: (x, a) => a * Math.abs(x),                  info: (a) => `f(x) = ${a}|x| — módulo em V. ${a > 0 ? "a>0: abre para cima" : "a<0: abre para baixo"}. Função PAR.` },
  inv:    { fn: (x, a) => (x !== 0 ? a / x : null),         info: (a) => `f(x) = ${a}/x — hipérbole. Domínio: x≠0. Função ÍMPAR (se a>0).` },
  sqrt:   { fn: (x, a) => (x >= 0 ? a * Math.sqrt(x) : null), info: (a) => `f(x) = ${a}√x — raiz. Domínio: x≥0. ${a > 0 ? "Crescente" : "Decrescente"}.` },
};
const FCOLORS: Record<FuncType, string> = { linear: "#818cf8", quad: "#22d3ee", cubic: "#4ade80", abs: "#f472b6", inv: "#fbbf24", sqrt: "#34d399" };
const FUNC_LABELS: Record<FuncType, (a: number) => string> = {
  linear: (a) => `f(x) = ${a}x`,   quad:  (a) => `f(x) = ${a}x²`,
  cubic:  (a) => `f(x) = ${a}x³`,  abs:   (a) => `f(x) = ${a}|x|`,
  inv:    (a) => `f(x) = ${a}/x`,  sqrt:  (a) => `f(x) = ${a}√x`,
};

// ── Utilities ──────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function drawAxesOnCtx(ctx: CanvasRenderingContext2D, W: number, H: number, scale: number, fn: (x: number) => number | null, color: string) {
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = "#07080f"; ctx.fillRect(0, 0, W, H);
  const ox = W / 2, oy = H / 2;
  ctx.strokeStyle = "rgba(30,32,64,0.9)"; ctx.lineWidth = 1;
  for (let gx = 0; gx < W; gx += scale) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
  for (let gy = 0; gy < H; gy += scale) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke(); }
  ctx.strokeStyle = "rgba(74,80,128,.8)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(W, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, H); ctx.stroke();
  ctx.fillStyle = "rgba(74,80,128,.8)";
  ctx.beginPath(); ctx.moveTo(W - 6, oy - 5); ctx.lineTo(W, oy); ctx.lineTo(W - 6, oy + 5); ctx.fill();
  ctx.beginPath(); ctx.moveTo(ox - 5, 6); ctx.lineTo(ox, 0); ctx.lineTo(ox + 5, 6); ctx.fill();
  ctx.font = "9px monospace"; ctx.fillStyle = "#3a3f6a";
  const maxTick = Math.floor(W / 2 / scale);
  for (let i = -maxTick; i <= maxTick; i++) {
    if (i !== 0) { ctx.fillText(String(i), ox + i * scale - 4, oy + 13); ctx.fillText(String(-i), ox + 4, oy + i * scale + 3); }
  }
  ctx.fillText("0", ox + 4, oy + 13);
  ctx.fillStyle = "rgba(74,80,128,.6)"; ctx.font = "10px monospace";
  ctx.fillText("x", W - 12, oy - 7); ctx.fillText("y", ox + 7, 11);
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.shadowColor = color; ctx.shadowBlur = 8;
  let drawing = false; ctx.beginPath();
  for (let px = 0; px <= 600; px++) {
    const xv = (px / 600) * (W / scale) - W / scale / 2;
    const yv = fn(xv);
    if (yv === null || !isFinite(yv) || Math.abs(yv) > (H / scale) * 2) { drawing = false; continue; }
    const sx = ox + xv * scale, sy = oy - yv * scale;
    if (sy < -60 || sy > H + 60) { drawing = false; continue; }
    if (!drawing) { ctx.moveTo(sx, sy); drawing = true; } else { ctx.lineTo(sx, sy); }
  }
  ctx.stroke(); ctx.shadowBlur = 0;
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function QuizPage() {
  const [tab, setTab] = useState<Tab>("quiz");

  // Quiz screen & config
  const [screen,      setScreen]      = useState<Screen>("welcome");
  const [difficulty,  setDifficulty]  = useState<Difficulty | null>(null);
  const [timerOption, setTimerOption] = useState(120);

  // Mutable refs for timer callbacks (avoid stale closures)
  const livesRef       = useRef(3);
  const qIdxRef        = useRef(0);
  const questionsRef   = useRef<Question[]>([]);
  const streakRef      = useRef(0);
  const maxStreakRef   = useRef(0);
  const ptsRef         = useRef(0);
  const correctRef     = useRef(0);
  const wrongRef       = useRef(0);
  const answeredOkRef  = useRef<(boolean | null)[]>([]);
  const timerOptionRef = useRef(120);

  // Render state
  const [lives,      setLives]      = useState(3);
  const [qIdx,       setQIdx]       = useState(0);
  const [questions,  setQuestions]  = useState<Question[]>([]);
  const [streak,     setStreak]     = useState(0);
  const [maxStreak,  setMaxStreak]  = useState(0);
  const [pts,        setPts]        = useState(0);
  const [correct,    setCorrect]    = useState(0);
  const [wrong,      setWrong]      = useState(0);
  const [answeredOk, setAnsweredOk] = useState<(boolean | null)[]>([]);

  // Answer / feedback
  const [optStates,     setOptStates]     = useState<OptState[]>(["", "", "", ""]);
  const [optsDisabled,  setOptsDisabled]  = useState(false);
  const [showFeedback,  setShowFeedback]  = useState(false);
  const [feedbackOk,    setFeedbackOk]    = useState(false);
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackBody,  setFeedbackBody]  = useState("");
  const [showNextBtn,   setShowNextBtn]   = useState(false);
  const [nextBtnLabel,  setNextBtnLabel]  = useState("PRÓXIMA →");
  const nextBtnActionRef = useRef<() => void>(() => {});

  // Timer
  const [timerPct,    setTimerPct]  = useState(100);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStartRef = useRef(0);
  const timerDurRef   = useRef(20);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: ToastType; show: boolean }>({ msg: "", type: "correct", show: false });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animations
  const [shakeCard,  setShakeCard]  = useState(false);
  const [popPts,     setPopPts]     = useState(false);
  const [pulseLives, setPulseLives] = useState(false);

  // Graph challenge
  const gcCanvasRef   = useRef<HTMLCanvasElement>(null);
  const [gcStarted,   setGcStarted]   = useState(false);
  const [gcCurIdx,    setGcCurIdx]    = useState<number | null>(null);
  const [gcOpts,      setGcOpts]      = useState<GcFunc[]>([]);
  const [gcCorrect,   setGcCorrect]   = useState(0);
  const [gcTotal,     setGcTotal]     = useState(0);
  const [gcAnswered,  setGcAnswered]  = useState(false);
  const [gcFbOk,      setGcFbOk]      = useState(false);
  const [gcFbBody,    setGcFbBody]    = useState("");
  const [gcSelected,  setGcSelected]  = useState<string | null>(null);

  // Explorer
  const explorerRef     = useRef<HTMLCanvasElement>(null);
  const [funcType,      setFuncType]      = useState<FuncType>("linear");
  const [paramA,        setParamA]        = useState(1);
  const [explorerInfo,  setExplorerInfo]  = useState("");

  useEffect(() => { timerOptionRef.current = timerOption; }, [timerOption]);

  // ── Helpers ──────────────────────────────────────────────────
  const showToast = useCallback((msg: string, type: ToastType) => {
    setToast({ msg, type, show: true });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  }, []);

  function triggerAnim(setter: (v: boolean) => void) {
    setter(true); setTimeout(() => setter(false), 400);
  }

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    const dur = timerOptionRef.current;
    if (dur === 0) { setTimerPct(100); return; }
    timerStartRef.current = Date.now(); timerDurRef.current = dur; setTimerPct(100);
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - timerStartRef.current) / 1000;
      const pct = Math.max(0, (1 - elapsed / timerDurRef.current) * 100);
      setTimerPct(pct);
      if (pct <= 0) { stopTimer(); handleTimeoutRef.current(); }
    }, 100);
  }, [stopTimer]);

  useEffect(() => () => { stopTimer(); }, [stopTimer]);

  // Timeout handler ref — recreated each render with fresh state
  const handleTimeoutRef = useRef<() => void>(() => {});
  handleTimeoutRef.current = () => {
    showToast("⏰ Tempo esgotado!", "timeout");
    livesRef.current--;
    setLives(livesRef.current);
    triggerAnim(setPulseLives);
    const q = questionsRef.current[qIdxRef.current];
    const ns = new Array(q.o.length).fill("") as OptState[];
    ns[q.c] = "correct";
    setOptStates(ns); setOptsDisabled(true);
    answeredOkRef.current[qIdxRef.current] = false;
    setAnsweredOk([...answeredOkRef.current]);
    setFeedbackOk(false); setFeedbackTitle("⏰ Tempo esgotado!"); setFeedbackBody(q.ex); setShowFeedback(true);
    const isLast = qIdxRef.current >= questionsRef.current.length - 1;
    if (livesRef.current <= 0) { setNextBtnLabel("VER RESULTADO →"); nextBtnActionRef.current = handleEndGameOver; }
    else { setNextBtnLabel(isLast ? "VER RESULTADO →" : "PRÓXIMA →"); nextBtnActionRef.current = handleNextQ; }
    setShowNextBtn(true);
  };

  // ── Quiz logic ────────────────────────────────────────────────
  function startQuiz() {
    if (!difficulty) { showToast("Escolha uma dificuldade!", "wrong"); return; }
    const qs = shuffle([...QB[difficulty]]);
    questionsRef.current = qs; qIdxRef.current = 0; livesRef.current = 3;
    streakRef.current = 0; maxStreakRef.current = 0; ptsRef.current = 0;
    correctRef.current = 0; wrongRef.current = 0;
    answeredOkRef.current = new Array(qs.length).fill(null);
    setQuestions(qs); setQIdx(0); setLives(3); setStreak(0); setMaxStreak(0);
    setPts(0); setCorrect(0); setWrong(0); setAnsweredOk(new Array(qs.length).fill(null));
    setScreen("quiz");
  }

  useEffect(() => {
    if (screen !== "quiz") return;
    const q = questionsRef.current[qIdxRef.current];
    if (!q) return;
    setOptStates(new Array(q.o.length).fill("") as OptState[]);
    setOptsDisabled(false); setShowFeedback(false); setShowNextBtn(false);
    nextBtnActionRef.current = handleNextQ;
    setNextBtnLabel(qIdxRef.current >= questionsRef.current.length - 1 ? "VER RESULTADO →" : "PRÓXIMA →");
    if (timerOptionRef.current > 0) startTimer(); else stopTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, qIdx, startTimer, stopTimer]);

  function handlePickAnswer(idx: number) {
    stopTimer();
    const q = questionsRef.current[qIdxRef.current];
    const ok = idx === q.c;
    answeredOkRef.current[qIdxRef.current] = ok;
    setAnsweredOk([...answeredOkRef.current]);
    const ns = new Array(q.o.length).fill("") as OptState[];
    ns[q.c] = "correct"; if (!ok) ns[idx] = "wrong";
    setOptStates(ns); setOptsDisabled(true);
    if (ok) {
      correctRef.current++; streakRef.current++;
      if (streakRef.current > maxStreakRef.current) maxStreakRef.current = streakRef.current;
      const bonus = streakRef.current >= 4 ? 50 : streakRef.current >= 2 ? 20 : 0;
      const timeBonus = timerOptionRef.current === 0 ? 0 : Math.round((timerPct / 100) * 50);
      ptsRef.current += 100 + timeBonus + bonus;
      setCorrect(correctRef.current); setStreak(streakRef.current); setMaxStreak(maxStreakRef.current); setPts(ptsRef.current);
      if (bonus > 0) showToast(`🔥 Combo x${streakRef.current}! +${bonus} pts`, "combo");
      else showToast(`✅ Correto! +${100 + timeBonus} pts`, "correct");
      triggerAnim(setPopPts);
    } else {
      wrongRef.current++; streakRef.current = 0; livesRef.current--;
      setWrong(wrongRef.current); setStreak(0); setLives(livesRef.current);
      triggerAnim(setShakeCard); triggerAnim(setPulseLives);
      showToast("❌ Incorreto", "wrong");
    }
    setFeedbackOk(ok); setFeedbackTitle(ok ? "✅ Correto!" : "❌ Incorreto"); setFeedbackBody(q.ex); setShowFeedback(true);
    const isLast = qIdxRef.current >= questionsRef.current.length - 1;
    if (livesRef.current <= 0) { setNextBtnLabel("VER RESULTADO →"); nextBtnActionRef.current = handleEndGameOver; }
    else { setNextBtnLabel(isLast ? "VER RESULTADO →" : "PRÓXIMA →"); nextBtnActionRef.current = handleNextQ; }
    setShowNextBtn(true);
  }

  function handleNextQ() {
    if (livesRef.current <= 0) { handleEndGameOver(); return; }
    if (qIdxRef.current < questionsRef.current.length - 1) { qIdxRef.current++; setQIdx(qIdxRef.current); }
    else handleShowResult();
  }
  function handleEndGameOver() { stopTimer(); setScreen("gameover"); }
  function handleShowResult()  { stopTimer(); setScreen("result"); }
  function handleRestart()     { setScreen("welcome"); setDifficulty(null); }

  // ── Graph Challenge ───────────────────────────────────────────
  function startGC() { setGcStarted(true); setGcCorrect(0); setGcTotal(0); spawnGC(0, 0); }

  function spawnGC(prevCorrect: number, prevTotal: number) {
    setGcAnswered(false); setGcFbBody(""); setGcSelected(null);
    const idx = Math.floor(Math.random() * GC_FUNCS.length);
    const others = shuffle(GC_FUNCS.filter((f) => f.label !== GC_FUNCS[idx].label)).slice(0, 3);
    setGcCurIdx(idx); setGcOpts(shuffle([GC_FUNCS[idx], ...others]));
    setGcCorrect(prevCorrect); setGcTotal(prevTotal);
  }

  useEffect(() => {
    if (tab !== "challenge" || gcCurIdx === null) return;
    const canvas = gcCanvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) drawAxesOnCtx(ctx, canvas.width, canvas.height, 30, GC_FUNCS[gcCurIdx].fn, GC_FUNCS[gcCurIdx].color);
  }, [gcCurIdx, tab]);

  function handlePickGC(label: string) {
    const current = gcCurIdx !== null ? GC_FUNCS[gcCurIdx] : null;
    if (!current || gcAnswered) return;
    const ok = label === current.label;
    setGcSelected(label); setGcAnswered(true); setGcFbOk(ok); setGcFbBody(current.info);
    setGcTotal((t) => t + 1); if (ok) setGcCorrect((c) => c + 1);
    showToast(ok ? "✅ Correto!" : "❌ Incorreto", ok ? "correct" : "wrong");
  }

  // ── Explorer ──────────────────────────────────────────────────
  useEffect(() => {
    if (tab !== "explorador") return;
    const canvas = explorerRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    drawAxesOnCtx(ctx, canvas.width, canvas.height, 35, (x) => FTYPES[funcType].fn(x, paramA), FCOLORS[funcType]);
    ctx.fillStyle = FCOLORS[funcType]; ctx.font = "bold 13px sans-serif";
    ctx.fillText(FUNC_LABELS[funcType](paramA), 10, 22);
    setExplorerInfo("📌 " + FTYPES[funcType].info(paramA));
  }, [tab, funcType, paramA]);

  // ── Derived ───────────────────────────────────────────────────
  const timerColor = timerPct > 30 ? "#4ade80" : timerPct > 15 ? "#fbbf24" : "#f87171";
  const accuracy   = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
  const currentQ   = questions[qIdx];

  const card   = "bg-[#0e0f1c] border border-[#1e2040] rounded-2xl p-6 relative overflow-hidden";
  const monoSm = "font-mono text-[0.65rem] tracking-widest uppercase";
  const btnBase = "inline-block px-7 py-3 rounded-lg font-bold cursor-pointer border-none transition-all duration-200 tracking-wide uppercase text-sm";

  // ── JSX ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-[#e2e8f0] relative overflow-x-hidden" style={{ fontFamily: "'Outfit', sans-serif", background: "#07080f" }}>
      {/* BG effects */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 700px 500px at 15% 10%,rgba(91,94,244,.1) 0%,transparent 65%),radial-gradient(ellipse 500px 400px at 85% 85%,rgba(34,211,238,.07) 0%,transparent 65%)" }} />
      <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(91,94,244,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(91,94,244,.04) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Toast */}
      <div className={`fixed top-4 right-4 px-5 py-3 rounded-xl font-bold text-sm z-50 pointer-events-none transition-all duration-300 ${toast.show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
        style={toast.type === "combo" ? { background: "rgba(251,191,36,.2)", border: "1px solid #fbbf24", color: "#fbbf24" } :
               toast.type === "correct" ? { background: "rgba(74,222,128,.15)", border: "1px solid #4ade80", color: "#4ade80" } :
               { background: "rgba(248,113,113,.1)", border: "1px solid #f87171", color: "#f87171" }}>
        {toast.msg}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <header className="text-center mb-7">
          <div className={`inline-flex items-center gap-2 ${monoSm} text-[#22d3ee] bg-[rgba(34,211,238,.08)] border border-[rgba(34,211,238,.25)] px-4 py-1.5 rounded-sm mb-3`}>
            🎓 UNIFOR · Matemática para Computação
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none"
            style={{ background: "linear-gradient(130deg,#fff 20%,#818cf8 60%,#22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            FuncõesQuest
          </h1>
        </header>

        {/* Tabs */}
        <div className="flex gap-0.5 border-b border-[#1e2040] mb-7 overflow-x-auto">
          {(["quiz", "challenge", "teoria", "explorador"] as Tab[]).map((t) => {
            const labels: Record<Tab, string> = { quiz: "🎮 Quiz", challenge: "📈 Desafio Gráfico", teoria: "📖 Teoria", explorador: "🔬 Explorador" };
            return (
              <button key={t} onClick={() => setTab(t)}
                className="border-none font-bold text-[0.82rem] px-4 py-2.5 cursor-pointer whitespace-nowrap -mb-px transition-all duration-200 bg-transparent"
                style={{ color: tab === t ? "#22d3ee" : "#4a5080", borderBottom: tab === t ? "2px solid #22d3ee" : "2px solid transparent" }}>
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* ══ TAB: QUIZ ══ */}
        {tab === "quiz" && (
          <div>
            {/* Welcome */}
            {screen === "welcome" && (
              <div className={`${card} before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#5b5ef4] before:to-[#22d3ee]`}>
                <div className={`${monoSm} text-[#818cf8] mb-3`}>// Selecione a dificuldade</div>
                <p className="text-base font-semibold leading-relaxed mb-4">
                  Teste seus conhecimentos sobre <strong>Funções Matemáticas</strong> com questões reais da UNIFOR!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {(["basico", "inter", "avancado"] as Difficulty[]).map((d) => {
                    const info = { basico: { ico: "🌱", label: "Iniciante", desc: "Conceitos fundamentais" }, inter: { ico: "⚡", label: "Intermediário", desc: "Aplicação e análise" }, avancado: { ico: "🔥", label: "Avançado", desc: "Composição e injetividade" } };
                    const sel = difficulty === d;
                    return (
                      <div key={d} onClick={() => setDifficulty(d)}
                        className={`bg-[#141528] rounded-xl p-5 cursor-pointer transition-all duration-200 border-[1.5px] ${sel ? "border-[#22d3ee] bg-[rgba(34,211,238,.07)]" : "border-[#1e2040] hover:border-[#5b5ef4] hover:-translate-y-0.5"}`}
                        style={sel ? { boxShadow: "0 0 20px rgba(34,211,238,.25)" } : {}}>
                        <span className="text-2xl block mb-2">{info[d].ico}</span>
                        <h3 className="font-bold text-sm mb-1">{info[d].label}</h3>
                        <p className="text-[#4a5080] text-xs leading-relaxed">{info[d].desc}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mb-5 text-xs text-[#4a5080]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>⏱ Timer:</span>
                  {[{ v: 120, l: "2 min" }, { v: 240, l: "4 min" }, { v: 600, l: "10 min" }].map(({ v, l }) => (
                    <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="timer" checked={timerOption === v} onChange={() => setTimerOption(v)} className="accent-[#5b5ef4]" />
                      {l}
                    </label>
                  ))}
                </div>
                <button onClick={startQuiz} className={`${btnBase} w-full text-center bg-[#5b5ef4] text-white`} style={{ boxShadow: "0 4px 18px rgba(91,94,244,.35)" }}>
                  ▶ INICIAR QUIZ
                </button>
              </div>
            )}

            {/* Quiz in progress */}
            {screen === "quiz" && currentQ && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3">
                  {[
                    { lbl: "Acertos", val: correct, color: "#4ade80", anim: false },
                    { lbl: "Erros",   val: wrong,   color: "#f87171", anim: false },
                    { lbl: "Pontos",  val: pts,      color: "#fbbf24", anim: popPts },
                    { lbl: "Vidas",   val: null,     color: "",        anim: pulseLives },
                  ].map(({ lbl, val, color, anim }) => (
                    <div key={lbl} className={`bg-[#141528] border border-[#1e2040] rounded-xl px-3 py-2 text-center transition-transform duration-200 ${anim ? "scale-110" : "scale-100"}`}>
                      <span className={`block ${monoSm} text-[#4a5080] mb-0.5`}>{lbl}</span>
                      {lbl === "Vidas"
                        ? <span className="text-xl font-black">{"❤️".repeat(Math.max(0, lives))}{"🖤".repeat(Math.max(0, 3 - lives))}</span>
                        : <span className="text-xl font-black" style={{ color }}>{val}</span>
                      }
                    </div>
                  ))}
                </div>
                {timerOption > 0 && (
                  <div className="h-1.5 bg-[#1e2040] rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full transition-[width] duration-100 ease-linear" style={{ width: `${timerPct}%`, background: timerColor }} />
                  </div>
                )}
                <div className="h-[3px] bg-[#1e2040] rounded-full overflow-hidden mb-5">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${questions.length > 0 ? (qIdx / questions.length) * 100 : 0}%`, background: "linear-gradient(90deg,#5b5ef4,#22d3ee)" }} />
                </div>

                <div className={`${card} before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#5b5ef4] before:to-[#22d3ee] transition-transform duration-200 ${shakeCard ? "animate-[shake_0.35s_ease]" : ""}`}>
                  <div className={`${monoSm} text-[#818cf8] flex items-center gap-3 mb-4`}>
                    <span>Questão {qIdx + 1}</span>
                    <span className="text-[#4a5080]">{qIdx + 1}/{questions.length}</span>
                    {streak >= 2 && (
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold text-[#fbbf24] border border-[rgba(251,191,36,.35)]"
                        style={{ background: streak >= 4 ? "rgba(251,191,36,.2)" : "rgba(251,191,36,.12)", boxShadow: streak >= 4 ? "0 0 12px rgba(251,191,36,.3)" : "none" }}>
                        🔥 {streak}x
                      </span>
                    )}
                  </div>
                  <p className="text-base font-semibold leading-relaxed mb-3">{currentQ.t}</p>
                  {currentQ.f && (
                    <div className="bg-[#07080f] border border-[#2a2d5a] rounded-lg px-4 py-3 text-center text-[#fbbf24] text-sm mb-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {currentQ.f}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                    {currentQ.o.map((opt, i) => {
                      const state = optStates[i] ?? "";
                      return (
                        <button key={i} disabled={optsDisabled} onClick={() => handlePickAnswer(i)}
                          className={`text-left px-4 py-3 rounded-xl text-sm font-semibold leading-snug border-[1.5px] transition-all duration-200 ${
                            state === "correct" ? "border-[#4ade80] bg-[rgba(74,222,128,.12)] text-[#86efac]" :
                            state === "wrong"   ? "border-[#f87171] bg-[rgba(248,113,113,.1)] text-[#fca5a5]" :
                            optsDisabled ? "border-[#1e2040] bg-[#141528] text-[#e2e8f0] cursor-default" :
                            "border-[#1e2040] bg-[#141528] text-[#e2e8f0] hover:border-[#818cf8] hover:bg-[rgba(91,94,244,.1)] hover:translate-x-0.5"
                          }`}>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {showFeedback && (
                    <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed border ${feedbackOk ? "bg-[rgba(74,222,128,.08)] border-[rgba(74,222,128,.3)]" : "bg-[rgba(248,113,113,.07)] border-[rgba(248,113,113,.25)]"}`}>
                      <div className="font-black text-[0.95rem] mb-1.5">{feedbackTitle}</div>
                      <div className="text-[#94a3b8]">{feedbackBody}</div>
                    </div>
                  )}
                </div>
                {showNextBtn && (
                  <div className="text-center mt-4">
                    <button onClick={() => nextBtnActionRef.current()} className={`${btnBase} bg-[#5b5ef4] text-white`} style={{ boxShadow: "0 4px 18px rgba(91,94,244,.35)" }}>
                      {nextBtnLabel}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Game Over */}
            {screen === "gameover" && (
              <div className={`${card} before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#5b5ef4] before:to-[#22d3ee]`}>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">💔</div>
                  <h2 className="text-3xl font-black text-[#f87171] mb-2">Game Over!</h2>
                  <p className="text-[#4a5080] text-sm mb-6">Você perdeu todas as vidas.</p>
                  <div className="grid grid-cols-3 gap-2.5 mb-8">
                    {[{ n: correct, l: "acertos", c: "#4ade80" }, { n: pts, l: "pontos", c: "#fbbf24" }, { n: `${maxStreak}x`, l: "combo max", c: "#fb923c" }].map(({ n, l, c }) => (
                      <div key={l} className="bg-[#141528] border border-[#1e2040] rounded-xl p-4 text-center">
                        <div className="text-2xl font-black mb-1" style={{ color: c }}>{n}</div>
                        <div className={`${monoSm} text-[#4a5080]`}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button onClick={startQuiz} className={`${btnBase} bg-[#5b5ef4] text-white`} style={{ boxShadow: "0 4px 18px rgba(91,94,244,.35)" }}>🔄 Tentar Novamente</button>
                    <button onClick={handleRestart} className={`${btnBase} border-[1.5px] border-[#2a2d5a] text-[#4a5080]`} style={{ background: "transparent" }}>← Menu</button>
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {screen === "result" && (
              <div className={`${card} before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#5b5ef4] before:to-[#22d3ee]`}>
                <div className="text-center py-6">
                  <div className="text-7xl font-black leading-none tracking-tighter mb-1"
                    style={{ background: "linear-gradient(135deg,#22d3ee,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {correct}/{questions.length}
                  </div>
                  <div className={`${monoSm} text-[#4a5080] mb-4`}>pontuação final</div>
                  <div className="inline-block px-5 py-2 rounded-full font-bold text-sm mb-6"
                    style={accuracy >= 80 ? { background: "rgba(251,191,36,.15)", border: "1px solid #fbbf24", color: "#fbbf24" } :
                           accuracy >= 60 ? { background: "rgba(34,211,238,.1)", border: "1px solid #22d3ee", color: "#22d3ee" } :
                                            { background: "rgba(91,94,244,.12)", border: "1px solid #818cf8", color: "#818cf8" }}>
                    {accuracy >= 80 ? "🏆 Excelente! Domínio total!" : accuracy >= 60 ? "⭐ Bom! Continue praticando!" : "💪 Revise a teoria e tente novamente!"}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 mb-5">
                    {[{ n: pts, l: "pontos", c: "#fbbf24" }, { n: `${accuracy}%`, l: "acertos", c: "#4ade80" }, { n: `${maxStreak}x`, l: "combo max", c: "#fb923c" }].map(({ n, l, c }) => (
                      <div key={l} className="bg-[#141528] border border-[#1e2040] rounded-xl p-4 text-center">
                        <div className="text-2xl font-black mb-1" style={{ color: c }}>{n}</div>
                        <div className={`${monoSm} text-[#4a5080]`}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#141528] border border-[#1e2040] rounded-xl p-4 mb-6 text-left max-h-56 overflow-y-auto">
                    <div className="font-bold text-sm mb-3 text-[#e2e8f0]">Revisão das questões</div>
                    {questions.map((q, i) => (
                      <div key={i} className="flex justify-between items-center py-1.5 border-b border-[#1e2040] last:border-b-0 text-xs gap-3">
                        <span className="text-[#94a3b8] flex-1">{i + 1}. {q.t.substring(0, 60)}…</span>
                        <span>{answeredOk[i] === true ? "✅" : "❌"}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button onClick={startQuiz} className={`${btnBase} bg-[#5b5ef4] text-white`} style={{ boxShadow: "0 4px 18px rgba(91,94,244,.35)" }}>🔄 Jogar Novamente</button>
                    <button onClick={handleRestart} className={`${btnBase} border-[1.5px] border-[#2a2d5a] text-[#4a5080]`} style={{ background: "transparent" }}>← Menu</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB: DESAFIO GRÁFICO ══ */}
        {tab === "challenge" && (
          <div className={`${card} before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#5b5ef4] before:to-[#22d3ee]`}>
            <div className={`${monoSm} text-[#818cf8] mb-2`}>// Modo Desafio — Identifique a função pelo gráfico</div>
            <p className="text-sm font-semibold mb-4">Qual função corresponde ao gráfico abaixo?</p>
            <div className="text-center">
              <canvas ref={gcCanvasRef} width={500} height={280} className="border border-[#1e2040] rounded-xl max-w-full mx-auto cursor-crosshair block" style={{ background: "#07080f" }} />
              {gcCurIdx !== null && (
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  {gcOpts.map((f) => {
                    const isCorrectAns = gcAnswered && f.label === GC_FUNCS[gcCurIdx].label;
                    const isWrong = gcAnswered && gcSelected === f.label && f.label !== GC_FUNCS[gcCurIdx].label;
                    return (
                      <button key={f.label} disabled={gcAnswered} onClick={() => handlePickGC(f.label)}
                        className={`border-[1.5px] rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                          isCorrectAns ? "border-[#4ade80] text-[#4ade80] bg-[rgba(74,222,128,.1)]" :
                          isWrong      ? "border-[#f87171] text-[#f87171] bg-[rgba(248,113,113,.08)]" :
                          gcAnswered   ? "border-[#1e2040] text-[#4a5080] bg-[#141528] cursor-default" :
                                         "border-[#1e2040] text-[#e2e8f0] bg-[#141528] hover:border-[#22d3ee] hover:text-[#22d3ee]"
                        }`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              )}
              {gcAnswered && gcCurIdx !== null && (
                <div className={`mt-4 p-4 rounded-xl text-sm leading-relaxed border ${gcFbOk ? "bg-[rgba(74,222,128,.08)] border-[rgba(74,222,128,.3)]" : "bg-[rgba(248,113,113,.07)] border-[rgba(248,113,113,.25)]"}`}>
                  <div className="font-black text-base mb-1">{gcFbOk ? "✅ Correto!" : `❌ Era ${GC_FUNCS[gcCurIdx].label}`}</div>
                  <div className="text-[#94a3b8]">{gcFbBody}</div>
                </div>
              )}
              <div className={`${monoSm} text-[#4a5080] mt-3`}>
                Acertos: <span className="text-[#4ade80]">{gcCorrect}</span> / <span>{gcTotal}</span>
              </div>
              <div className="mt-4 flex gap-3 justify-center">
                {gcAnswered && (
                  <button onClick={() => spawnGC(gcCorrect, gcTotal)} className={`${btnBase} bg-[rgba(34,211,238,.15)] text-[#22d3ee]`} style={{ border: "1.5px solid rgba(34,211,238,.4)" }}>
                    PRÓXIMO GRÁFICO →
                  </button>
                )}
                {!gcStarted && (
                  <button onClick={startGC} className={`${btnBase} bg-[#5b5ef4] text-white`} style={{ boxShadow: "0 4px 18px rgba(91,94,244,.35)" }}>
                    ▶ COMEÇAR DESAFIO
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB: TEORIA ══ */}
        {tab === "teoria" && (
          <div className="space-y-3">
            {[
              { tag: "Def. 23", title: "O que é Função?",
                body: <span>Uma <strong>função f: A → B</strong> associa a cada x ∈ A um <strong>único</strong> y ∈ B.<br />Toda função é relação, mas nem toda relação é função — a unicidade do y é o que distingue.</span> },
              { tag: undefined, title: "🗂️ Domínio · Contradomínio · Imagem",
                body: <span><strong>Domínio D(f)</strong> = A → valores de entrada (x)<br /><strong>Contradomínio CD(f)</strong> = B → todos os possíveis valores de saída<br /><strong>Imagem Im(f)</strong> ⊆ B → somente os y realmente atingidos por f(x)<br /><br />⚠️ Im(f) sempre está contida no CD(f), mas pode ser menor!</span> },
              { tag: undefined, title: "📐 Domínios Especiais (Lista UNIFOR — Q.5)",
                body: <span><strong>f(x) = 3x − x³</strong>: domínio = ℝ (polinômio)<br /><strong>f(x) = 5/(x²−9)</strong>: x ≠ ±3 (denominador ≠ 0)<br /><strong>f(x) = (x²−3x+2)/(x³+2x²−24x)</strong>: x ≠ 0, 4, −6<br /><strong>f(x) = √(x+5)</strong>: x ≥ −5 → domínio [−5, +∞)<br /><strong>f(x) = √(x²−8x+12)</strong>: x²−8x+12 ≥ 0 → x ≠ 2</span> },
              { tag: undefined, title: "🔢 Calcular f(x) — Q.2: f(x) = x²−4x+2",
                body: <span>f(5) = 25 − 20 + 2 = <strong>7</strong><br />f(−3) = 9 + 12 + 2 = <strong>23</strong><br />f(a) = a² − 4a + 2<br />f(a+b) = (a+b)² − 4(a+b) + 2</span> },
              { tag: undefined, title: "🔁 Função Par vs Ímpar",
                body: <span><strong>Par:</strong> f(−x) = f(x) → simétrico ao eixo y &nbsp;|&nbsp; Ex: f(x) = x²<br /><strong>Ímpar:</strong> f(−x) = −f(x) → simétrico à origem &nbsp;|&nbsp; Ex: f(x) = x³</span> },
              { tag: undefined, title: "🏗️ Aplicação — Q.8: Cercamento (A = x(100−2x))",
                body: <span>Perímetro = 2x + y = 100 → y = 100 − 2x<br />Área A(x) = x · y = x(100−2x) = 100x − 2x²<br />Máximo em x = 25 → A(25) = <strong>1250 m²</strong></span> },
              { tag: undefined, title: "🔗 Funções Compostas — Q.4",
                body: <span>Dadas f(x) = 1/x² e g(x) = 4−x²:<br /><strong>f(a)·g(b)</strong> = (1/a²)·(4−b²)<br /><strong>f(g(a))</strong> = f(4−a²) = 1/(4−a²)²<br /><strong>g(f(b))</strong> = g(1/b²) = 4 − (1/b²)² = 4 − 1/b⁴</span> },
              { tag: undefined, title: "📊 Tipos de Gráfico",
                body: <span>f(x) = c (constante) → <strong>reta horizontal</strong><br />f(x) = ax+b (1º grau) → <strong>reta inclinada</strong><br />f(x) = ax²+bx+c (2º grau) → <strong>parábola</strong> (a&gt;0: ∪ / a&lt;0: ∩)<br />f(x) = x³ → <strong>cúbica</strong> (S-shape)<br />f(x) = |x| → <strong>V</strong> com vértice na origem</span> },
            ].map(({ tag, title, body }, i) => (
              <div key={i} className="bg-[#0e0f1c] border border-[#1e2040] rounded-xl px-5 py-4 text-sm leading-7 text-[#94a3b8]" style={{ borderLeft: "3px solid #5b5ef4" }}>
                <h4 className="font-bold text-[0.88rem] text-[#e2e8f0] mb-2 flex items-center gap-2">
                  {tag && <span className={`${monoSm} bg-[rgba(91,94,244,.2)] text-[#818cf8] px-2 py-0.5 rounded`}>{tag}</span>}
                  {title}
                </h4>
                {body}
              </div>
            ))}
          </div>
        )}

        {/* ══ TAB: EXPLORADOR ══ */}
        {tab === "explorador" && (
          <div className={`${card} before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-[#5b5ef4] before:to-[#22d3ee]`}>
            <div className={`${monoSm} text-[#818cf8] mb-4`}>// Explorador de Funções — ajuste o parâmetro <em>a</em></div>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {(Object.keys(FTYPES) as FuncType[]).map((ft) => {
                const labels: Record<FuncType, string> = { linear: "f(x) = ax", quad: "f(x) = ax²", cubic: "f(x) = ax³", abs: "f(x) = a|x|", inv: "f(x) = a/x", sqrt: "f(x) = a√x" };
                return (
                  <button key={ft} onClick={() => setFuncType(ft)}
                    className={`px-4 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 border ${funcType === ft ? "bg-[rgba(91,94,244,.18)] border-[#818cf8] text-[#818cf8]" : "bg-[#141528] border-[#1e2040] text-[#4a5080] hover:border-[#22d3ee] hover:text-[#e2e8f0]"}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {labels[ft]}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <label className="text-[#4a5080] whitespace-nowrap text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Parâmetro <em>a</em> =</label>
              <input type="range" min={-4} max={4} step={0.25} value={paramA} onChange={(e) => setParamA(parseFloat(e.target.value))} className="flex-1 min-w-24 accent-[#5b5ef4]" />
              <span className="text-[#fbbf24] text-sm min-w-8 text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{paramA}</span>
            </div>
            <canvas ref={explorerRef} width={560} height={320} className="border border-[#1e2040] rounded-xl max-w-full block mx-auto cursor-crosshair" style={{ background: "#07080f" }} />
            {explorerInfo && (
              <div className="mt-3 p-3 rounded-lg text-xs leading-6 text-[#fde68a]"
                style={{ background: "rgba(251,191,36,.07)", border: "1px solid rgba(251,191,36,.2)", fontFamily: "'JetBrains Mono', monospace" }}>
                {explorerInfo}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
