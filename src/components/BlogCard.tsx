import { Post, Author, CATEGORIES, CategorySlug } from '../types';
import { Clock, Eye, Heart, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogCardProps {
  key?: string | number;
  post: Post;
  author?: Author;
  onClick: () => void;
  layout?: 'grid' | 'featured' | 'list';
}

export default function BlogCard({ post, author, onClick, layout = 'grid' }: BlogCardProps) {
  const category = CATEGORIES[post.categorySlug as CategorySlug] || CATEGORIES.news;
  const publishDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  if (layout === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onClick={onClick}
        id={`post-card-featured-${post.slug}`}
        className="relative min-h-[500px] lg:min-h-[600px] rounded-none overflow-hidden group cursor-pointer shadow-md flex flex-col justify-end p-6 sm:p-10 lg:p-12 text-left bg-white border border-zinc-200"
      >
        {/* Widescreen Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-700 ease-out opacity-25 group-hover:opacity-30"
          />
        </div>

        {/* Ambient Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/60 to-transparent z-10" />

        {/* Content Container */}
        <div className="relative z-20 max-w-3xl space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="px-3 py-1 bg-rose-600 text-[10px] font-black uppercase tracking-tighter text-white">
              {category.name}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest border border-zinc-200 bg-white px-2.5 py-1">
              Spotlight Story
            </span>
          </div>

          <h1 className="font-serif font-light text-4xl sm:text-6xl lg:text-7xl leading-[0.95] text-zinc-900 tracking-tight group-hover:text-rose-600 transition-colors">
            {post.title}
          </h1>

          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-xl font-light line-clamp-2">
            {post.summary}
          </p>

          <div className="border-t border-zinc-200 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
            {/* Author info */}
            {author && (
              <div className="flex items-center space-x-3 bg-zinc-50 p-1.5 pr-4 rounded-none border border-zinc-200">
                <img src={author.avatar} alt={author.name} className="w-8 h-8 rounded-none border border-zinc-200 object-cover" />
                <div>
                  <p className="font-bold text-zinc-800 text-xs">{author.name}</p>
                  <p className="text-[9px] uppercase tracking-wider text-zinc-400">{author.role}</p>
                </div>
              </div>
            )}

            {/* Metrics */}
            <div className="flex items-center space-x-4 text-[11px] text-zinc-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime} min read</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{post.views} views</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/25" />
                <span>{post.likesCount} likes</span>
              </span>
              <span className="border-l border-zinc-200 pl-4">{publishDate}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        onClick={onClick}
        id={`post-card-list-${post.slug}`}
        className="flex flex-col sm:flex-row gap-6 p-4 bg-white hover:bg-zinc-50/50 border border-zinc-200 hover:border-zinc-300 rounded-none cursor-pointer group transition-all duration-300 text-left shadow-sm hover:shadow-md"
      >
        <div className="w-full sm:w-44 md:w-52 h-40 sm:h-auto rounded-none overflow-hidden shrink-0 relative bg-zinc-100 border border-zinc-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-500 ease-out"
          />
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 bg-rose-600 text-[9px] font-black uppercase tracking-tighter text-white">
              {category.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between py-1 flex-grow space-y-3">
          <div className="space-y-1">
            <h3 className="font-sans font-medium text-lg leading-snug text-zinc-900 group-hover:text-rose-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-light">
              {post.summary}
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-100">
            <div className="flex items-center space-x-2">
              {author && (
                <span className="font-bold text-zinc-700">{author.name}</span>
              )}
              <span>•</span>
              <span>{publishDate}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{post.readingTime}m</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard Grid Layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      id={`post-card-grid-${post.slug}`}
      className="flex flex-col h-full bg-white hover:bg-zinc-50/50 border border-zinc-200 hover:border-zinc-300 rounded-none overflow-hidden cursor-pointer group transition-all duration-300 text-left shadow-sm hover:shadow-md"
    >
      {/* Visual Header image */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 shrink-0 border-b border-zinc-200">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-all duration-500 ease-out"
        />
        {/* Category sticker */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 bg-rose-600 text-[9px] font-black uppercase tracking-tighter text-white shadow-md">
            {category.name}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 font-mono text-[10px] text-zinc-500">
            <span>{publishDate}</span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.readingTime} min read</span>
            </span>
          </div>
          <h3 className="font-sans font-medium text-base leading-snug text-zinc-900 group-hover:text-rose-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed font-light">
            {post.summary}
          </p>
        </div>

        {/* Card Footer info */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[11px] font-mono text-zinc-500">
          {author ? (
            <div className="flex items-center space-x-2">
              <img src={author.avatar} alt={author.name} className="w-5 h-5 rounded-none border border-zinc-200 object-cover" />
              <span className="font-bold text-zinc-700 hover:text-rose-600 transition-colors">{author.name}</span>
            </div>
          ) : (
            <span className="text-zinc-400">BlogSphere</span>
          )}

          <div className="flex items-center space-x-2.5">
            <span className="flex items-center space-x-0.5">
              <Eye className="w-3 h-3 text-zinc-400" />
              <span>{post.views}</span>
            </span>
            <span className="flex items-center space-x-0.5">
              <Heart className="w-3 h-3 text-rose-500" />
              <span>{post.likesCount}</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-rose-600 transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
