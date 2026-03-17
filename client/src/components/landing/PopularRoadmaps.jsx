import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPopularRoadmaps } from '../../services/roadmapService';
import RoadmapCard from '../roadmap/RoadmapCard';
import { CardSkeleton } from '../ui/Skeleton';

export default function PopularRoadmaps() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['popularRoadmaps'],
    queryFn: getPopularRoadmaps,
  });

  const roadmaps = data?.data || data || [];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Popular Learning Paths
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              The most popular roadmaps chosen by our community
            </p>
          </div>
          <Link
            to="/roadmaps"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View All Roadmaps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              Failed to load roadmaps. Please try again later.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {roadmaps.slice(0, 6).map((roadmap) => (
              <RoadmapCard key={roadmap._id || roadmap.slug} roadmap={roadmap} />
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            View All Roadmaps
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
