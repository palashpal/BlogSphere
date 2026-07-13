import React, { useState } from 'react';
import { Comment, User } from '../types';
import { Trash2, MessageSquare, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CommentSectionProps {
  comments: Comment[];
  currentUser: User | null;
  onAddComment: (content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onOpenAuth: () => void;
}

export default function CommentSection({
  comments,
  currentUser,
  onAddComment,
  onDeleteComment,
  onOpenAuth
}: CommentSectionProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      onAddComment(content.trim());
      setContent('');
      setSubmitting(false);
    }, 400);
  };

  return (
    <div id="blog-comment-section" className="border-t border-zinc-200 pt-10 space-y-8 text-left font-sans">
      <div className="flex items-center space-x-2 border-b border-zinc-200 pb-4">
        <MessageSquare className="w-5 h-5 text-zinc-500" />
        <h2 className="font-serif font-light text-2xl text-zinc-900 tracking-tight">
          Discussions ({comments.length})
        </h2>
      </div>

      {/* Write Comment Box */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-none object-cover shrink-0 border border-zinc-200"
          />
          <div className="flex-grow space-y-3">
            <textarea
              required
              rows={3}
              placeholder="Join the discussion... Share your thoughts and questions on this article."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white text-sm text-zinc-900 placeholder-zinc-400 p-4 rounded-none border border-zinc-200 focus:outline-none focus:border-rose-600 transition-all leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !content.trim()}
                className="px-5 py-2.5 rounded-none bg-zinc-900 text-white hover:bg-rose-600 disabled:opacity-50 font-bold text-xs tracking-widest uppercase transition-all flex items-center space-x-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Posting...</span>
                ) : (
                  <>
                    <span>Post Comment</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-none text-center space-y-3">
          <p className="text-sm text-zinc-600">You must be signed in to post a comment or like this post.</p>
          <button
            onClick={onOpenAuth}
            className="px-5 py-2.5 rounded-none text-xs font-bold uppercase tracking-widest bg-zinc-900 text-white hover:bg-rose-600 transition-all cursor-pointer"
          >
            Sign In with Email
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-6 font-light">
            No comments yet. Start the conversation by sharing your thoughts above!
          </p>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => {
              const isOwner = currentUser && currentUser.email === comment.userEmail;
              const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  id={`comment-${comment.id}`}
                  className="p-5 bg-white border border-zinc-200 rounded-none flex gap-4 transition-all duration-300 hover:border-zinc-300 shadow-sm"
                >
                  <img
                    src={comment.userAvatar || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80`}
                    alt={comment.userName}
                    className="w-9 h-9 rounded-none object-cover shrink-0 border border-zinc-200"
                  />
                  <div className="flex-grow space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-zinc-900">{comment.userName}</span>
                        {comment.userEmail === 'palash.pal9732@gmail.com' && (
                          <span className="bg-rose-500/10 text-rose-600 border border-rose-500/20 px-1.5 py-0.2 rounded-none text-[8px] uppercase font-bold tracking-wider">
                            User
                          </span>
                        )}
                        <span className="text-[9px] font-mono text-zinc-400">{dateStr}</span>
                      </div>
                      
                      {isOwner && (
                        <button
                          onClick={() => onDeleteComment(comment.id)}
                          className="text-zinc-400 hover:text-red-600 p-1 rounded-none hover:bg-zinc-100 transition-all cursor-pointer"
                          title="Delete Comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-zinc-700 text-xs leading-relaxed whitespace-pre-wrap font-light">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
