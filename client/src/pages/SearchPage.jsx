import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, Compass, Wrench } from 'lucide-react';
import { searchAll } from '../services/authService';
import { useDebounce } from '../hooks/useDebounce';
import { Skeleton } from '../components/ui/Skeleton';
import { DifficultyBadge } from '../components/ui/Badge';
import { PricingBadge } from '../components/ui/Badge';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });

  const results = data?.data || data || {};
  const roadmaps = results.roadmaps || [];
  const tools = results.tools || [];
  const hasResults = roadmaps.length > 0 || tools.length > 0;
  const searched = debouncedQuery.length >= 2;

  return (
    <>
      <Helmet>
        <title>Search - TechPath</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Search TechPath
          </h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roadmaps, tools, topics..."
              autoFocus
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            />
            {isFetching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Results */}
        {isLoading && searched && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )}

        {searched && !isLoading && !hasResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              No results found for "{debouncedQuery}"
            </p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Try different keywords or browse our categories
            </p>
          </motion.div>
        )}

        {roadmaps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Roadmaps
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                ({roadmaps.length})
              </span>
            </div>
            <div className="space-y-2">
              {roadmaps.map((roadmap) => (
                <Link
                  key={roadmap._id || roadmap.slug}
                  to={`/roadmaps/${roadmap.slug}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {roadmap.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {roadmap.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {roadmap.difficulty && (
                      <DifficultyBadge difficulty={roadmap.difficulty} />
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {tools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Tools
              </h2>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                ({tools.length})
              </span>
            </div>
            <div className="space-y-2">
              {tools.map((tool) => (
                <Link
                  key={tool._id || tool.slug}
                  to={`/tools/${tool.slug}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {tool.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {tool.pricing && <PricingBadge pricing={tool.pricing} />}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Prompt when no search */}
        {!searched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <p className="text-slate-400 dark:text-slate-500">
              Type at least 2 characters to start searching
            </p>
          </motion.div>
        )}
      </div>
    </>
  );
}
