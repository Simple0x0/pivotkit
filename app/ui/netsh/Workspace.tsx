"use client";

import { useNetshPivot } from "@/app/hooks/useNetshPivot";
import NetshInputs from "./Inputs";
import NetshCommandsDisplay from "./NetshCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver";

export default function NetshWorkspace() {
  const { pivot, updatePivot } = useNetshPivot();
  const resolvedCommands = resolvePivotCommands(pivot);

  return (
    <div className="space-y-10">
      <NetshInputs pivot={pivot} updatePivot={updatePivot} />
      <NetshCommandsDisplay pivot={pivot} resolvedCommands={resolvedCommands} />
    </div>
  );
}
