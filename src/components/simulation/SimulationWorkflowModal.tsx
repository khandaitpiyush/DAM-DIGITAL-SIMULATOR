import React from 'react';
import { CheckCircle2, Loader2, Cpu, X, AlertTriangle, Shield } from 'lucide-react';
import { WorkflowStep } from '../../types/simulation';

interface SimulationWorkflowModalProps {
  isOpen: boolean;
  steps: WorkflowStep[];
  currentStepIndex: number;
  onClose: () => void;
}

export const SimulationWorkflowModal: React.FC<SimulationWorkflowModalProps> = ({
  isOpen,
  steps,
  currentStepIndex,
  onClose,
}) => {
  if (!isOpen) return null;

  const isFinished = currentStepIndex >= steps.length - 1 && steps[steps.length - 1]?.status === 'completed';
  const progressPct = Math.round(((currentStepIndex + (isFinished ? 1 : 0)) / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
      <div className="w-full max-w-xl bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0B0F17] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-slate-100 tracking-wider uppercase">
                HYDRODYNAMIC SIMULATION PIPELINE
              </h3>
              <div className="text-[11px] text-cyan-400/90 font-mono">
                2D Shallow Water Equations Solver (EOC Workflow)
              </div>
            </div>
          </div>

          {isFinished && (
            <button
              onClick={onClose}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Bar & Subtext */}
        <div className="px-5 pt-4 pb-2">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-400">Execution Progress</span>
            <span className="text-cyan-400 font-bold">{progressPct}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="px-5 py-3 max-h-[380px] overflow-y-auto space-y-2 text-xs font-mono">
          {steps.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';
            const isPending = step.status === 'pending';

            return (
              <div
                key={step.id}
                className={`p-2.5 rounded border transition-all flex items-start justify-between ${
                  isActive
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300'
                    : 'bg-[#0B0F17]/40 border-slate-800/40 text-slate-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`text-[11px] font-bold mt-0.5 ${
                      isActive ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  >
                    {step.code}
                  </span>

                  <div>
                    <div
                      className={`font-semibold tracking-wide ${
                        isActive ? 'text-cyan-200' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {step.description}
                    </div>
                  </div>
                </div>

                <div className="ml-2 mt-0.5">
                  {isActive && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />}
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isPending && <span className="text-[10px] text-slate-600">WAITING</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0B0F17] border-t border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>SIH 2026 Simulation Sandbox Mode</span>
          </div>

          {isFinished ? (
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow"
            >
              VIEW RESULTS & TIMELINE
            </button>
          ) : (
            <span className="text-cyan-400 text-[11px] animate-pulse">
              Computing hydrodynamic domain...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
