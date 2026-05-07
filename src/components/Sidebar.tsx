"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/quiz", icon: "quiz", label: "Quiz" },
  { href: "/visualizador", icon: "function", label: "Visualizador" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full z-50 flex flex-col w-16 xl:w-56 bg-[#0d1515] border-r border-[#3a494b]/50">
      {/* Logo */}
      <div className="h-14 flex items-center gap-3 px-4 border-b border-[#3a494b]/50 shrink-0">
        <span
          className="material-symbols-outlined text-[#00dbe7] shrink-0"
          style={{ fontSize: 22, textShadow: "0 0 8px rgba(0,219,231,0.7)" }}
        >
          function
        </span>
        <span
          className="hidden xl:block text-base font-bold text-[#00dbe7] whitespace-nowrap overflow-hidden"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            textShadow: "0 0 8px rgba(0,219,231,0.7)",
          }}
        >
          MundoDescartes
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-2 pt-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 group ${
                isActive
                  ? "bg-[#00dbe7]/10 text-[#00dbe7]"
                  : "text-[#8fa9ab] hover:bg-[#1a2728] hover:text-[#dce4e4]"
              }`}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{ fontSize: 20 }}
              >
                {item.icon}
              </span>
              <span
                className="hidden xl:block text-sm font-medium whitespace-nowrap"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
