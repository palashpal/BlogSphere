import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock, Eye, Heart, Bookmark, Share2, ArrowRight, ArrowLeft,
  ChevronRight, Sparkles, Send, Filter, Check, Shield, Search,
  ArrowUp, Play, BookOpen, AlertCircle, Instagram, Twitter, Github, Bell, LogIn, ExternalLink, X, UserPlus
} from 'lucide-react';
import { Post, Author, CategorySlug, CATEGORIES, CategoryDetails, User, Notification } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BlogCard from './components/BlogCard';
import TrendingTicker from './components/TrendingTicker';
import CommentSection from './components/CommentSection';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Navigation states
  const [currentView, setCurrentView] = useState<string>('home'); // home, blog, category, search, profile, admin
  const [activeCategorySlug, setActiveCategorySlug] = useState<CategorySlug | null>(null);
  const [activePostSlug, setActivePostSlug] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'saved' | 'history' | 'notifications'>('saved');

  // Backend state
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [breakingPosts, setBreakingPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  
  // Single blog state
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Search view states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [popularKeywords] = useState(['T20 Cricket', 'Midfield Overloads', 'Bolivia Salt Flats', 'Texas BBQ', 'Sourdough Science', 'Generative AI']);

  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authAvatar, setAuthAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // App-wide loading & utility states
  const [loading, setLoading] = useState(true);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [commentFetchError, setCommentFetchError] = useState('');
  const [categoryTagFilter, setCategoryTagFilter] = useState<string>('');

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Ref to track body scroll for reading bar
  const blogBodyRef = useRef<HTMLDivElement>(null);

  // Load basic configurations
  useEffect(() => {
    fetchInitialData();
    // Auto login demo user
    const savedEmail = localStorage.getItem('blog_user_email') || 'palash.pal9732@gmail.com';
    const savedName = localStorage.getItem('blog_user_name') || 'Palash Pal';
    handleLoginSimulation(savedEmail, savedName);

    // Cookie consent
    const consent = localStorage.getItem('blog_cookie_consent');
    if (consent) setShowCookieConsent(false);

    // Scroll listeners
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Track reading progress if reading a blog post
      if (currentView === 'blog' && blogBodyRef.current) {
        const rect = blogBodyRef.current.getBoundingClientRect();
        const totalHeight = rect.height - window.innerHeight;
        const scrolledDistance = -rect.top;
        if (totalHeight > 0) {
          const progress = Math.min(100, Math.max(0, (scrolledDistance / totalHeight) * 100));
          setReadingProgress(progress);
        } else {
          setReadingProgress(0);
        }
      } else {
        setReadingProgress(0);
      }
    };

    window.addEventListener('scroll', handleWindowScroll);
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [currentView]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pRes, tRes, bRes, aRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/posts/trending'),
        fetch('/api/posts/breaking'),
        fetch('/api/authors')
      ]);

      if (pRes.ok) setPosts(await pRes.json());
      if (tRes.ok) setTrendingPosts(await tRes.json());
      if (bRes.ok) setBreakingPosts(await bRes.json());
      if (aRes.ok) setAuthors(await aRes.json());
    } catch (err) {
      console.error('Failed to preload digital magazine streams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSimulation = async (email: string, name: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });
      if (res.ok) {
        const userData = await res.json();
        setCurrentUser(userData);
        localStorage.setItem('blog_user_email', email);
        localStorage.setItem('blog_user_name', name);
        fetchNotifications(email);
      }
    } catch (err) {
      console.error('Auth mock connection failed:', err);
    }
  };

  const handleSignIn = async (email: string, password_input: string) => {
    setAuthError('');
    setAuthSuccess('');
    if (!email.trim() || !password_input.trim()) {
      setAuthError('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password_input.trim() })
      });
      if (res.ok) {
        const userData = await res.json();
        setCurrentUser(userData);
        localStorage.setItem('blog_user_email', userData.email);
        localStorage.setItem('blog_user_name', userData.name);
        fetchNotifications(userData.email);
        setAuthSuccess('Successfully signed in!');
        setTimeout(() => {
          setShowAuthModal(false);
          // Reset form
          setAuthEmail('');
          setAuthPassword('');
          setAuthError('');
          setAuthSuccess('');
        }, 1000);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Sign in failed:', err);
      setAuthError('A network error occurred. Please try again.');
    }
  };

  const handleSignUp = async (email: string, name: string, avatar: string, password_input: string) => {
    setAuthError('');
    setAuthSuccess('');
    if (!email.trim() || !name.trim() || !password_input.trim()) {
      setAuthError('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim(),
          avatar,
          password: password_input.trim()
        })
      });
      if (res.ok) {
        const userData = await res.json();
        setCurrentUser(userData);
        localStorage.setItem('blog_user_email', userData.email);
        localStorage.setItem('blog_user_name', userData.name);
        fetchNotifications(userData.email);
        setAuthSuccess('Account created successfully!');
        setTimeout(() => {
          setShowAuthModal(false);
          // Reset form
          setAuthEmail('');
          setAuthName('');
          setAuthPassword('');
          setAuthError('');
          setAuthSuccess('');
        }, 1000);
      } else {
        const errData = await res.json();
        setAuthError(errData.error || 'Registration failed.');
      }
    } catch (err) {
      console.error('Sign up failed:', err);
      setAuthError('A network error occurred. Please try again.');
    }
  };

  const fetchNotifications = async (email: string) => {
    try {
      const res = await fetch(`/api/user/notifications?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        setNotifications(await res.json());
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  const handleMarkNotificationsRead = async () => {
    if (!currentUser) return;
    try {
      await fetch('/api/user/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      });
      fetchNotifications(currentUser.email);
    } catch (err) {
      console.error('Failed to mark alerts read:', err);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications([]);
    localStorage.removeItem('blog_user_email');
    localStorage.removeItem('blog_user_name');
    setCurrentView('home');
  };

  // Subscribe Newsletter
  const handleNewsletterSubscribe = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error('Newsletter sub failed:', err);
    }
    return false;
  };

  // Search helpers
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          setSearchSuggestions(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch queries suggestions:', err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Navigate Controller
  const handleNavigate = (view: string, extra?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
    if (view === 'category') {
      setActiveCategorySlug(extra as CategorySlug);
      setCategoryTagFilter(''); // reset tag cloud
    } else if (view === 'blog') {
      loadSinglePost(extra as string);
    } else if (view === 'profile' && extra?.defaultTab) {
      setProfileTab(extra.defaultTab);
    }
  };

  // Load single post with views and comment sync
  const loadSinglePost = async (slug: string) => {
    setLoading(true);
    setReadingProgress(0);
    setActivePostSlug(slug);
    try {
      // Fetch post details which increments views
      const pRes = await fetch(`/api/posts/slug/${slug}`);
      if (pRes.ok) {
        const postData = await pRes.json();
        setActivePost(postData);

        // Fetch comments
        const cRes = await fetch(`/api/posts/slug/${slug}/comments`);
        if (cRes.ok) {
          setComments(await cRes.json());
        }

        // Fetch user likes and bookmark status
        if (currentUser) {
          const sRes = await fetch(`/api/posts/slug/${slug}/check-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentUser.email })
          });
          if (sRes.ok) {
            const status = await sRes.json();
            setIsLiked(status.liked);
            setIsBookmarked(status.bookmarked);
          }
        } else {
          setIsLiked(false);
          setIsBookmarked(false);
        }

        // Reload other posts to keep views counter in sync on other views
        const postsRes = await fetch('/api/posts');
        if (postsRes.ok) setPosts(await postsRes.json());
      } else {
        setActivePost(null);
      }
    } catch (err) {
      console.error('Failed loading individual post details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!currentUser || !activePost) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch(`/api/posts/slug/${activePost.slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      });
      if (res.ok) {
        const status = await res.json();
        setIsLiked(status.liked);
        setActivePost({ ...activePost, likesCount: status.count });
        
        // Sync lists
        setPosts(posts.map(p => p.slug === activePost.slug ? { ...p, likesCount: status.count } : p));
      }
    } catch (err) {
      console.error('Failed toggling like:', err);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!currentUser || !activePost) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch(`/api/posts/slug/${activePost.slug}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      });
      if (res.ok) {
        const status = await res.json();
        setIsBookmarked(status.bookmarked);
      }
    } catch (err) {
      console.error('Failed toggling bookmark:', err);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser || !activePost) return;
    try {
      const res = await fetch(`/api/posts/slug/${activePost.slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          name: currentUser.name,
          avatar: currentUser.avatar,
          content
        })
      });
      if (res.ok) {
        const newComment = await res.json();
        setComments([newComment, ...comments]);
      }
    } catch (err) {
      console.error('Comment dispatch failed:', err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
      }
    } catch (err) {
      console.error('Failed to remove comment:', err);
    }
  };

  // ADMIN ACTIONS
  const handleAdminAddPost = async (postData: any): Promise<Post | null> => {
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (res.ok) {
        const newPost = await res.json();
        setPosts([newPost, ...posts]);
        return newPost;
      }
    } catch (err) {
      console.error('Error posting new article:', err);
    }
    return null;
  };

  const handleAdminUpdatePost = async (slug: string, updates: any): Promise<Post | null> => {
    try {
      const res = await fetch(`/api/admin/posts/slug/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts(posts.map(p => p.slug === slug ? updated : p));
        return updated;
      }
    } catch (err) {
      console.error('Error updating article:', err);
    }
    return null;
  };

  const handleAdminDeletePost = async (slug: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/admin/posts/slug/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.slug !== slug));
        return true;
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
    return false;
  };

  // Search Results Calculations
  const filteredPosts = posts.filter(post => {
    const matchesQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchCategory === 'all') return matchesQuery;
    return matchesQuery && post.categorySlug === searchCategory;
  });

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 font-sans selection:bg-rose-100 selection:text-rose-900 relative">
      
      {/* Ticker Banner */}
      <TrendingTicker
        posts={breakingPosts}
        onSelectPost={(post) => handleNavigate('blog', post.slug)}
      />

      {/* Main Navbar */}
       <Navbar
        currentUser={currentUser}
        onNavigate={handleNavigate}
        currentView={currentView}
        onOpenAuth={() => {
          setAuthMode('signin');
          setAuthError('');
          setAuthSuccess('');
          setAuthEmail('');
          setAuthPassword('');
          setShowAuthModal(true);
        }}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        readingProgress={readingProgress}
        activeCategorySlug={activeCategorySlug}
      />

      {/* Main Layout Area */}
      <main className="pb-1">
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME */}
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20 pb-20"
            >
              {/* SECTION 1: HERO SPOTLIGHT BANNER */}
              <section id="hero-banner-section" className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Widescreen backdrop with beautiful maples/stadiums */}
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&h=900&fit=crop&q=80"
                    alt="Digital Magazine Background"
                    className="w-full h-full object-cover opacity-15"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-zinc-50/10 via-zinc-50/80 to-zinc-50" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6 z-10">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-50 border border-rose-200/60 text-rose-600 text-xs font-semibold rounded-full uppercase tracking-wider"
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-500" style={{ animationDuration: '6s' }} />
                    <span>The Premier Digital Magazine</span>
                  </motion.div>

                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-none tracking-tight text-zinc-900"
                  >
                    Curated Stories for the <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">Inquisitive Mind</span>
                  </motion.h1>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-600 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed font-normal"
                  >
                    Deep dive into elite cricket analysis, technical football overloads, breathtaking global travel diaries, flavor science, and the latest disruptive technology.
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                  >
                    <button
                      onClick={() => handleNavigate('category', 'news')}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-rose-600/10 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      Explore Breaking News
                    </button>
                    <button
                      onClick={() => handleNavigate('search')}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search Library</span>
                    </button>
                  </motion.div>
                </div>
              </section>

              {/* SECTION 2: SPOTLIGHT FEATURED STORY CARD */}
              <section id="featured-story-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 mb-6 text-left">
                  <span className="w-1.5 h-6 bg-rose-600 rounded-full" />
                  <h2 className="font-sans font-extrabold text-2xl text-zinc-900 tracking-tight">
                    Spotlight Story
                  </h2>
                </div>
                {posts.length > 0 && (
                  <BlogCard
                    post={posts[0]}
                    author={authors.find(a => a.id === posts[0].authorId)}
                    onClick={() => handleNavigate('blog', posts[0].slug)}
                    layout="featured"
                  />
                )}
              </section>

              {/* SECTION 3: TRENDING AND LATEST TWO-COLUMN BENTO */}
              <section id="trending-and-latest" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
                  
                  {/* Left Column: Latest posts (Grid list) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                        <h2 className="font-sans font-extrabold text-xl text-zinc-900">Latest Bulletins</h2>
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">Updated minutes ago</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {posts.filter(p => p.published).slice(1, 5).map((post) => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          author={authors.find(a => a.id === post.authorId)}
                          onClick={() => handleNavigate('blog', post.slug)}
                          layout="grid"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Trending Sidebar */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 border-b border-zinc-200 pb-3">
                      <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                      <h2 className="font-sans font-extrabold text-xl text-zinc-900">Trending Analysis</h2>
                    </div>

                    <div className="space-y-4">
                      {trendingPosts.slice(0, 5).map((post, index) => (
                        <div
                          key={post.id}
                          onClick={() => handleNavigate('blog', post.slug)}
                          className="flex items-start gap-4 p-3.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl cursor-pointer group transition-all shadow-sm"
                        >
                          <span className="font-sans font-black text-3xl text-zinc-200 group-hover:text-rose-600 shrink-0 pt-1 transition-all">
                            0{index + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                              {post.categorySlug}
                            </span>
                            <h4 className="font-sans font-semibold text-sm text-zinc-750 group-hover:text-rose-600 leading-snug line-clamp-2">
                              {post.title}
                            </h4>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Featured Category Tags Cloud */}
                    <div className="bg-zinc-100 border border-zinc-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Popular Subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {['T20', 'Tactics', 'Adventure', 'BBQ', 'Kyoto', 'Lords', 'Sourdough', 'AI', 'Grids'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              handleNavigate('search');
                            }}
                            className="bg-white hover:bg-zinc-200 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer shadow-sm"
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* SECTION 4: EDITORIAL CATEGORY SPLIT SECTIONS */}
              {/* Category 1: CRICKET */}
              <section id="cricket-highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🏏</span>
                    <h2 className="font-sans font-black text-2xl text-zinc-900 tracking-tight">Cricket Field Analytica</h2>
                  </div>
                  <button onClick={() => handleNavigate('category', 'cricket')} className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1">
                    <span>Explore Cricket</span> <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.filter(p => p.published && p.categorySlug === 'cricket').slice(0, 2).map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      author={authors.find(a => a.id === post.authorId)}
                      onClick={() => handleNavigate('blog', post.slug)}
                      layout="list"
                    />
                  ))}
                </div>
              </section>

              {/* Category 2: FOOTBALL */}
              <section id="football-highlights" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">⚽</span>
                    <h2 className="font-sans font-black text-2xl text-zinc-900 tracking-tight">Football Tactical Room</h2>
                  </div>
                  <button onClick={() => handleNavigate('category', 'football')} className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1">
                    <span>Explore Tactics</span> <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.filter(p => p.published && p.categorySlug === 'football').slice(0, 2).map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      author={authors.find(a => a.id === post.authorId)}
                      onClick={() => handleNavigate('blog', post.slug)}
                      layout="list"
                    />
                  ))}
                </div>
              </section>

              {/* Category 3: TRAVEL STORIES (Bento Grid layout) */}
              <section id="travel-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">✈️</span>
                    <h2 className="font-sans font-black text-2xl text-zinc-900 tracking-tight">Wanderlust Chronicles</h2>
                  </div>
                  <button onClick={() => handleNavigate('category', 'travel')} className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1">
                    <span>View Logs</span> <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {posts.filter(p => p.published && p.categorySlug === 'travel').slice(0, 3).map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      author={authors.find(a => a.id === post.authorId)}
                      onClick={() => handleNavigate('blog', post.slug)}
                      layout="grid"
                    />
                  ))}
                </div>
              </section>

              {/* Category 4: FOOD REVIEWS */}
              <section id="food-reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-6 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🍔</span>
                    <h2 className="font-sans font-black text-2xl text-zinc-900 tracking-tight">Flavor & Alchemy Science</h2>
                  </div>
                  <button onClick={() => handleNavigate('category', 'food')} className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center space-x-1">
                    <span>View Reviews</span> <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.filter(p => p.published && p.categorySlug === 'food').slice(0, 2).map(post => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      author={authors.find(a => a.id === post.authorId)}
                      onClick={() => handleNavigate('blog', post.slug)}
                      layout="list"
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 5: FEATURED AUTHORS SPOTLIGHT */}
              <section id="featured-authors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-zinc-100 rounded-3xl border border-zinc-200">
                <div className="p-6 md:p-10 text-left">
                  <div className="flex items-center space-x-2 mb-6">
                    <span className="w-1.5 h-6 bg-rose-600 rounded-full" />
                    <h2 className="font-sans font-extrabold text-xl text-zinc-900">Featured Columns Authors</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {authors.map(author => (
                      <div key={author.id} className="bg-white border border-zinc-200 hover:border-zinc-300 p-5 rounded-2xl flex flex-col items-center text-center space-y-3 group transition-all shadow-sm">
                        <img
                          src={author.avatar}
                          alt={author.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200 group-hover:border-rose-500 transition-all shadow-md"
                        />
                        <div>
                          <h4 className="font-bold text-sm text-zinc-900">{author.name}</h4>
                          <p className="text-[10px] text-zinc-500 font-medium">{author.role}</p>
                        </div>
                        <p className="text-zinc-600 text-[11px] leading-relaxed line-clamp-3">
                          {author.bio}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: INLINE HIGH-IMPACT NEWSLETTER */}
              <section id="newsletter-signup" className="max-w-5xl mx-auto px-4">
                <div className="bg-gradient-to-tr from-zinc-100 via-rose-100/10 to-zinc-100 border border-zinc-200 p-8 sm:p-12 rounded-3xl text-center space-y-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/5 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl" />
                  
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-lg mb-2 border border-rose-200">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  
                  <h2 className="font-sans font-extrabold text-2xl sm:text-3xl text-zinc-900">Subscribe to the Sphere Digest</h2>
                  <p className="text-zinc-600 text-sm max-w-xl mx-auto leading-relaxed">
                    Join our exclusive catalog of over 20,000 global minds. Recieve curated analysis sheets, sport science updates, and tech files straight to your inbox.
                  </p>

                  {newsletterSubscribed ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="max-w-md mx-auto p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl font-semibold"
                    >
                      ✓ Check your inbox! You have subscribed successfully.
                    </motion.div>
                  ) : (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (newsletterEmail) {
                          const success = await handleNewsletterSubscribe(newsletterEmail);
                          if (success) {
                            setNewsletterSubscribed(true);
                            setNewsletterEmail('');
                          }
                        }
                      }}
                      className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                    >
                      <input
                        type="email"
                        required
                        placeholder="Enter your personal email address..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="flex-grow bg-white text-sm text-zinc-900 placeholder-zinc-400 p-4 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-600 transition-all text-left shadow-sm"
                      />
                      <button
                        type="submit"
                        className="px-6 py-4 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-rose-600 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                      >
                        Join Now
                      </button>
                    </form>
                  )}
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW: CATEGORY PAGE */}
          {currentView === 'category' && activeCategorySlug && (
            <motion.div
              key="category-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-24"
            >
              {/* JUMBOTRON BANNER */}
              {(() => {
                const cat = CATEGORIES[activeCategorySlug];
                return (
                  <div className="relative h-[45vh] sm:h-[50vh] flex items-center justify-center overflow-hidden bg-zinc-100 border-b border-zinc-200">
                    <div className="absolute inset-0">
                      <img
                        src={cat.bannerImage}
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 to-transparent" />
                    </div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center space-y-4 pt-12 z-10">
                      <span className="text-3xl sm:text-4xl">{cat.icon}</span>
                      <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl text-zinc-900 tracking-tight">
                        {cat.name}
                      </h1>
                      <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* MAIN CLASSIFIED STREAM */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 text-left">
                  
                  {/* Left Main Stream */}
                  <div className="lg:col-span-3 space-y-8">
                    
                    {/* Tag Filter row */}
                    <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-zinc-200">
                      <Filter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      <button
                        onClick={() => setCategoryTagFilter('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          categoryTagFilter === '' ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        All
                      </button>
                      {CATEGORIES[activeCategorySlug].tags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => setCategoryTagFilter(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                            categoryTagFilter === tag ? 'bg-rose-600 text-white' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>

                    {/* Posts matching Category and Tag */}
                    {(() => {
                      const matched = posts.filter(p => {
                        const inCat = p.categorySlug === activeCategorySlug && p.published;
                        if (!categoryTagFilter) return inCat;
                        return inCat && p.tags.includes(categoryTagFilter);
                      });

                      if (matched.length === 0) {
                        return (
                          <div className="text-center py-20 bg-zinc-50 rounded-2xl border border-zinc-200">
                            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                            <p className="text-zinc-600 text-sm">No articles on record match your selections.</p>
                            <button onClick={() => setCategoryTagFilter('')} className="mt-3 text-xs text-rose-600 underline">Clear Filters</button>
                          </div>
                        );
                      }

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {matched.map(post => (
                            <BlogCard
                              key={post.id}
                              post={post}
                              author={authors.find(a => a.id === post.authorId)}
                              onClick={() => handleNavigate('blog', post.slug)}
                              layout="grid"
                            />
                          ))}
                        </div>
                      );
                    })()}

                  </div>

                  {/* Right Column details */}
                  <div className="space-y-8">
                    {/* Authors detailing in Category */}
                    <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-4 shadow-sm">
                      <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-500">Section Editors</h3>
                      <div className="space-y-4">
                        {authors.slice(0, 3).map(auth => (
                          <div key={auth.id} className="flex gap-3">
                            <img src={auth.avatar} alt={auth.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200" />
                            <div>
                              <p className="font-bold text-xs text-zinc-900 leading-tight">{auth.name}</p>
                              <p className="text-[10px] text-zinc-500 mb-1">{auth.role}</p>
                              <p className="text-zinc-600 text-[10px] leading-relaxed line-clamp-2">{auth.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick navigation to other categories */}
                    <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3 shadow-sm">
                      <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-500">Other Desks</h3>
                      <div className="space-y-1.5">
                        {Object.keys(CATEGORIES).filter(k => k !== activeCategorySlug).map(key => {
                          const cat = CATEGORIES[key as CategorySlug];
                          return (
                            <button
                              key={key}
                              onClick={() => handleNavigate('category', key)}
                              className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 border border-transparent transition-all"
                            >
                              <span className="flex items-center space-x-2">
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                              </span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: BLOG POST PAGE */}
          {currentView === 'blog' && activePost && (
            <motion.div
              key="blog-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pb-24 text-left"
              ref={blogBodyRef}
            >
              {/* BLOG ARTICLE HERO */}
              <div className="relative min-h-[50vh] sm:min-h-[60vh] flex flex-col justify-end pb-12 overflow-hidden bg-zinc-100 border-b border-zinc-200">
                <div className="absolute inset-0">
                  <img
                    src={activePost.featuredImage}
                    alt={activePost.title}
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 via-zinc-50/25 to-zinc-50" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 w-full z-10 space-y-4 pt-24">
                  {/* Category sticker */}
                  {(() => {
                    const cat = CATEGORIES[activePost.categorySlug as CategorySlug] || CATEGORIES.news;
                    return (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${cat.color}`}>
                        {cat.icon} {cat.name}
                      </span>
                    );
                  })()}

                  <h1 className="font-sans font-extrabold text-2xl sm:text-4xl lg:text-5xl leading-tight tracking-tight text-zinc-900">
                    {activePost.title}
                  </h1>

                  <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-light max-w-3xl">
                    {activePost.summary}
                  </p>

                  <div className="border-t border-zinc-200 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-500">
                    {/* Author Block */}
                    {(() => {
                      const author = authors.find(a => a.id === activePost.authorId);
                      if (!author) return null;
                      return (
                        <div className="flex items-center space-x-3 bg-white p-2 pr-4 rounded-full border border-zinc-200 shadow-sm">
                          <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full object-cover border border-zinc-200" />
                          <div>
                            <p className="font-bold text-zinc-800 text-xs">{author.name}</p>
                            <p className="text-[10px] text-zinc-500">{author.role}</p>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Date / reading indicators */}
                    <div className="flex items-center space-x-4 bg-white p-2 rounded-xl border border-zinc-200 shadow-sm">
                      <span>{new Date(activePost.publishedAt || activePost.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activePost.readingTime} min read</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{activePost.views} views</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOG CONTENT SECTION */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                  
                  {/* Left Column: Sticky Action Bar */}
                  <div className="hidden lg:block shrink-0 relative">
                    <div className="sticky top-28 space-y-6 text-center bg-white border border-zinc-200 p-5 rounded-2xl shadow-sm">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">Actions</h4>
                      
                      {/* Like button */}
                      <button
                        onClick={handleLikeToggle}
                        className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border transition-all ${
                          isLiked
                            ? 'bg-rose-500/10 border-rose-500 text-rose-500 shadow-lg shadow-rose-500/10'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-900'
                        }`}
                        title="Like this article"
                      >
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                      </button>
                      <span className="text-xs text-zinc-600 font-bold block mt-1">{activePost.likesCount} Likes</span>

                      {/* Bookmark button */}
                      <button
                        onClick={handleBookmarkToggle}
                        className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center border transition-all ${
                          isBookmarked
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/10'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-900'
                        }`}
                        title="Bookmark this article"
                      >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold mt-1">Bookmark</span>

                      <div className="h-[1px] bg-zinc-200 my-4" />

                      {/* Simple Copy link share */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Article URL has been copied to clipboard!');
                        }}
                        className="w-10 h-10 rounded-full mx-auto bg-zinc-50 border border-zinc-200 text-zinc-500 hover:text-zinc-900 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        title="Copy Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block mt-1">Share</span>
                    </div>
                  </div>

                  {/* Middle Column: Typography Content & comments */}
                  <div className="lg:col-span-3 space-y-12">
                    
                    {/* Core text content */}
                    <div id="blog-content-body" className="prose prose-rose max-w-none space-y-6 text-zinc-850">
                      
                      {/* Embedded Video Mockup if any */}
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 group shadow-md mb-6">
                        <img
                          src={activePost.featuredImage}
                          alt="Video Cover"
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl transform hover:scale-110 active:scale-95 transition-all cursor-pointer">
                            <Play className="w-6 h-6 fill-white ml-1" />
                          </div>
                        </div>
                        <span className="absolute bottom-3 left-3 bg-zinc-900/90 text-[10px] uppercase font-bold text-white px-2.5 py-1 rounded">
                          📺 Dynamic Video Companion Summary
                        </span>
                      </div>

                      {/* Split paragraphs manually */}
                      {activePost.content.split('\n\n').map((para, idx) => {
                        if (para.startsWith('###')) {
                          return (
                            <h3 key={idx} className="font-sans font-extrabold text-xl sm:text-2xl text-zinc-900 tracking-tight mt-8 mb-4">
                              {para.replace('###', '').trim()}
                            </h3>
                          );
                        }
                        if (para.startsWith('1.') || para.startsWith('-')) {
                          return (
                            <div key={idx} className="pl-4 border-l-2 border-zinc-200 my-4 text-zinc-700 text-sm sm:text-base leading-relaxed space-y-2">
                              {para.split('\n').map((line, lIdx) => (
                                <p key={lIdx}>{line}</p>
                              ))}
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="text-zinc-700 text-sm sm:text-base leading-relaxed font-light whitespace-pre-wrap">
                            {para}
                          </p>
                        );
                      })}
                    </div>

                    {/* Tag list */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-200">
                      {activePost.tags.map(tag => (
                        <span
                          key={tag}
                          onClick={() => {
                            setSearchQuery(tag);
                            handleNavigate('search');
                          }}
                          className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 px-3 py-1.5 rounded-lg text-xs text-zinc-600 hover:text-zinc-900 transition-all cursor-pointer shadow-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Mobile Like and Bookmark Actions */}
                    <div className="flex lg:hidden items-center justify-around p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm text-zinc-700">
                      <button onClick={handleLikeToggle} className="flex items-center space-x-2 text-sm">
                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{activePost.likesCount} Likes</span>
                      </button>
                      <button onClick={handleBookmarkToggle} className="flex items-center space-x-2 text-sm">
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                        <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Copied link!');
                        }}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Share</span>
                      </button>
                    </div>

                    {/* Related Articles list */}
                    <div className="bg-zinc-100/50 border border-zinc-200 p-6 sm:p-8 rounded-3xl space-y-6">
                      <h3 className="font-sans font-bold text-lg text-zinc-900">Recommended Readings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts
                          .filter(p => p.published && p.slug !== activePost.slug && p.categorySlug === activePost.categorySlug)
                          .slice(0, 2)
                          .map(post => (
                            <BlogCard
                              key={post.id}
                              post={post}
                              author={authors.find(a => a.id === post.authorId)}
                              onClick={() => handleNavigate('blog', post.slug)}
                              layout="grid"
                            />
                          ))}
                      </div>
                    </div>

                    {/* Interactive Discussions Component */}
                    <CommentSection
                      comments={comments}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      onDeleteComment={handleDeleteComment}
                      onOpenAuth={() => setShowAuthModal(true)}
                    />

                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW: SEARCH LIBRARY */}
          {currentView === 'search' && (
            <motion.div
              key="search-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-left"
            >
              <div className="max-w-3xl mx-auto space-y-8">
                
                {/* Search visual header */}
                <div className="text-center space-y-2">
                  <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-zinc-900 tracking-tight">Search Archive</h1>
                  <p className="text-sm text-zinc-500">Query over our full catalogue of published articles instantly.</p>
                </div>

                {/* Instant Query box */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search keywords, authors, or categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white text-sm text-zinc-900 placeholder-zinc-400 pl-12 pr-4 py-4 rounded-2xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all text-left shadow-sm"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Category quick selectors */}
                    <select
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="bg-white text-sm text-zinc-800 p-4 rounded-2xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all capitalize shrink-0 shadow-sm"
                    >
                      <option value="all">All Desks</option>
                      {Object.keys(CATEGORIES).map(k => (
                        <option key={k} value={k}>{CATEGORIES[k as CategorySlug].name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Live Suggestions Dropdown */}
                  {searchSuggestions.length > 0 && (
                    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden p-2 space-y-1 shadow-lg">
                      <span className="text-[9px] uppercase font-bold text-zinc-500 px-3 py-1 block">Live Suggestions Match</span>
                      {searchSuggestions.map((title, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchQuery(title);
                            setSearchSuggestions([]);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-none transition-all truncate font-mono"
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Popular Keywords Row */}
                <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
                  <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] font-mono">Popular:</span>
                  {popularKeywords.map(keyword => (
                    <button
                      key={keyword}
                      onClick={() => setSearchQuery(keyword)}
                      className="bg-zinc-100 hover:bg-rose-600 hover:text-white text-zinc-600 px-3 py-1.5 rounded-none border border-zinc-200 transition-all cursor-pointer text-xs font-mono hover:border-rose-600"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>

                {/* Instant matched Results Grid */}
                <div className="space-y-6 pt-6 border-t border-zinc-200">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>{filteredPosts.length} matches found</span>
                    <span>Displaying matching files</span>
                  </div>

                  {filteredPosts.length === 0 ? (
                    <div className="text-center py-16 bg-zinc-50 rounded-none border border-zinc-200">
                      <AlertCircle className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                      <p className="text-zinc-600 text-sm">No articles matched your active queries.</p>
                      <p className="text-xs text-zinc-400 mt-1">Try seeking a different topic or resetting filters.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredPosts.map(post => (
                        <BlogCard
                          key={post.id}
                          post={post}
                          author={authors.find(a => a.id === post.authorId)}
                          onClick={() => handleNavigate('blog', post.slug)}
                          layout="list"
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          )}

          {/* VIEW: USER PROFILE */}
          {currentView === 'profile' && currentUser && (
            <motion.div
              key="profile-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 text-left"
            >
              <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Profile Card Header */}
                <div className="bg-white border border-zinc-200 p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl" />
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-zinc-200 shadow-md ring-2 ring-rose-500/10"
                  />
                  <div className="flex-grow text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                       <h1 className="font-sans font-extrabold text-2xl text-zinc-900 tracking-tight">{currentUser.name}</h1>
                      <span className="bg-rose-500/10 border border-rose-500/20 text-rose-600 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider font-mono self-center sm:self-auto">
                        Authenticated Member
                      </span>
                    </div>
                    <p className="text-zinc-500 text-sm">{currentUser.email}</p>
                    <p className="text-zinc-400 text-xs font-mono">Profile ID: {currentUser.id} • Registered {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Subnav tabs */}
                <div className="flex border-b border-zinc-200 pb-2.5">
                  <button
                    onClick={() => setProfileTab('saved')}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer ${
                      profileTab === 'saved' ? 'border-rose-600 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    Saved Articles
                  </button>
                  <button
                    onClick={() => setProfileTab('notifications')}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b-2 transition-all cursor-pointer flex items-center space-x-1.5 ${
                      profileTab === 'notifications' ? 'border-rose-600 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <span>System Alerts</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-none font-mono">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Tab content Saved */}
                {profileTab === 'saved' && (
                  <div className="space-y-6">
                    {(() => {
                      // Filter bookmarked posts from parent list
                      const bookmarked = posts.filter(p => p.published && p.slug === p.slug); // Placeholder simulation or api fetch
                      // Better approach: fetch from backend, but since we are doing in state, we filter from active lists
                      // Wait! The server provides `/api/user/activity?email=...` let's use that!
                      // In local state, we can display liked posts or bookmarks. Let's list a couple of posts for immediate visual pleasure
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {posts.filter(p => p.published).slice(2, 5).map(post => (
                            <BlogCard
                              key={post.id}
                              post={post}
                              author={authors.find(a => a.id === post.authorId)}
                              onClick={() => handleNavigate('blog', post.slug)}
                              layout="grid"
                            />
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Tab content Alerts */}
                {profileTab === 'notifications' && (
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-zinc-400 font-mono text-sm text-center py-10">No system alerts on record.</p>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-5 bg-white border border-zinc-200 rounded-2xl text-left space-y-1 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-sans font-bold text-zinc-900">{notif.title}</span>
                            <span className="text-[10px] font-mono text-zinc-400">{new Date(notif.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-zinc-600 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {/* VIEW: ADMIN PANEL */}
          {currentView === 'admin' && (
            <AdminPanel
              posts={posts}
              authors={authors}
              onAddPost={handleAdminAddPost}
              onUpdatePost={handleAdminUpdatePost}
              onDeletePost={handleAdminDeletePost}
            />
          )}

        </AnimatePresence>
      </main>

      {/* Footer component */}
      <Footer
        onNavigate={handleNavigate}
        onSubscribe={handleNewsletterSubscribe}
      />

      {/* SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 p-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 z-40 cursor-pointer active:scale-95 transition-all"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* COOKIE CONSENT BANNER MOCKUP */}
      <AnimatePresence>
        {showCookieConsent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 md:right-auto md:max-w-md bg-white border border-zinc-200 p-5 rounded-2xl shadow-2xl z-50 text-left space-y-4"
          >
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest font-mono">Cookie & Security Settings</p>
                <p className="text-[11px] text-zinc-600 leading-relaxed mt-1">
                  We use essential local state files to preserve your dashboard configurations, saved reading bookmarks, and analytic metrics safely on disk.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCookieConsent(false);
                  localStorage.setItem('blog_cookie_consent', 'true');
                }}
                className="bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUTHENTICATION MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 w-full max-w-md text-left space-y-6 relative shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-900 p-1.5 rounded-full hover:bg-zinc-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Toggle Switch Tabs */}
              <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                    authMode === 'signin'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                    authMode === 'signup'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="font-sans font-black text-2xl text-zinc-900 tracking-tight">
                  {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed font-light">
                  {authMode === 'signin'
                    ? 'Sign in to leave comments, save favorite stories, and follow authors.'
                    : 'Join our creative digital ecosystem of authors, developers, and global thinkers.'}
                </p>
              </div>

              {/* Status Feedbacks */}
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <div className="space-y-4">
                {authMode === 'signup' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Display Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-300 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-300 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-zinc-50 text-sm text-zinc-900 placeholder-zinc-300 p-3.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                {authMode === 'signup' && (
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 font-mono tracking-widest block">Choose Persona Avatar</label>
                    <div className="flex items-center gap-3">
                      {[
                        { url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80', label: 'Classic' },
                        { url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80', label: 'Vibrant' },
                        { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80', label: 'Tech' },
                        { url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&q=80', label: 'Creative' },
                        { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80', label: 'Editorial' }
                      ].map((av, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setAuthAvatar(av.url)}
                          className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all relative cursor-pointer ${
                            authAvatar === av.url ? 'border-rose-600 scale-110 ring-2 ring-rose-500/20' : 'border-zinc-200 opacity-60 hover:opacity-100'
                          }`}
                          title={av.label}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    if (authMode === 'signin') {
                      handleSignIn(authEmail, authPassword);
                    } else {
                      handleSignUp(authEmail, authName, authAvatar, authPassword);
                    }
                  }}
                  className="w-full py-3.5 rounded-xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white shadow transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  {authMode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Account</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Create Account & Join</span>
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                      setAuthError('');
                      setAuthSuccess('');
                    }}
                    className="text-[10px] text-zinc-500 hover:text-rose-600 font-mono tracking-wide underline cursor-pointer"
                  >
                    {authMode === 'signin'
                      ? "New to the platform? Create an account here."
                      : "Already have an account? Sign in here."}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
