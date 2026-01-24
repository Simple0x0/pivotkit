// Types.ts

export type CommandStep = {
  step: number;
  command: string;
};

export type PivotCommands = {
  attacker: CommandStep[];
  proxy: CommandStep[];
  target: CommandStep[];
};
