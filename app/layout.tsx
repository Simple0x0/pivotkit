import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToolMenu from "@/app/components/ToolMenu";
import { loadTools } from "@/app/lib/toolLoader";

// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "PivotKit",
  description: "Deterministic network pivoting command generator for penetration testers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tools = loadTools();

  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100">
        <div className="min-h-screen flex justify-center p-3">
          {/* Use flex-col on small screens, flex-row on lg */}
          <div className="w-full lg:w-4/5 bg-zinc-900 rounded-2xl shadow-lg flex flex-col lg:flex-row">

            {/* Main Content */}
            <main className="flex-1 p-6">
              <header className="text-center mb-6">
                <h1 className="text-4xl font-semibold">Pivoting ToolKits</h1>
              </header>

              <section className="mx-auto w-full lg:w-4/5 flex flex-col gap-6">
                <ToolMenu tools={tools} />
                {children}
              </section>
            </main>

            {/* Reserved Right Panel */}
            <aside className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-zinc-800 p-4 text-sm text-zinc-500 mt-4 lg:mt-0">
              This area is intended for{" "}
              <strong className="text-gray-400">Network Visual Maps</strong>.
              <br />
              Want to contribute?{" "}
              <a
                href="https://discordapp.com/users/917464985922338846"
                className="text-zinc-300 hover:underline"
              >
                Get in touch
              </a>
            </aside>

          </div>
        </div>
      </body>
    </html>
  );
}
