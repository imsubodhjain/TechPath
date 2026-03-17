import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Compass } from 'lucide-react';
import { getRoadmaps } from '../services/roadmapService';
import { ROADMAP_CATEGORIES } from '../utils/constants';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

const difficulties = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function RoadmapsPage() {
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['roadmaps', category, difficulty],
    queryFn: () =>
      getRoadmaps({
        ...(category && { category }),
        ...(difficulty && { difficulty }),
      }),
  });

  const roadmaps = data?.data || data || [];

  return (
    <>
      <Helmet>
        <title>Tech Career Roadmaps - TechPath</title>
        <meta name="description" content="Browse structured tech career roadmaps for frontend, backend, DevOps, data science, AI/ML, and more." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Tech Career Roadmaps
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Choose a path and start your learning journey today
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 space-y-4"
        >
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('')}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                !category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              All
            </button>
            {ROADMAP_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  category === cat.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Difficulty:
            </span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <Compass className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              No roadmaps found matching your filters.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap._id || roadmap.slug} roadmap={roadmap} />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
