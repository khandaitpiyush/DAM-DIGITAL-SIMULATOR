import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock } from 'lucide-react';
import { TimelineStep } from '../../types/simulation';

interface TimelineControlProps {
  currentStep: TimelineStep;
  onStepChange: (step: TimelineStep) => void;
}

const TIMELINE_STEPS: TimelineStep[] = [
  'T+00',
  'T+30 MIN',
  'T+1 HR',
  'T+3 HR',
  'T+6 HR',
  'T+12 HR',
  'T+24 HR',
];

export const TimelineControl: React.FC<TimelineControlProps> = ({
  currentStep,
  onStepChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);

  const currentIndex = TIMELINE_STEPS.indexOf(currentStep);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = (2000 / speed);
    const timer = setInterval(() => {
      onStepChange(
        TIMELINE_STEPS[(TIMELINE_STEPS.indexOf(currentStep) + 1) % TIMELINE_STEPS.length]
      );
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, currentStep, speed, onStepChange]);

  const handleReset = () => {
    setIsPlaying(false);
    onStepChange('T+00');
  };

  return (
    <div className="w-full bg-[#0F172A] border border-slate-800 rounded-lg p-3 shadow-lg select-none">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Playback Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-bold flex items-center gap-1.5 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>PLAY</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Reset to T+00"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 ml-2">
            {[1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s as 1 | 2 | 5)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  speed === s
                    ? 'bg-cyan-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}×
              </button>
            ))}
          </div>

          <span className="hidden xl:inline-block text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            Active Wave Propagation Index: <span className="text-cyan-300 font-bold">{currentStep}</span>
          </span>
        </div>

        {/* Center: Interactive Timeline Stepper Buttons */}
        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2 w-full max-w-xl">
          {TIMELINE_STEPS.map((step, idx) => {
            const isCurrent = step === currentStep;
            const isPast = idx < currentIndex;

            return (
              <button
                key={step}
                onClick={() => {
                  setIsPlaying(false);
                  onStepChange(step);
                }}
                className={`flex-1 py-1.5 px-2 rounded text-center transition-all font-mono text-[11px] border ${
                  isCurrent
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-950 ring-1 ring-cyan-500/40'
                    : isPast
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="truncate">{step}</div>
                <div
                  className={`h-1 w-full rounded-full mt-1 ${
                    isCurrent ? 'bg-cyan-400' : isPast ? 'bg-cyan-800' : 'bg-slate-800'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Right: Future Integration Helper Note */}
        <div className="hidden lg:flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
          <Clock className="w-3.5 h-3.5 text-cyan-500/70" />
          <span>Syncs with future 3D wave animation</span>
        </div>
      </div>
    </div>
  );
};
