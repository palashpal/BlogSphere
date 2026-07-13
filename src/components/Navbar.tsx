import { useState, useEffect } from 'react';
import { Search, Menu, X, Bell, User, BookOpen, Settings, LogOut, Heart, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType, Notification } from '../types';
import Logo from './Logo';

interface NavbarProps {
  currentUser: UserType | null;
  onNavigate: (view: string, extra?: any) => void;
  currentView: string;
  onOpenAuth: () => void;
  onLogout: () => void;
  notifications: Notification[];
  onMarkNotificationsRead: () => void;
  readingProgress: number; // Percentage from 0 to 100 for blog post reading progress
  activeCategorySlug?: string | null;
}

export default function Navbar({
  currentUser,
  onNavigate,
  currentView,
  onOpenAuth,
  onLogout,
  notifications,
  onMarkNotificationsRead,
  readingProgress,
  activeCategorySlug
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Cricket', view: 'category', extra: 'cricket', icon: '🏏' },
    { label: 'Football', view: 'category', extra: 'football', icon: '⚽' },
    { label: 'Travel', view: 'category', extra: 'travel', icon: '✈️' },
    { label: 'Food', view: 'category', extra: 'food', icon: '🍔' },
    { label: 'News', view: 'category', extra: 'news', icon: '📰' },
    { label: 'Technology', view: 'category', extra: 'technology', icon: '💻' },
  ];

  const handleNavItemClick = (view: string, extra?: any) => {
    onNavigate(view, extra);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200 py-3 shadow-md'
          : 'bg-zinc-50/90 backdrop-blur-md py-5 border-b border-zinc-200/60'
      }`}
    >
      {/* Reading Progress Indicator */}
      {readingProgress > 0 && (
        <div 
          id="reading-progress-bar"
          className="absolute bottom-0 left-0 h-[3px] bg-rose-600 transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            id="brand-logo"
            className="flex items-center cursor-pointer"
            onClick={() => handleNavItemClick('home')}
          >
            <Logo variant="full" size="md" showTagline={false} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <button
              id="nav-home"
              onClick={() => handleNavItemClick('home')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                currentView === 'home'
                  ? 'text-zinc-900 border-b-2 border-rose-600'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              Home
            </button>
            {navItems.map((item) => (
              <button
                key={item.label}
                id={`nav-${item.label.toLowerCase()}`}
                onClick={() => handleNavItemClick(item.view, item.extra)}
                className={`flex items-center space-x-1 px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  currentView === 'category' && activeCategorySlug === item.extra
                    ? 'text-zinc-900 border-b-2 border-rose-600'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <span className="text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Controls & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Button */}
            <button
              id="search-trigger-btn"
              onClick={() => handleNavItemClick('search')}
              className={`p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-rose-600 hover:text-white transition-all cursor-pointer ${
                currentView === 'search' ? 'bg-rose-600 text-white' : ''
              }`}
              aria-label="Search posts"
            >
              <Search className="w-4 h-4" />
            </button>

            {currentUser ? (
              <>
                {/* Notifications Bell */}
                <div id="notifications-wrapper" className="relative">
                  <button
                    id="notifications-bell-btn"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfileMenu(false);
                      if (!showNotifications) {
                        onMarkNotificationsRead();
                      }
                    }}
                    className="p-2.5 bg-zinc-100 border border-zinc-200 text-zinc-700 hover:bg-rose-600 hover:text-white transition-all relative cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        id="notifications-dropdown"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white border border-zinc-200 rounded-none shadow-2xl p-4 overflow-hidden z-50 text-left"
                      >
                        <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2">
                          <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900">Notifications</h4>
                          <span className="text-[10px] text-zinc-500">{notifications.length} received</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-zinc-400 text-center py-4">No notifications yet.</p>
                          ) : (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                className={`p-2.5 rounded-none text-xs transition-all ${
                                  notif.read ? 'bg-transparent text-zinc-500' : 'bg-zinc-50 text-zinc-900 border-l-2 border-rose-600'
                                }`}
                              >
                                <p className="font-bold mb-0.5">{notif.title}</p>
                                <p className="text-zinc-600 leading-relaxed mb-1">{notif.message}</p>
                                <span className="text-[10px] text-zinc-400 block">
                                  {new Date(notif.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Controls */}
                <div id="profile-controls-wrapper" className="relative">
                  <button
                    id="profile-avatar-btn"
                    onClick={() => {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-none border border-zinc-200 object-cover ring-1 ring-zinc-200/50 hover:border-rose-600 transition-all"
                    />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div
                        id="profile-dropdown-menu"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white border border-zinc-200 rounded-none shadow-2xl overflow-hidden z-50 text-left"
                      >
                        <div className="p-4 border-b border-zinc-200 bg-zinc-50">
                          <p className="font-bold text-sm text-zinc-900 truncate">{currentUser.name}</p>
                          <p className="text-xs text-zinc-500 truncate">{currentUser.email}</p>
                        </div>
                        <div className="p-1.5 space-y-0.5">
                          <button
                            id="menu-btn-profile"
                            onClick={() => {
                              handleNavItemClick('profile');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-none transition-all cursor-pointer"
                          >
                            <User className="w-3.5 h-3.5" />
                            <span>My Profile</span>
                          </button>
                          <button
                            id="menu-btn-saved"
                            onClick={() => {
                              handleNavItemClick('profile', { defaultTab: 'saved' });
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 rounded-none transition-all cursor-pointer"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Saved Articles</span>
                          </button>
                          <button
                            id="menu-btn-admin"
                            onClick={() => {
                              handleNavItemClick('admin');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-none transition-all cursor-pointer"
                          >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Admin Panel</span>
                          </button>
                          <div className="h-[1px] bg-zinc-100 my-1" />
                          <button
                            id="menu-btn-logout"
                            onClick={() => {
                              onLogout();
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-700 hover:bg-red-50 rounded-none transition-all cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                id="login-trigger-btn"
                onClick={onOpenAuth}
                className="px-5 py-2.5 bg-zinc-900 text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-rose-600 hover:text-white transition-all cursor-pointer rounded-none shadow-sm active:scale-95"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              id="mobile-drawer-trigger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all md:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-50 border-b border-zinc-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 text-left">
              <button
                id="mob-nav-home"
                onClick={() => handleNavItemClick('home')}
                className="w-full block px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 transition-all"
              >
                Home
              </button>
              <div className="border-t border-zinc-200 my-2" />
              {navItems.map((item) => (
                <button
                  key={item.label}
                  id={`mob-nav-${item.label.toLowerCase()}`}
                  onClick={() => handleNavItemClick(item.view, item.extra)}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 transition-all"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              {currentUser && (
                <>
                  <div className="border-t border-zinc-200 my-2" />
                  <button
                    id="mob-nav-profile"
                    onClick={() => handleNavItemClick('profile')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 transition-all"
                  >
                    <User className="w-4 h-4 text-zinc-500" />
                    <span>My Profile</span>
                  </button>
                  <button
                    id="mob-nav-admin"
                    onClick={() => handleNavItemClick('admin')}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-zinc-200/50 transition-all"
                  >
                    <Settings className="w-4 h-4 text-rose-600" />
                    <span>Admin Panel</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
