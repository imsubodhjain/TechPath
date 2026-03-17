import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Check,
} from 'lucide-react';
import { getToolBySlug } from '../services/toolService';
import { toggleBookmarkTool, getBookmarks } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Badge, PricingBadge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import ToolCard from '../components/tools/ToolCard';

export default function ToolDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: toolData, isLoading, error } = useQuery({
    queryKey: ['tool', slug],
    queryFn: () => getToolBySlug(slug),
  });

  const { data: bookmarksData } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
    enabled: !!user,
  });

  const tool = toolData?.data || toolData;
  const bookmarks = bookmarksData?.data || bookmarksData || {};
  const isBookmarked = bookmarks?.tools?.some?.(
    (t) => t._id === tool?._id || t.slug === tool?.slug
  );

  const bookmarkMutation = useMutation({
    mutationFn: () => toggleBookmarkTool(tool._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] }),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-40 w-full mt-4" />
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Tool not found or failed to load.
        </p>
        <Link
          to="/tools"
          className="mt-4 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tools
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{tool.name} - TechPath</title>
        <meta name="description" content={tool.description} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          to="/tools"
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All Tools
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">
                {tool.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {tool.category && (
                  <Badge variant="primary">
                    {tool.category.replace(/-/g, ' ')}
                  </Badge>
                )}
                {tool.pricing && <PricingBadge pricing={tool.pricing} />}
              </div>
            </div>

            {user && (
              <button
                onClick={() => bookmarkMutation.mutate()}
                disabled={bookmarkMutation.isPending}
                className="shrink-0 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Bookmark className="w-5 h-5 text-slate-400" />
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="prose prose-slate dark:prose-invert max-w-none mb-8"
        >
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {tool.description}
          </p>
        </motion.div>

        {/* Features */}
        {tool.features?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Features
            </h2>
            <ul className="space-y-2">
              {tool.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-slate-600 dark:text-slate-400"
                >
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Website link */}
        {tool.website && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-12"
          >
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/20"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        )}

        {/* Tags */}
        {tool.tags?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Alternatives */}
        {tool.alternatives?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              Alternatives
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tool.alternatives.map((alt) => (
                <ToolCard key={alt._id || alt.slug} tool={alt} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
