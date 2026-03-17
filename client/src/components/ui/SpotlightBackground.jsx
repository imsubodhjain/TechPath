import { cn } from '../../utils/cn';

export function SpotlightBackground({ children, className }) {
  return (
    <div className={cn('relative overflow-hidden bg-slate-950', className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[600px] rounded-full bg-violet-500/10 blur-[100px]" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
