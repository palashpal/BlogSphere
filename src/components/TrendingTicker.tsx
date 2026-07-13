import { useEffect, useState } from 'react';
import { Post } from '../types';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface TrendingTickerProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export default function TrendingTicker({ posts, onSelectPost }: TrendingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts]);

  if (posts.length === 0) return null;

  const activePost = posts[currentIndex];

  return (
    <div id="breaking-news-ticker" className="bg-zinc-100 border-b border-zinc-200 text-xs py-2.5 overflow-hidden text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate">
          {/* Badge */}
          <span className="bg-rose-600 text-white font-black px-2.5 py-1 rounded-none text-[9px] uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 animate-pulse" />
            <span>Trending</span>
          </span>
          
          {/* Animated Post Title */}
          <div 
            id={`ticker-item-${activePost.slug}`}
            onClick={() => onSelectPost(activePost)}
            className="text-zinc-800 hover:text-rose-600 font-sans font-semibold transition-all duration-300 cursor-pointer truncate flex items-center space-x-2"
          >
            <span className="text-[9px] bg-zinc-200/50 border border-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-none shrink-0 font-mono font-bold">
              {activePost.categorySlug.toUpperCase()}
            </span>
            <span className="hover:underline">{activePost.title}</span>
          </div>
        </div>

        {/* View Details link */}
        <button
          onClick={() => onSelectPost(activePost)}
          className="text-zinc-500 hover:text-zinc-950 shrink-0 font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1 ml-4 transition-all cursor-pointer"
        >
          <span>Read Story</span>
          <ArrowRight className="w-3 h-3 text-rose-500" />
        </button>
      </div>
    </div>
  );
}
