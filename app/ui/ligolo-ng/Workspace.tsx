"use client";

import { usePivotChain } from "@/app/hooks/usePivotChain";
import LigoloInputs from "./Inputs";
import LigoloCommandsDisplay from "./LigoloCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver"; 

export default function LigoloWorkspace() {
  const {
    pivots,
    updatePivot,
    addPivot,
    removePivot,
  } = usePivotChain();

  const resolvedCommands = resolvePivotCommands(pivots);
  return (
    <div className="space-y-10">
      <LigoloInputs
        pivots={pivots}
        updatePivot={updatePivot}
        addPivot={addPivot}
        removePivot={removePivot}
      />

      <LigoloCommandsDisplay pivots={pivots} resolvedCommands={resolvedCommands}/>
    </div>
  );
}
