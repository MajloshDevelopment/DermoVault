import React from 'react';
import { X, Sparkles, Brain, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { HighThinkingAnalysis } from '../types/skin';

interface ReasoningTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  highThinking: HighThinkingAnalysis | null;
}

export const ReasoningTraceModal: React.FC<ReasoningTraceModalProps> = ({
  isOpen,
  onClose,
  highThinking
}) => {
  if (!isOpen || !highThinking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Brain className="w-4 h-4" />
          <span>Gemini 4 Carbon High-Thinking Reasoning Trace</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Dermatological Clinical Deduction Trace
        </h2>

        {/* Model Metadata Bar */}
        <div className="flex flex-wrap items-center gap-3 my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div>
            <span className="text-slate-400">Model:</span>{' '}
            <strong className="text-slate-900 dark:text-white font-mono">{highThinking.modelUsed}</strong>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400">Thinking Level:</span>{' '}
            <strong className="text-teal-600 dark:text-teal-400 font-mono">{highThinking.thinkingLevel}</strong>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div>
            <span className="text-slate-400">Timestamp:</span>{' '}
            <span className="text-slate-600 dark:text-slate-300 font-mono">
              {new Date(highThinking.thinkingTimestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {/* Executive Clinical Summary */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1.5">
              Executive Assessment
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40">
              {highThinking.clinicalSummary}
            </p>
          </div>

          {/* Sequential Reasoning Chain */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Sequential Multi-Step Reasoning Sequence
            </h3>
            <div className="space-y-2">
              {highThinking.reasoningTrace.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Differential Diagnosis Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Differential Diagnosis Matrix
            </h3>
            <div className="space-y-2">
              {highThinking.differentialDiagnosis.map((diag, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{diag.condition}</span>
                    <span className="font-semibold text-teal-600 dark:text-teal-400">Likelihood: {diag.likelihood}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {diag.rationale}
                  </p>
                  <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 pt-1">
                    Recommendation: <span className="text-teal-700 dark:text-teal-300">{diag.urgency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Synergies & Contraindications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-1.5">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                Formulation Synergies
              </span>
              <ul className="text-[11px] text-emerald-800 dark:text-emerald-300 space-y-1 list-disc pl-4">
                {highThinking.activeIngredientSynergies.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 space-y-1.5">
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
                Contraindications to Avoid
              </span>
              <ul className="text-[11px] text-rose-800 dark:text-rose-300 space-y-1 list-disc pl-4">
                {highThinking.ingredientContraindications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
