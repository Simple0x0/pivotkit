"use client";

import { useSocatPivot } from "@/app/hooks/useSocatPivot";
import SocatInputs from "./Inputs";
import SocatCommandsDisplay from "./SocatCommandsDisplay";
import { resolveSocatCommands } from "./CommandResolver";

export default function SocatWorkspace() {
  const { pivot, updatePivot, setMode, updateHop } = useSocatPivot();

  const sections = resolveSocatCommands(pivot);

  return (
    <div className="space-y-10">
      <SocatInputs
        pivot={pivot}
        updatePivot={updatePivot}
        setMode={setMode}
        updateHop={updateHop}
      />
      <SocatCommandsDisplay pivot={pivot} sections={sections} />
    </div>
  );
}

