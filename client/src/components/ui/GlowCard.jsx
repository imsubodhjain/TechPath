import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function GlowCard({ children, className, ...props }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/5 hover:border-indigo-300 dark:hover:border-indigo-700',
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
