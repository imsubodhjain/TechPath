import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { DifficultyBadge } from '../ui/Badge';
import { cn } from '../../utils/cn';

function getIconComponent(iconName) {
  if (!iconName) return LucideIcons.BookOpen;
  const pascalCase = iconName
    .split(/[-_\s]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  return LucideIcons[pascalCase] || LucideIcons.BookOpen;
}

export default function RoadmapCard({ roadmap }) {
  const { title, slug, description, icon, category, difficulty, estimatedHours, tags } = roadmap;
  const IconComponent = getIconComponent(icon);

  return (
    <Link to={`/roadmaps/${slug}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'h-full flex flex-col rounded-2xl p-5',
          'bg-white dark:bg-slate-900',
          'border border-slate-200 dark:border-slate-800',
          'hover:border-indigo-300 dark:hover:border-indigo-500/40',
          'hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/5',
          'transition-all duration-300'
        )}
      >
        {/* Top row: icon + category */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          {category && (
            <span className="text-[11px] font-medium capitalize px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-700/60">
              {category.replace(/-/g, ' ')}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
          {description}
        </p>

        {/* Skills / tags */}
        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-[11px] rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-700/50"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[11px] text-slate-400 dark:text-slate-600 self-center">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer: difficulty + time + CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
          <div className="flex items-center gap-2">
            {difficulty && <DifficultyBadge difficulty={difficulty} />}
            {estimatedHours && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {estimatedHours}h
              </span>
            )}
          </div>
          <span className="text-[12px] font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 flex items-center gap-1 transition-colors duration-200">
            Start learning
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
