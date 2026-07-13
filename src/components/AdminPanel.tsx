import React, { useState, useEffect } from 'react';
import { Post, Author, AdminStats, CATEGORIES, CategorySlug } from '../types';
import { BarChart2, Plus, FileText, Trash2, Edit3, Check, Globe, Eye, Heart, PlusCircle, AlertCircle, FilePlus2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPanelProps {
  posts: Post[];
  authors: Author[];
  onAddPost: (postData: any) => Promise<Post | null>;
  onUpdatePost: (slug: string, updates: any) => Promise<Post | null>;
  onDeletePost: (slug: string) => Promise<boolean>;
}

export default function AdminPanel({
  posts,
  authors,
  onAddPost,
  onUpdatePost,
  onDeletePost
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'create' | 'list'>('analytics');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Form states for creating a new article
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    featuredImage: '',
    categorySlug: 'news' as CategorySlug,
    authorId: 'auth-5',
    published: true,
    tagsString: 'Future, AI, Tech',
    seoTitle: '',
    seoDescription: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Editing state
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [posts]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');
    setFormSubmitting(true);

    const tags = formData.tagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const postData = {
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      featuredImage: formData.featuredImage || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=675&fit=crop&q=80',
      categorySlug: formData.categorySlug,
      authorId: formData.authorId,
      published: formData.published,
      tags: tags,
      seoTitle: formData.seoTitle || formData.title,
      seoDescription: formData.seoDescription || formData.summary
    };

    try {
      if (editingSlug) {
        const result = await onUpdatePost(editingSlug, postData);
        if (result) {
          setFormSuccess('Article updated successfully!');
          setEditingSlug(null);
          // Reset form
          setFormData({
            title: '',
            summary: '',
            content: '',
            featuredImage: '',
            categorySlug: 'news',
            authorId: 'auth-5',
            published: true,
            tagsString: 'Future, AI, Tech',
            seoTitle: '',
            seoDescription: ''
          });
          setActiveTab('list');
        } else {
          setFormError('Failed to update article.');
        }
      } else {
        const result = await onAddPost(postData);
        if (result) {
          setFormSuccess('Article created and published successfully!');
          // Reset form
          setFormData({
            title: '',
            summary: '',
            content: '',
            featuredImage: '',
            categorySlug: 'news',
            authorId: 'auth-5',
            published: true,
            tagsString: 'Future, AI, Tech',
            seoTitle: '',
            seoDescription: ''
          });
          setActiveTab('list');
        } else {
          setFormError('Failed to create article. Title may be a duplicate.');
        }
      }
    } catch {
      setFormError('Error communicating with server.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const startEdit = (post: Post) => {
    setEditingSlug(post.slug);
    setFormData({
      title: post.title,
      summary: post.summary,
      content: post.content,
      featuredImage: post.featuredImage,
      categorySlug: post.categorySlug as CategorySlug,
      authorId: post.authorId,
      published: post.published,
      tagsString: post.tags.join(', '),
      seoTitle: post.seoTitle || post.title,
      seoDescription: post.seoDescription || post.summary
    });
    setActiveTab('create');
  };

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this article permanently? This action cannot be undone.')) {
      const success = await onDeletePost(slug);
      if (success) {
        alert('Article deleted successfully.');
        fetchStats();
      } else {
        alert('Failed to delete article.');
      }
    }
  };

  const togglePublishStatus = async (post: Post) => {
    const success = await onUpdatePost(post.slug, { published: !post.published });
    if (success) {
      fetchStats();
    }
  };

  // SVG Chart Computations
  const getViewsByDateChartData = () => {
    if (!stats) return [];
    const dates = Object.keys(stats.analytics.viewsByDate).sort();
    const views = dates.map(d => stats.analytics.viewsByDate[d]);
    const maxVal = Math.max(...views, 100);
    return { dates, views, maxVal };
  };

  const getViewsByCategoryChartData = () => {
    if (!stats) return [];
    const categoriesList = Object.keys(stats.analytics.viewsByCategory);
    const views = categoriesList.map(c => stats.analytics.viewsByCategory[c]);
    const maxVal = Math.max(...views, 100);
    return { categoriesList, views, maxVal };
  };

  const dateChart = getViewsByDateChartData();
  const categoryChart = getViewsByCategoryChartData();

  return (
    <div id="admin-panel-module" className="min-h-screen bg-zinc-50 text-zinc-900 pt-24 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-200 pb-6 mb-8 text-left">
          <div>
            <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-widest mb-1.5">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Publisher Studio</span>
            </div>
            <h1 className="font-sans font-black text-3xl sm:text-4xl text-zinc-900 tracking-tight">
              Admin Control Center
            </h1>
          </div>

          {/* Navigation sub-tabs */}
          <div className="flex space-x-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 mt-4 md:mt-0">
            <button
              onClick={() => { setActiveTab('analytics'); setEditingSlug(null); }}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                activeTab === 'analytics' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('create');
                if (!editingSlug) {
                  // Reset form
                  setFormData({
                    title: '',
                    summary: '',
                    content: '',
                    featuredImage: '',
                    categorySlug: 'news',
                    authorId: 'auth-5',
                    published: true,
                    tagsString: 'Future, AI, Tech',
                    seoTitle: '',
                    seoDescription: ''
                  });
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                activeTab === 'create' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingSlug ? 'Edit Post' : 'New Post'}</span>
            </button>
            <button
              onClick={() => { setActiveTab('list'); setEditingSlug(null); }}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                activeTab === 'list' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Articles</span>
            </button>
          </div>
        </div>

        {/* Tab content 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 text-left">
            {loadingStats ? (
              <div className="text-center py-20 text-zinc-400 font-mono text-xs">Loading analytic data...</div>
            ) : stats ? (
              <>
                {/* Numeric Grid Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">Total Views</span>
                    <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1 font-mono">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">Published Posts</span>
                    <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1 font-mono">{stats.publishedPosts} <span className="text-xs text-zinc-400">/ {stats.totalPosts}</span></p>
                  </div>
                  <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">Comments</span>
                    <p className="text-2xl sm:text-3xl font-black text-zinc-900 mt-1 font-mono">{stats.totalComments}</p>
                  </div>
                  <div className="bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest font-mono">Newsletter Subs</span>
                    <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1 font-mono">{stats.subscribersCount}</p>
                  </div>
                </div>

                {/* SVG Visual Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                  
                  {/* Views History Line graph */}
                  <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <h3 className="font-sans font-bold text-sm uppercase tracking-widest text-zinc-800">Views Traffic (Last 7 Days)</h3>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Daily Page Impressions</span>
                    </div>

                    {/* Pure SVG Line graph */}
                    <div className="relative h-64 w-full pt-4">
                      {dateChart && 'dates' in dateChart && dateChart.dates && dateChart.dates.length > 0 ? (
                        <svg viewBox="0 0 500 200" className="w-full h-full">
                          {/* Grid lines */}
                          <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

                           {/* Line mapping */}
                          <polyline
                            fill="none"
                            stroke="#e11d48"
                            strokeWidth="3"
                            points={dateChart.dates.map((d, idx) => {
                              const x = 40 + (idx * (440 / (dateChart.dates.length - 1)));
                              const val = dateChart.views[idx];
                              const y = 170 - ((val / dateChart.maxVal) * 130);
                              return `${x},${y}`;
                            }).join(' ')}
                          />

                          {/* Data points */}
                          {dateChart.dates.map((d, idx) => {
                            const x = 40 + (idx * (440 / (dateChart.dates.length - 1)));
                            const val = dateChart.views[idx];
                            const y = 170 - ((val / dateChart.maxVal) * 130);
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#e11d48" strokeWidth="2.5" />
                                <text x={x} y={y - 10} fill="#18181b" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">
                                  {val}
                                </text>
                                <text x={x} y="188" fill="rgba(0,0,0,0.4)" fontSize="8" textAnchor="middle" className="font-mono">
                                  {d.substring(5)}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      ) : (
                        <p className="text-xs text-zinc-400 text-center py-20 font-mono">No trend data available.</p>
                      )}
                    </div>
                  </div>

                  {/* Views By Category Bar chart */}
                  <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <h3 className="font-sans font-bold text-sm uppercase tracking-widest text-zinc-800">Popularity By Category</h3>
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">Accumulated Views</span>
                    </div>

                    {/* Pure SVG Bar chart */}
                    <div className="relative h-64 w-full pt-4">
                      {categoryChart && 'categoriesList' in categoryChart && categoryChart.categoriesList && categoryChart.categoriesList.length > 0 ? (
                        <svg viewBox="0 0 500 200" className="w-full h-full">
                          {/* Grid lines */}
                          <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="40" y1="90" x2="480" y2="90" stroke="rgba(0,0,0,0.05)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="40" y1="160" x2="480" y2="160" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />

                          {categoryChart.categoriesList.map((cat, idx) => {
                            const count = categoryChart.views[idx];
                            const barWidth = 32;
                            const spacing = (440 / categoryChart.categoriesList.length);
                            const x = 50 + (idx * spacing);
                            const barHeight = (count / categoryChart.maxVal) * 120;
                            const y = 160 - barHeight;

                            const colors = ["#e11d48", "#f59e0b", "#be123c", "#d97706", "#fda4af"];
                            const color = colors[idx % colors.length];

                            return (
                              <g key={cat}>
                                {/* Bar - sharp corners */}
                                <rect
                                  x={x - (barWidth / 2)}
                                  y={y}
                                  width={barWidth}
                                  height={barHeight}
                                  fill={color}
                                  rx="4"
                                />
                                {/* Value overlay */}
                                <text x={x} y={y - 8} fill="#18181b" fontSize="9" fontWeight="bold" textAnchor="middle" className="font-mono">
                                  {count}
                                </text>
                                {/* X Axis label */}
                                <text x={x} y="178" fill="rgba(0,0,0,0.5)" fontSize="9" textAnchor="middle" className="capitalize font-mono">
                                  {cat}
                                </text>
                              </g>
                            );
                          })}
                        </svg>
                      ) : (
                        <p className="text-xs text-zinc-400 text-center py-20 font-mono">No category statistics available.</p>
                      )}
                    </div>
                  </div>

                </div>
              </>
            ) : (
              <p className="text-sm text-zinc-400 font-mono">Failed to compile admin metrics.</p>
            )}
          </div>
        )}

        {/* Tab content 2: Create / Edit Article */}
        {activeTab === 'create' && (
          <div className="bg-white border border-zinc-200 p-6 sm:p-8 text-left max-w-4xl mx-auto rounded-2xl shadow-sm">
            <div className="flex items-center space-x-2.5 mb-6 border-b border-zinc-200 pb-4">
              <FilePlus2 className="w-6 h-6 text-rose-500" />
              <div>
                <h2 className="text-xl font-sans font-black text-zinc-900 tracking-tight">
                  {editingSlug ? 'Modify Article Parameters' : 'Assemble a New Masterpiece'}
                </h2>
                <p className="text-xs text-zinc-500 font-mono">Inputs instantly save to local state for high-fidelity rendering.</p>
              </div>
            </div>

            {formSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-mono flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* Grid 1: Title & slug */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter post title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Category</label>
                  <select
                    value={formData.categorySlug}
                    onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value as CategorySlug })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all capitalize cursor-pointer"
                  >
                    {Object.keys(CATEGORIES).map((key) => (
                      <option key={key} value={key}>
                        {CATEGORIES[key as CategorySlug].name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary description */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Short Summary</label>
                <textarea
                  required
                  rows={2}
                  maxLength={250}
                  placeholder="Enter a brief punchy excerpt for social previews and listing cards..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>

              {/* Rich text Editor mockup */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Body Content (Markdown Supported)</label>
                  <span className="text-[9px] text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-200 font-mono">100% Secure Editor</span>
                </div>
                <textarea
                  required
                  rows={8}
                  placeholder="Draft your story. Use standard headings (e.g. ### Subheading) and paragraphs..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-zinc-50 text-sm font-mono text-zinc-900 placeholder-zinc-400 p-4 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all leading-relaxed"
                />
              </div>

              {/* Featured image URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Featured Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Sports, Champions, Tactics"
                    value={formData.tagsString}
                    onChange={(e) => setFormData({ ...formData, tagsString: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-400 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Author Assignation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-zinc-200">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Assign Author Profile</label>
                  <select
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all cursor-pointer"
                  >
                    {authors.map(auth => (
                      <option key={auth.id} value={auth.id}>
                        {auth.name} ({auth.role})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 flex flex-col justify-end pb-3">
                  <label className="flex items-center space-x-3 cursor-pointer text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4.5 h-4.5 rounded border-zinc-300 text-rose-600 bg-zinc-50 focus:ring-0 cursor-pointer"
                    />
                    <span className="font-bold text-xs uppercase tracking-wider font-mono">Immediately Publish Article (Public)</span>
                  </label>
                </div>
              </div>

              {/* SEO Sub-panel */}
              <div className="bg-zinc-50 p-5 rounded-xl border border-zinc-200 space-y-4 text-left">
                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 border-b border-zinc-200/60 pb-2">
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <span>Search Engine Optimization (SEO) Metadata Parameters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase font-bold text-zinc-400">SEO Custom Meta Title</label>
                    <input
                      type="text"
                      placeholder="Optional Google search heading..."
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full bg-white text-xs text-zinc-900 p-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase font-bold text-zinc-400">SEO Custom Description</label>
                    <input
                      type="text"
                      placeholder="Google search results paragraph preview..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full bg-white text-xs text-zinc-900 p-3 rounded-lg border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3 border-t border-zinc-200 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('list');
                    setEditingSlug(null);
                  }}
                  className="px-6 py-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-8 py-3 rounded-xl bg-zinc-900 text-white hover:bg-rose-600 hover:text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-600/5 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  {formSubmitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{editingSlug ? 'Update Article' : 'Launch Post'}</span>
                      <PlusCircle className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Tab content 3: Articles list */}
        {activeTab === 'list' && (
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden text-left shadow-sm">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-black text-xl text-zinc-900 tracking-tight">Created Content Repository</h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">Edit, toggle publication, or perform deletions on files.</p>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-50 border border-zinc-200 px-3 py-1 rounded-lg text-zinc-600">
                {posts.length} articles on record
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-600 border-collapse font-sans">
                <thead className="bg-zinc-50 text-[10px] text-zinc-500 uppercase font-bold tracking-widest border-b border-zinc-200">
                  <tr>
                    <th className="p-4 pl-6">Article Description</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Likes</th>
                    <th className="p-4 pr-6 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-50/50 transition-all">
                      <td className="p-4 pl-6">
                        <div className="flex items-center space-x-3.5">
                          <img src={post.featuredImage} alt={post.title} className="w-12 h-8 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200" />
                          <div>
                            <p className="font-bold text-sm text-zinc-900 line-clamp-1 hover:text-rose-600 transition-colors cursor-pointer" onClick={() => startEdit(post)}>{post.title}</p>
                            <p className="text-xs font-mono text-zinc-400 line-clamp-1">Slug: {post.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize font-mono text-xs text-zinc-700">
                        {post.categorySlug}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => togglePublishStatus(post)}
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase border cursor-pointer transition-all ${
                            post.published
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : 'bg-zinc-100 border-zinc-200 text-zinc-600'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="p-4 text-xs font-mono text-zinc-600 pt-6">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{post.views}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-zinc-600">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          <span>{post.likesCount}</span>
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => startEdit(post)}
                            className="p-2 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 rounded-lg border border-zinc-200 shadow-sm transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="p-2 bg-white hover:bg-red-50 text-zinc-400 hover:text-red-600 rounded-lg border border-zinc-200 hover:border-red-200 shadow-sm transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
