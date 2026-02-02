"use client";

import { useLigoloPivotChain } from "@/app/hooks/useLigoloPivotChain";
import LigoloInputs from "./Inputs";
import LigoloCommandsDisplay from "./LigoloCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver"; 

export default function LigoloWorkspace() {
  const {
    pivots,
    updatePivot,
    addPivot,
    removePivot,
  } = useLigoloPivotChain();

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
