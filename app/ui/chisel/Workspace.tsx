"use client";

import { useChiselPivot } from "@/app/hooks/useChiselPivot";
import ChiselInputs from "./Inputs";
import ChiselCommandsDisplay from "./ChiselCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver";

export default function ChiselWorkspace() {
  const {
    pivot,
    updatePivot,
    setMode,
    addForward,
    updateForward,
    removeForward,
  } = useChiselPivot();

  const resolvedCommands = resolvePivotCommands(pivot);

  return (
    <div className="space-y-10">
      <ChiselInputs
        pivot={pivot}
        updatePivot={updatePivot}
        setMode={setMode}
        addForward={addForward}
        updateForward={updateForward}
        removeForward={removeForward}
      />
      <ChiselCommandsDisplay pivot={pivot} resolvedCommands={resolvedCommands} />
    </div>
  );
}
