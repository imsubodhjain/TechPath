import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Compass,
  Search,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  Clock,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { getRoadmaps, getPopularRoadmaps } from '../services/roadmapService';
import { ROADMAP_CATEGORIES } from '../utils/constants';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { DifficultyBadge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

const difficulties = [
  { value: '', label: 'All levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

function getIconComponent(iconName) {
  if (!iconName) return LucideIcons.BookOpen;
  const pascalCase = iconName
    .split(/[-_\s]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
  return LucideIcons[pascalCase] || LucideIcons.BookOpen;
}

function RecommendedCard({ roadmap, index }) {
  const { title, slug, description, icon, difficulty, estimatedHours } = roadmap;
  const IconComponent = getIconComponent(icon);

  const accents = [
    { from: 'from-indigo-500', to: 'to-violet-500', icon: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10' },
    { from: 'from-violet-500', to: 'to-fuchsia-500', icon: 'text-violet-400', border: 'border-violet-500/30', bg: 'bg-violet-500/10' },
    { from: 'from-cyan-500', to: 'to-indigo-500', icon: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' },
  ];
  const accent = accents[index % accents.length];

  return (
    <Link to={`/roadmaps/${slug}`} className="group block">
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'relative rounded-2xl border p-5 overflow-hidden',
          'bg-slate-900 dark:bg-slate-900',
          accent.border,
          'hover:shadow-lg transition-all duration-300'
        )}
      >
        {/* Subtle gradient glow */}
        <div className={cn('absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-20', accent.bg)} />

        <div className="relative z-10">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', accent.bg)}>
            <IconComponent className={cn('w-5 h-5', accent.icon)} />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {difficulty && <DifficultyBadge difficulty={difficulty} />}
              {estimatedHours && (
                <span className="text-[11px] text-slate-500 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {estimatedHours}h
                </span>
              )}
            </div>
            <ArrowRight className={cn('w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200', accent.icon)} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function RoadmapsPage() {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  const { data: popularData } = useQuery({
    queryKey: ['popularRoadmaps'],
    queryFn: getPopularRoadmaps,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['roadmaps', category, difficulty],
    queryFn: () =>
      getRoadmaps({
        ...(category && { category }),
        ...(difficulty && { difficulty }),
      }),
  });

  const recommended = (popularData?.data || popularData || []).slice(0, 3);

  const roadmaps = useMemo(() => {
    const all = data?.data || data || [];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (r) =>
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [data, search]);

  const activeCategory = ROADMAP_CATEGORIES.find((c) => c.value === category);

  return (
    <>
      <Helmet>
        <title>Tech Career Roadmaps - TechPath</title>
        <meta
          name="description"
          content="Browse structured tech career roadmaps for frontend, backend, DevOps, data science, AI/ML, and more."
        />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative pt-16 pb-14 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-indigo-500/8 dark:bg-indigo-500/8 blur-[110px] rounded-full" />
          <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-violet-500/6 dark:bg-violet-500/6 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              50+ structured learning paths
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4">
              Find your perfect{' '}
              <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 bg-clip-text text-transparent">
                learning path
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
              Expert-curated roadmaps to take you from beginner to job-ready
              in any tech domain — at your own pace.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roadmaps, topics, skills…"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 text-sm transition-all shadow-sm"
            />
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-500"
          >
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              9 categories
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              All skill levels
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              Free forever
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── Recommended for you ────────────────────────────── */}
      {recommended.length > 0 && !search && (
        <section className="px-6 mb-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wide">
                  Recommended for you
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommended.map((roadmap, i) => (
                  <RecommendedCard
                    key={roadmap._id || roadmap.slug}
                    roadmap={roadmap}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Sticky filter bar ──────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-slate-950/95 backdrop-blur-md border-y border-slate-200 dark:border-slate-800/70 px-6 py-2.5">
        <div
          className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mr-1" />

          {/* Category chips */}
          <button
            onClick={() => setCategory('')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
              !category
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
            )}
          >
            All paths
          </button>
          {ROADMAP_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                category === cat.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              {cat.label}
            </button>
          ))}

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 shrink-0 mx-1" />

          {/* Difficulty chips */}
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                difficulty === d.value
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────── */}
      <section className="px-6 py-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Count / active filters */}
          <div className="flex items-center gap-2 mb-6">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              {isLoading ? (
                'Loading roadmaps…'
              ) : (
                <>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {roadmaps.length}
                  </span>{' '}
                  roadmap{roadmaps.length !== 1 ? 's' : ''}
                  {activeCategory && (
                    <>
                      {' '}in{' '}
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {activeCategory.label}
                      </span>
                    </>
                  )}
                  {search && (
                    <>
                      {' '}matching{' '}
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        "{search}"
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-slate-500 dark:text-slate-400">
                Something went wrong. Please try again later.
              </p>
            </div>
          ) : roadmaps.length === 0 ? (
            <div className="text-center py-20">
              <Compass className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">
                No roadmaps found
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-600">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {roadmaps.map((roadmap, i) => (
                <motion.div
                  key={roadmap._id || roadmap.slug}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                >
                  <RoadmapCard roadmap={roadmap} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
