import { MetadataRoute } from "next";
import { loadTools } from "@/app/lib/toolLoader";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = loadTools();
  const base = "https://pivotkit.teamsimple.net";

  return [
    {
      url: base,
      lastModified: new Date(),
      priority: 1,
    },
    ...tools.map((tool) => ({
      url: `${base}/tools/${tool.id}`,
      lastModified: new Date(),
      priority: 0.8,
    })),
  ];
}