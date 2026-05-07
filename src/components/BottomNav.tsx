"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/quiz", icon: "quiz", label: "Quiz" },
  { href: "/visualizador", icon: "function", label: "Visualizador" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d1515] border-t border-[#3a494b]/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 ${
                isActive ? "text-[#00dbe7]" : "text-[#8fa9ab]"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {item.icon}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
