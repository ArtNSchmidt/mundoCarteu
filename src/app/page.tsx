"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PHRASES = [
  "Traçando a parábola perfeita...",
  "Calculando o ponto de máximo da sua experiência...",
  "Encontrando as raízes do conhecimento...",
  "Posicionando o vértice no lugar certo...",
  "Concavidade voltada para cima: preparando a recepção...",
  "Otimizando o Delta para evitar problemas...",
];

const PHRASE_DURATION = 1800; // ms por frase

export default function LandingPage() {
  const router = useRouter();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (done) return;

    const total = PHRASES.length * PHRASE_DURATION;
    const tickInterval = 50;

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        const next = p + (tickInterval / total) * 100;
        return next >= 100 ? 100 : next;
      });
    }, tickInterval);

    const phraseTimer = setInterval(() => {
      setPhraseIndex((i) => {
        const next = i + 1;
        if (next >= PHRASES.length) {
          clearInterval(phraseTimer);
          clearInterval(progressTimer);
          setProgress(100);
          setTimeout(() => setDone(true), 300);
          return i;
        }
        setVisible(false);
        setTimeout(() => setVisible(true), 200);
        return next;
      });
    }, PHRASE_DURATION);

    return () => {
      clearInterval(progressTimer);
      clearInterval(phraseTimer);
    };
  }, [done]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d1515] px-6">
      {/* Logo */}
      <div className="mb-12 flex flex-col items-center gap-3 landing-fade-in">
        <span
          className="material-symbols-outlined text-[#00dbe7]"
          style={{ fontSize: 56, textShadow: "0 0 24px rgba(0,219,231,0.8)" }}
        >
          function
        </span>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#00dbe7]"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            textShadow: "0 0 24px rgba(0,219,231,0.6)",
          }}
        >
          MundoDescartes
        </h1>
        <p className="text-[#8fa9ab] text-sm tracking-widest uppercase">
          Visualizador de Funções
        </p>
      </div>

      {/* Loading area */}
      <div className="w-full max-w-md flex flex-col items-center gap-6 landing-fade-in" style={{ animationDelay: "0.3s" }}>
        {/* Phrase */}
        <p
          className={`text-[#dce4e4] text-center text-base md:text-lg transition-opacity duration-200 min-h-[28px] ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {PHRASES[phraseIndex]}
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#1a2728] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-[#00dbe7] transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              boxShadow: "0 0 12px rgba(0,219,231,0.7)",
            }}
          />
        </div>

        {/* Enter button */}
        {done && (
          <button
            onClick={() => router.push("/quiz")}
            className="mt-4 px-8 py-3 rounded-lg font-semibold text-[#0d1515] bg-[#00dbe7] hover:bg-[#00f2ff] transition-colors duration-200 landing-btn-appear"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              boxShadow: "0 0 20px rgba(0,219,231,0.5)",
            }}
          >
            Entrar no sistema
          </button>
        )}
      </div>
    </div>
  );
}
