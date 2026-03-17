import { Link } from 'react-router-dom';
import { GlowCard } from '../ui/GlowCard';
import { Badge, PricingBadge } from '../ui/Badge';

export default function ToolCard({ tool }) {
  const { name, slug, description, category, pricing, tags } = tool;

  return (
    <Link to={`/tools/${slug}`} className="block h-full">
      <GlowCard className="h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {name}
          </h3>
          {category && (
            <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {category.replace(/-/g, ' ')}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        <div className="flex items-center gap-2 flex-wrap mb-3">
          {category && (
            <Badge variant="primary">
              {category.replace(/-/g, ' ')}
            </Badge>
          )}
          {pricing && <PricingBadge pricing={pricing} />}
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
