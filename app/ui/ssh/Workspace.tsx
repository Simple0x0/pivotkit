"use client";

import { useSSHPivot } from "@/app/hooks/useSSHPivot";
import SSHInputs from "./Inputs";
import SSHCommandsDisplay from "./SSHCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver"; 

export default function SSHWorkspace() {
  const {
    pivot,
    updatePivot,
    setMode,
    addForward,
    updateForward,
    removeForward,
  } = useSSHPivot();

//   const resolvedCommands = resolvePivotCommands(pivots);
  return (
    <div className="space-y-10">
      <SSHInputs
        pivot={pivot}
        updatePivot={updatePivot}
        setMode={setMode}
        addForward={addForward}
        updateForward={updateForward}
        removeForward={removeForward}
      />

      {/* <SSHCommandsDisplay pivots={pivots} resolvedCommands={resolvedCommands}/> */}
    </div>
  );
}
