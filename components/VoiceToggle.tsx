import React from "react";

interface VoiceToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const VoiceToggle: React.FC<VoiceToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <section className="mb-10">
      <div
        className="flex items-center justify-between bg-slate-900/40 p-5 rounded-2xl border border-white/5 cursor-pointer group hover:bg-slate-900/60 transition-all"
        onClick={onToggle}
      >
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Voice Guidance
          </h2>
          <p className="text-[10px] text-slate-500 mt-1">
            Pleasant female coaching voice
          </p>
        </div>
        <div
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${enabled ? "bg-emerald-500" : "bg-slate-700"}`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-0"}`}
          />
        </div>
      </div>
    </section>
  );
};
