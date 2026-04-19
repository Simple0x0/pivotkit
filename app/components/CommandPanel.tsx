import CommandRow from "@/app/components/CommandRow";
import { CommandStep } from "@/app/types/tool";

export default function CommandPanel({
  title,
  steps,
  commentStyle = "text-[10px] font-normal font-mono text-zinc-600 break-all leading-relaxed tracking-wide italic",
  actionStyle  = "text-[13px] font-semibold font-mono text-emerald-300/90 break-all leading-relaxed tracking-wide",
}: {
  title: string;
  steps?: CommandStep[];
  commentStyle?: string;
  actionStyle?: string;
}) {
  return (
    <div className="rounded-lg p-4 space-y-2">
      <h4 className="text-[10px] font-semibold text-bold text-zinc-200 uppercase mb-3">
        On {title}
      </h4>

      {steps?.length === 0 && (
        <p className="text-[10px] text-zinc-600 italic">No commands generated</p>
      )}

      <div className="space-y-1">
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