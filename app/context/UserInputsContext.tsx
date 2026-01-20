"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ToolDefinition } from "@/app/types/tool";

type Pivot = {
  attackerIP?: string;
  attackerPort?: number;
  attackerOS?: string;
  targetIP?: string;
  targetPort?: number;
  targetOS?: string;
  network?: string;
  cidr?: number;
};



interface UserInputsContextValue {
  selectedTool?: string;
  setSelectedTool: (tool: string) => void;
  pivots: Pivot[];
  updatePivot: (index: number, patch: Partial<Pivot>) => void;
  addPivot: () => void;
  removePivot: (index: number) => void;
}

const UserInputsContext = createContext<UserInputsContextValue | undefined>(
  undefined
);

const createEmptyPivot = (): Pivot => ({
  attackerIP: "0.0.0.0",
  attackerPort: 4444,
  attackerOS: "Linux",
  targetIP: "",
  targetPort: 4444,
  targetOS: "Linux",
  network: "",
  cidr: 24,
});

export function UserInputsProvider({ children }: { children: ReactNode }) {
  const [selectedTool, setSelectedTool] = useState<string>();
  const [pivots, setPivots] = useState<Pivot[]>([createEmptyPivot()]);

  function updatePivot(index: number, patch: Partial<Pivot>) {
    setPivots((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p))
    );
  }

  function addPivot() {
    setPivots((prev) => [...prev, createEmptyPivot()]);
  }

  function removePivot(index: number) {
    setPivots((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <UserInputsContext.Provider
      value={{
        selectedTool,
        setSelectedTool,
        pivots,
        updatePivot,
        addPivot,
        removePivot,
      }}
    >
      {children}
    </UserInputsContext.Provider>
  );
}

export function useUserInputs() {
  const context = useContext(UserInputsContext);
  if (!context) throw new Error("useUserInputs must be used within UserInputsProvider");
  return context;
}
