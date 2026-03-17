import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SpotlightBackground } from '../ui/SpotlightBackground';

export default function HeroSection() {
  return (
    <SpotlightBackground className="min-h-[85vh] flex items-center">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Your tech career starts here
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
        >
          <span className="text-white">Navigate Your </span>
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Tech Career
          </span>
          <br />
          <span className="text-white">with Confidence</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed"
        >
          Discover structured roadmaps to master any tech domain, explore curated AI tools,
          and track your learning progress — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
          >
            Explore Roadmaps
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-white transition-colors"
          >
            Discover AI Tools
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-sm text-slate-500"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">50+</span>
            <span>Roadmaps</span>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">200+</span>
            <span>AI Tools</span>
          </div>
          <div className="w-px h-10 bg-slate-700" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-white">Free</span>
            <span>Forever</span>
          </div>
        </motion.div>
      </div>
    </SpotlightBackground>
  );
}
