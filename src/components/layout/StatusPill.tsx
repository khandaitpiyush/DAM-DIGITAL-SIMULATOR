import React from 'react';

export type StatusVariant = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'DEMO' | 'SIMULATION' | 'LIVE' | 'LOW' | 'MODERATE' | 'HIGH';

interface StatusPillProps {
  status: StatusVariant | string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const norm = status.toUpperCase();

  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (norm === 'NORMAL' || norm === 'SAFE' || norm === 'LOW' || norm === 'READY') {
    colorClasses = 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400';
  } else if (norm === 'WARNING' || norm === 'MODERATE' || norm === 'ALERT' || norm === 'DELAYED') {
    colorClasses = 'bg-amber-950/60 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400';
  } else if (norm === 'CRITICAL' || norm === 'HIGH' || norm === 'FAILED' || norm === 'OFFLINE') {
    colorClasses = 'bg-rose-950/70 text-rose-400 border-rose-500/40';
    dotColor = 'bg-rose-400';
  } else if (norm === 'DEMO' || norm === 'SIMULATION' || norm === 'SYNTHETIC') {
    colorClasses = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30';
    dotColor = 'bg-cyan-400';
  } else if (norm === 'LIVE') {
    colorClasses = 'bg-sky-950/70 text-sky-400 border-sky-500/40';
    dotColor = 'bg-sky-400 animate-pulse';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider',
    md: 'text-xs px-2.5 py-1 tracking-wide',
    lg: 'text-sm px-3.5 py-1.5 font-medium tracking-wide',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase font-semibold border rounded-sm ${sizeClasses} ${colorClasses} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      )}
      {status}
    </span>
  );
};
