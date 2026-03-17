import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Wrench } from 'lucide-react';
import { getTools, getToolCategories } from '../services/toolService';
import { PRICING_OPTIONS } from '../utils/constants';
import ToolCard from '../components/tools/ToolCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

export default function ToolsPage() {
  const [category, setCategory] = useState('');
  const [pricing, setPricing] = useState('');

  const { data: categoriesData } = useQuery({
    queryKey: ['toolCategories'],
    queryFn: getToolCategories,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['tools', category, pricing],
    queryFn: () =>
      getTools({
        ...(category && { category }),
        ...(pricing && { pricing }),
      }),
  });

  const tools = data?.data || data || [];
  const categories = categoriesData?.data || categoriesData || [];

  return (
    <>
      <Helmet>
        <title>AI Tools Directory - TechPath</title>
        <meta name="description" content="Explore curated AI tools for coding, design, writing, productivity, and more." />
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
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              AI Tools Directory
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Discover the best AI tools to boost your productivity
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 space-y-4"
        >
          {/* Category tabs */}
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
            {categories.map((cat) => {
              const catValue = typeof cat === 'string' ? cat : cat.value || cat;
              const catLabel =
                typeof cat === 'string'
                  ? cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
                  : cat.label || cat;
              return (
                <button
                  key={catValue}
                  onClick={() => setCategory(catValue)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                    category === catValue
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  )}
                >
                  {catLabel}
                </button>
              );
            })}
          </div>

          {/* Pricing pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-1">
              Pricing:
            </span>
            <button
              onClick={() => setPricing('')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                !pricing
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              All
            </button>
            {PRICING_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setPricing(option.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                  pricing === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                )}
              >
                {option.label}
              </button>
            ))}
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
        ) : tools.length === 0 ? (
          <div className="text-center py-20">
            <Wrench className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">
              No tools found matching your filters.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {tools.map((tool) => (
              <ToolCard key={tool._id || tool.slug} tool={tool} />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
