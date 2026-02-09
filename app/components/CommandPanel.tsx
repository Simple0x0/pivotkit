
import CommandRow from "@/app/components/CommandRow";
import { CommandStep } from "@/app/types/tool";

export default function CommandPanel({
  title,
  steps,
  // allow callers to override styles for comment vs action
  commentStyle = "text-sm font-bold font-sans text-zinc-400 break-all leading-relaxed",
  actionStyle = "text-sm font-bold font-sans text-zinc-400 break-all leading-relaxed",
}: {
  title: string;
  steps?: CommandStep[];
  commentStyle?: string;
  actionStyle?: string;
}) {
  return (
    <div className="rounded-lg  p-4 space-y-3">
      <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wide">
        On {title}
      </h4>

      {steps?.length === 0 && (
        <p className="text-xs text-zinc-500 italic">No commands generated</p>
      )}

      <div className="space-y-2">
        {steps?.map((s) => (
          <CommandRow
            key={`${title}-${s.step}`}
            step={s.step}
            cmd={s.command}
            commentClass={commentStyle}
            actionClass={actionStyle}
          />
        ))}
      </div>
    </div>
  );
}
