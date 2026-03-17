import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { User, Bookmark, TrendingUp, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getBookmarks, getProgress } from '../services/authService';
import RoadmapCard from '../components/roadmap/RoadmapCard';
import ToolCard from '../components/tools/ToolCard';
import { CardSkeleton, Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

const tabs = [
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookmarks');

  const { data: bookmarksData, isLoading: bookmarksLoading } = useQuery({
    queryKey: ['bookmarks'],
    queryFn: getBookmarks,
    enabled: activeTab === 'bookmarks',
  });

  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: getProgress,
    enabled: activeTab === 'progress',
  });

  const bookmarks = bookmarksData?.data || bookmarksData || {};
  const progress = progressData?.data || progressData || [];

  return (
    <>
      <Helmet>
        <title>Profile - TechPath</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {user?.name || 'User'}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/50 mb-8 w-fit"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Bookmarks Tab */}
        {activeTab === 'bookmarks' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {bookmarksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                {/* Bookmarked Roadmaps */}
                {bookmarks.roadmaps?.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Saved Roadmaps
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookmarks.roadmaps.map((roadmap) => (
                        <RoadmapCard key={roadmap._id || roadmap.slug} roadmap={roadmap} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Bookmarked Tools */}
                {bookmarks.tools?.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Saved Tools
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookmarks.tools.map((tool) => (
                        <ToolCard key={tool._id || tool.slug} tool={tool} />
                      ))}
                    </div>
                  </div>
                )}

                {!bookmarks.roadmaps?.length && !bookmarks.tools?.length && (
                  <div className="text-center py-16">
                    <Bookmark className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">
                      You haven't bookmarked anything yet.
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                      Explore roadmaps and tools to save your favorites.
                    </p>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {progressLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : progress.length === 0 ? (
              <div className="text-center py-16">
                <TrendingUp className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">
                  No progress tracked yet.
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Start a roadmap and mark topics as complete to see your progress here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {progress.map((item) => {
                  const roadmap = item.roadmap || {};
                  const name = roadmap.title || roadmap.name || 'Roadmap';
                  const totalTopics = roadmap.sections?.reduce(
                    (sum, s) => sum + (s.topics?.length || 0),
                    0
                  ) || item.totalTopics || 0;
                  const completed = item.completedTopics?.length || 0;
                  const percent =
                    totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;

                  return (
                    <div
                      key={item._id || roadmap._id}
                      className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900 dark:text-white">
                          {name}
                        </h3>
                        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                        {completed} of {totalTopics} topics completed
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
