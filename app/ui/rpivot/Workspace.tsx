"use client";

import { useRpivotPivot } from "@/app/hooks/useRpivotPivot";
import RpivotInputs from "./Inputs";
import RpivotCommandsDisplay from "./RpivotCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver";

export default function RpivotWorkspace() {
  const { pivot, updatePivot } = useRpivotPivot();
  const resolvedCommands = resolvePivotCommands(pivot);

  return (
    <div className="space-y-10">
      <RpivotInputs pivot={pivot} updatePivot={updatePivot} />
      <RpivotCommandsDisplay pivot={pivot} resolvedCommands={resolvedCommands} />
    </div>
  );
}
