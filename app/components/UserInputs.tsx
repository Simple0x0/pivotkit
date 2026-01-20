"use client";

import { useUserInputs } from "@/app/context/UserInputsContext";
import LigoloInputs from "@/app/ui/ligolo-ng/Inputs";
// import pathname from "";

export default function UserInputs({ tools }: { tools: any[] }) {
  const { selectedTool, pivots, updatePivot, addPivot, removePivot } = useUserInputs();

  if (!selectedTool) return null;

  if (selectedTool === "ligolo-ng") {
    return (
      <LigoloInputs
        pivots={pivots}
        updatePivot={updatePivot}
        addPivot={addPivot}
        removePivot={removePivot}
      />
    );
  }

  return null;
}
