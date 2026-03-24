"use client";

import { useSocatPivot } from "@/app/hooks/useSocatPivot";
import SocatInputs from "./Inputs";
import SocatCommandsDisplay from "./SocatCommandsDisplay";
import { resolvePivotCommands } from "./CommandResolver";

export default function SocatWorkspace() {
  const { pivot, updatePivot } = useSocatPivot();
  const resolvedCommands = resolvePivotCommands(pivot);

  return (
    <div className="space-y-10">
      <SocatInputs pivot={pivot} updatePivot={updatePivot} />
      <SocatCommandsDisplay pivot={pivot} resolvedCommands={resolvedCommands} />
    </div>
  );
}
