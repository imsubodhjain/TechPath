import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  ArrowLeft,
  Play,
  FileText,
  BookOpen,
  GraduationCap,
  Code,
  ExternalLink,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { getRoadmapBySlug } from '../services/roadmapService';
import { updateProgress, getProgress } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { DifficultyBadge, Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { cn } from '../utils/cn';

const resourceIcons = {
  video: Play,
  article: FileText,
  docs: BookOpen,
  documentation: BookOpen,
  course: GraduationCap,
  tutorial: Code,
};

function ResourceLink({ resource }) {
  const IconComponent = resourceIcons[resource.type] || ExternalLink;
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors group"
    >
      <IconComponent className="w-4 h-4 text-indigo-500 shrink-0" />
      <span className="truncate flex-1">{resource.title || resource.url}</span>
      <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </a>
  );
}

function TopicCard({ topic, isCompleted, onToggle, isLoggedIn }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        {isLoggedIn && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="shrink-0"
            aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            )}
          </button>
        )}
        <span
          className={cn(
            'flex-1 text-sm font-medium',
            isCompleted
              ? 'text-slate-400 dark:text-slate-500 line-through'
              : 'text-slate-800 dark:text-slate-200'
          )}
        >
          {topic.title}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {topic.estimatedMinutes && (
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {topic.estimatedMinutes}m
            </span>
          )}
          {topic.difficulty && <DifficultyBadge difficulty={topic.difficulty} />}
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-100 dark:border-slate-800">
              {topic.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {topic.description}
                </p>
              )}
              {topic.resources?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                    Resources
                  </h4>
                  <div className="space-y-1.5">
                    {topic.resources.map((resource, idx) => (
                      <ResourceLink key={idx} resource={resource} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RoadmapDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: roadmapData, isLoading, error } = useQuery({
    queryKey: ['roadmap', slug],
    queryFn: () => getRoadmapBySlug(slug),
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress'],
    queryFn: getProgress,
    enabled: !!user,
  });

  const roadmap = roadmapData?.data || roadmapData;
  const allProgress = progressData?.data || progressData || [];

  // Find user's progress for this roadmap
  const roadmapProgress = allProgress.find?.(
    (p) => p.roadmap === roadmap?._id || p.roadmap?._id === roadmap?._id
  );
  const completedTopics = roadmapProgress?.completedTopics || [];

  const mutation = useMutation({
    mutationFn: ({ roadmapId, topics }) => updateProgress(roadmapId, topics),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['progress'] }),
  });

  const toggleTopic = useCallback(
    (topicId) => {
      if (!roadmap?._id) return;
      const updated = completedTopics.includes(topicId)
        ? completedTopics.filter((id) => id !== topicId)
        : [...completedTopics, topicId];
      mutation.mutate({ roadmapId: roadmap._id, topics: updated });
    },
    [roadmap, completedTopics, mutation]
  );

  // Count total topics for progress
  const totalTopics = roadmap?.sections?.reduce(
    (sum, section) => sum + (section.topics?.length || 0),
    0
  ) || 0;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="space-y-4 mt-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Roadmap not found or failed to load.
        </p>
        <Link
          to="/roadmaps"
          className="mt-4 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Roadmaps
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{roadmap.title} - TechPath</title>
        <meta name="description" content={roadmap.description} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          to="/roadmaps"
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          All Roadmaps
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {roadmap.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-5">
            {roadmap.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {roadmap.difficulty && <DifficultyBadge difficulty={roadmap.difficulty} />}
            {roadmap.estimatedHours && (
              <Badge>
                <Clock className="w-3.5 h-3.5 mr-1" />
                {roadmap.estimatedHours} hours
              </Badge>
            )}
            {roadmap.tags?.map((tag) => (
              <Badge key={tag} variant="primary">{tag}</Badge>
            ))}
          </div>
        </motion.div>

        {/* Progress bar (logged-in users) */}
        {user && totalTopics > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mb-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Progress
              </span>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {completedTopics.length}/{totalTopics} topics ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Timeline Sections */}
        <div className="space-y-8">
          {roadmap.sections?.map((section, sectionIdx) => (
            <motion.div
              key={section._id || sectionIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * sectionIdx }}
              className="relative"
            >
              {/* Timeline connector */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
                    {section.order || sectionIdx + 1}
                  </div>
                  {sectionIdx < (roadmap.sections?.length || 0) - 1 && (
                    <div className="w-0.5 flex-1 min-h-[2rem] bg-slate-200 dark:bg-slate-800 mt-2" />
                  )}
                </div>

                <div className="flex-1 pb-4">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {section.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    {section.topics?.map((topic) => (
                      <TopicCard
                        key={topic._id || topic.title}
                        topic={topic}
                        isCompleted={completedTopics.includes(topic._id)}
                        onToggle={() => toggleTopic(topic._id)}
                        isLoggedIn={!!user}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
