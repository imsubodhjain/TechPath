import { cn } from '../../utils/cn';
import { PRICING_OPTIONS, DIFFICULTY_COLORS } from '../../utils/constants';

export function Badge({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    primary: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

export function PricingBadge({ pricing }) {
  const option = PRICING_OPTIONS.find((p) => p.value === pricing);
  if (!option) return null;
  return <Badge className={option.color}>{option.label}</Badge>;
}

export function DifficultyBadge({ difficulty }) {
  return (
    <Badge className={DIFFICULTY_COLORS[difficulty]}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
}
