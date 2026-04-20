import { loadTools, loadToolById } from "@/app/lib/toolLoader";
import { notFound } from "next/navigation";
import LigoloWorkspace from "@/app/ui/ligolo-ng/Workspace";
import SSHWorkspace from "@/app/ui/ssh/Workspace";
import ChiselWorkspace from "@/app/ui/chisel/Workspace";
import SocatWorkspace from "@/app/ui/socat/Workspace";
import NetshWorkspace from "@/app/ui/netsh/Workspace";
import RpivotWorkspace from "@/app/ui/rpivot/Workspace";
import type { Metadata } from "next";
import React from "react";

export const dynamicParams = false;
export function generateStaticParams() {
  return loadTools().map((tool) => ({ tool: tool.id }));
}

/* ---------------- Dynamic SEO ---------------- */
const BASE_URL = "https://pivotkit.teamsimple.net";

export async function generateMetadata(
  { params }: { params: Promise<{ tool: string }> }
): Promise<Metadata> {
  const { tool } = await params;
  const toolData = loadToolById(tool);
  if (!toolData) return {};

  const title = `${toolData.name} | PivotKit`;
  const description = toolData.description;
  const url = `${BASE_URL}/tools/${tool}`;

  return {
    title,
    description,
    keywords: toolData.keywords ?? [
      "pivoting", toolData.name, "red team",
      "penetration testing", "network pivoting",
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url,
      siteName: "PivotKit",
      images: [
        {
          url: `${BASE_URL}/pivotkit.png`,  // one shared OG image is fine
          width: 1200,
          height: 630,
          alt: `${toolData.name} — PivotKit`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/pivotkit.png`],
    },
  };
}

/* ---------------- Workspace Map ---------------- */

const WORKSPACE_MAP: Record<string, React.FC> = {
  "ligolo-ng": LigoloWorkspace,
  "ssh": SSHWorkspace,
  "chisel": ChiselWorkspace,
  "socat": SocatWorkspace,
  "netsh": NetshWorkspace,
  "rpivot": RpivotWorkspace,
};

/* ---------------- Page ---------------- */

type Props = {
  params: Promise<{ tool: string }>;
};

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;

  const toolData = loadToolById(tool);
  if (!toolData) return notFound();

  const ToolWorkspace = WORKSPACE_MAP[tool];
  if (!ToolWorkspace) return notFound();

  return (
    <>
      <p className="text-zinc-400 text-center text-xs">{toolData.description} <a href={toolData.blog} target="_blank" className="text-blue-400 font-bold" >Learn about this tool</a>.</p>
      <ToolWorkspace />
    </>
  );
}
