import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { GlowCard } from '../ui/GlowCard';
import { Badge, DifficultyBadge } from '../ui/Badge';

function getIconComponent(iconName) {
  if (!iconName) return LucideIcons.BookOpen;
  // Convert kebab-case or lowercase to PascalCase
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
    <Link to={`/roadmaps/${slug}`} className="block h-full">
      <GlowCard className="h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 dark:from-indigo-500/20 dark:to-cyan-500/20 flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
              {title}
            </h3>
            {category && (
              <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                {category.replace(/-/g, ' ')}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          {difficulty && <DifficultyBadge difficulty={difficulty} />}
          {estimatedHours && (
            <Badge>
              <Clock className="w-3 h-3 mr-1" />
              {estimatedHours}h
            </Badge>
          )}
        </div>

        {tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span className="text-xs text-slate-400 dark:text-slate-500 self-center">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}
      </GlowCard>
    </Link>
  );
}
