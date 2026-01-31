import { loadTools, loadToolById } from "@/app/lib/toolLoader";
import { notFound } from "next/navigation";
import LigoloWorkspace from "@/app/ui/ligolo-ng/Workspace";
import type { Metadata } from "next";
import React from "react";

export const dynamicParams = false;
const DEFAULT_IMAGE = "/public/ligolo-ng.png";

export function generateStaticParams() {
  return loadTools().map((tool) => ({ tool: tool.id }));
}

/* ---------------- Dynamic SEO ---------------- */

export async function generateMetadata(
  { params }: { params: Promise<{ tool: string }> }
): Promise<Metadata> {
  const { tool } = await params;

  const toolData = loadToolById(tool);
  if (!toolData) return {};

  const title = `${toolData.name} | PivotKit`;
  const description = toolData.description;
  const image = toolData.image ?? DEFAULT_IMAGE;
  console.log("Generating metadata for", tool, "with image", image);
  return {
    title,
    description,
    keywords: toolData.keywords ?? [
      "pivoting",
      toolData.name,
      "red team",
      "penetration testing",
      "network pivoting",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ---------------- Workspace Map ---------------- */

const WORKSPACE_MAP: Record<string, React.FC> = {
  "ligolo-ng": LigoloWorkspace,
  // future tools here
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
      <p className="text-zinc-400 text-center text-xs">{toolData.description} <a href={toolData.blog} target="_blank" className="text-blue-500 ">Learn about this tool</a>.</p>
      <ToolWorkspace />
    </>
  );
}
