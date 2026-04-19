import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ToolMenu from "@/app/components/ToolMenu";
import { loadTools } from "@/app/lib/toolLoader";

// UI font — clean, sharp, highly legible
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Code/command font — only applied on <code> elements
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PivotKit",
  description:
    "Deterministic network pivoting command generator for penetration testers",
};

const scanlineStyle: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,1) 3px, rgba(255,255,255,1) 4px)",
};

const gridStyle: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), " +
    "linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tools = loadTools();

  return (
    <html lang="en">
      <body
        className={`
          ${inter.variable}
          ${jetbrainsMono.variable}
          font-sans
          bg-zinc-950
          text-zinc-100
          antialiased
          min-h-screen
          bg-[radial-gradient(ellipse_90%_40%_at_50%_0%,rgba(16,185,129,0.06)_0%,transparent_65%)]
        `}
      >
        {/* Scanline overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.012]"
          aria-hidden="true"
          style={scanlineStyle}
        />

        {/* Top accent bar */}
        <div className="relative z-10 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/70 to-transparent" />

        <div className="relative z-10 min-h-screen flex justify-center px-4 py-8">
          <div className="w-full lg:w-[90%] xl:w-4/5 flex flex-col lg:flex-row rounded-xl overflow-hidden border border-zinc-800/50 shadow-[0_0_80px_rgba(0,0,0,0.8)]">

            {/* ── Main Content ── */}
            <main className="flex-1 bg-zinc-900/90 backdrop-blur-sm flex flex-col">

              {/* Header */}
              <header className="relative px-8 pt-7 pb-6 border-b border-zinc-800/60 bg-zinc-900/60 overflow-hidden">
                {/* Grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  aria-hidden="true"
                  style={gridStyle}
                />

                <div className="relative flex items-center justify-between flex-wrap gap-4">
                  {/* Logo */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                      <div className="flex gap-1 items-center">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="w-2 h-2 rounded-full bg-zinc-600" />
                        <span className="w-2 h-2 rounded-full bg-zinc-700" />
                      </div>
                      <h1 className="text-xl font-bold tracking-[0.3em] uppercase text-zinc-100">
                        PivotKit
                      </h1>
                    </div>
                    <p className="text-[9px] tracking-[0.35em] uppercase text-zinc-600 ml-8">
                      Attacker / Pentester Perspective
                    </p>
                  </div>

                  {/* Live badge */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-emerald-500/15 bg-emerald-500/5 text-emerald-400/80">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    <span className="text-[9px] tracking-[0.25em] uppercase font-semibold">
                      Live
                    </span>
                  </div>
                </div>
              </header>

              {/* Page body */}
              <section className="flex-1 px-8 py-8 flex flex-col gap-6 w-full max-w-6xl mx-auto">
                <ToolMenu tools={tools} />
                {children}
              </section>
            </main>

            {/* ── Right Panel ── */}
            <aside className="w-full lg:w-56 xl:w-64 bg-zinc-950/80 border-t lg:border-t-0 lg:border-l border-zinc-800/50 flex flex-col text-xs">

              {/* Panel label */}
              <div className="px-5 py-4 border-b border-zinc-800/50 flex items-center gap-2">
                <span className="text-[9px] tracking-[0.3em] uppercase text-zinc-600">
                  Panel
                </span>
                <span className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Network Visual Maps module */}
              <div className="px-5 py-5 border-b border-zinc-800/50 flex flex-col gap-3">
                <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-600">
                  Module
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500/50 text-base leading-none">
                    ⬡
                  </span>
                  <p className="text-zinc-300 font-semibold tracking-wide text-[11px]">
                    Network Visual Maps
                  </p>
                </div>
                <div className="rounded-md border border-dashed border-zinc-700/50 bg-zinc-900/50 p-4 flex flex-col items-center gap-2 text-center">
                  <div className="grid grid-cols-3 gap-1 opacity-20">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-zinc-400 inline-block"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600 leading-relaxed mt-1">
                    Topology renderer
                    <br />
                    coming soon
                  </p>
                </div>
              </div>

              {/* Contribute section */}
              <div className="px-5 py-5 flex flex-col gap-3 flex-1">
                <p className="text-[9px] tracking-[0.3em] uppercase text-zinc-600">
                  Contribute
                </p>
                <p className="text-[10px] text-zinc-500 leading-relaxed">
                  Interested in building a visual map renderer for this panel?
                </p>
                <a
                  href="https://discordapp.com/users/917464985922338846"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-150"
                >
                  <span className="w-3 h-px bg-emerald-400 inline-block" />
                  Get in touch
                </a>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-zinc-800/50">
                <p className="text-[9px] tracking-[0.25em] uppercase text-zinc-700">
                  PivotKit · Open Source
                </p>
              </div>

            </aside>
          </div>
        </div>
      </body>
    </html>
  );
}