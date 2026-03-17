import { motion } from 'framer-motion';
import { Map, Wrench, TrendingUp } from 'lucide-react';
import { GlowCard } from '../ui/GlowCard';

const features = [
  {
    icon: Map,
    title: 'Structured Roadmaps',
    description:
      'Follow step-by-step learning paths curated by industry experts. From frontend to AI/ML, find the perfect roadmap for your career goals.',
  },
  {
    icon: Wrench,
    title: 'AI Tools Directory',
    description:
      'Explore a curated collection of AI-powered tools for coding, design, writing, and more. Find the right tool for every task.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description:
      'Mark topics as complete, track your learning journey, and see how far you\'ve come. Stay motivated with visible progress.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function FeatureHighlights() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
              level up
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Whether you're just starting out or switching careers, TechPath has the resources to guide your journey.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <GlowCard className="h-full text-center">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mb-5">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
