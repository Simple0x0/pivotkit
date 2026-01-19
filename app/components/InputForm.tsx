"use client";

import { useState } from "react";
import { ToolDefinition } from "@/app/types/tool";
import CommandOutput from "./CommandOutput";
import { validateInputs } from "@/app/lib/validators";

interface Props {
  tool: ToolDefinition;
}

export default function InputForm({ tool }: Props) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(key: string, value: any) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateInputs(tool.inputs, values);
    setErrors(validationErrors);
    setSubmitted(Object.keys(validationErrors).length === 0);
  }

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(tool.inputs).map(([key, input]) => (
        <div key={key}>
          <label>{input.label || key}</label>
          <input
            type="text"
            defaultValue={input.default as any}
            onChange={(e) => handleChange(key, e.target.value)}
          />
          {errors[key] && <p style={{ color: "red" }}>{errors[key]}</p>}
        </div>
      ))}

      <button type="submit">Generate Commands</button>

      {submitted && (
        <CommandOutput tool={tool} values={values} />
      )}
    </form>
  );
}
