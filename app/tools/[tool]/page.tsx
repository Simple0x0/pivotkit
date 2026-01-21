import { loadTools, loadToolById } from "@/app/lib/toolLoader";
import MainWorkspace from "@/app/components/MainWorkspace";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export function generateStaticParams() {
  return loadTools().map((tool) => ({ tool: tool.id }));
}

type Props = {
  params: Promise<{ tool: string }>;
};

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;

  const toolData = loadToolById(tool);
  if (!toolData) return notFound();

  return (
    <>
      <MainWorkspace tool={tool} />
      <h1 className="text-2xl font-semibold mb-2">{toolData.name}</h1>
      <p className="text-zinc-400 mb-6">{toolData.description}</p>
    </>
  );
}
