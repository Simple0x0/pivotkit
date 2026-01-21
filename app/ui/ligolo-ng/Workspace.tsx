// app/ui/ligolo-ng/LigoloWorkspace.tsx
"use client";

import { usePivotChain } from "@/app/hooks/usePivotChain";
import LigoloInputs from "./Inputs";
import LigoloCommands from "./Commands";

export default function LigoloWorkspace() {
  const {
    pivots,
    updatePivot,
    addPivot,
    removePivot,
  } = usePivotChain(1);

  return (
    <div className="space-y-10">
      <LigoloInputs
        pivots={pivots}
        updatePivot={updatePivot}
        addPivot={addPivot}
        removePivot={removePivot}
      />

      <LigoloCommands pivots={pivots} />
    </div>
  );
}


