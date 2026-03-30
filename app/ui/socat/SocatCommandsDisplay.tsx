"use client";

import { SocatPivot } from "@/app/hooks/useSocatPivot";
import { SocatCommandSection } from "./CommandResolver";
import CommandPanel from "@/app/components/CommandPanel";
import CommandRow from "@/app/components/CommandRow";

const commentStyle =
  "text-sm font-mono text-zinc-500 italic break-all leading-relaxed";

export default function SocatCommandsDisplay({
  pivot,
  sections,
}: {
  pivot: SocatPivot;
  sections: SocatCommandSection[];
}) {
  if (!pivot || sections.length === 0) return null;

  /*
   * 2 sections  → side-by-side card (single-hop TCP/UDP or TTY shell)
   * 3+ sections → Ligolo-style stacked sections with dividers (multi-hop TCP)
   */
  if (sections.length === 2) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-gray-950 shadow-lg p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          <CommandPanel
            title={sections[0].title}
            steps={sections[0].steps}
            commentStyle={commentStyle}
          />
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 h-3/5 w-px -ml-3 mt-3 -translate-y-1/2 bg-slate-700" />
            <CommandPanel
              title={sections[1].title}
              steps={sections[1].steps}
              commentStyle={commentStyle}
            />
          </div>
        </div>
      </div>
    );
  }

  // Multi-hop: stacked sections ordered by setup sequence (innermost relay first)
  return (
    <div className="space-y-4">
      <p className="text-[11px] text-zinc-500 text-center tracking-wide uppercase">
        Commands ordered by setup sequence · run innermost relay first
      </p>

      <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-8 scrollable">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            {/* Section divider header */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-700" />
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                {section.title}
              </span>
              <div className="h-px flex-1 bg-zinc-700" />
            </div>

            {/* Steps card — rendered directly to avoid duplicate "On {title}" header */}
            <div className="rounded-xl border border-zinc-800 bg-gray-950 shadow-lg p-5 space-y-2">
              {section.steps.map(s => (
                <CommandRow
                  key={s.step}
                  step={s.step}
                  cmd={s.command}
                  commentClass={commentStyle}
                  actionClass="text-sm font-bold font-sans text-zinc-400 break-all leading-relaxed"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
