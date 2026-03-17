import { Link } from 'react-router-dom';
import { Compass, Github, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                TechPath
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Helping students navigate their tech career with structured roadmaps and curated AI tools.
            </p>
          </div>

          {/* Roadmaps */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Roadmaps</h3>
            <ul className="space-y-2">
              {['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'AI & ML'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/roadmaps/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}-development`}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">AI Tools</h3>
            <ul className="space-y-2">
              {['Coding', 'Design', 'Writing', 'Productivity', 'Research'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/tools?category=${item.toLowerCase()}`}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/search" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Search</Link></li>
              <li><Link to="/signup" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign Up</Link></li>
              <li><Link to="/login" className="text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Log In</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Built with <Heart className="w-3.5 h-3.5 inline text-red-500" /> for students worldwide
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
