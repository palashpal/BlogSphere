import React, { useState } from 'react';
import { Mail, Send, Instagram, Twitter, Github, Globe, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (view: string, extra?: any) => void;
  onSubscribe: (email: string) => Promise<boolean>;
}

export default function Footer({ onNavigate, onSubscribe }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const instagramPhotos = [
    { url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&h=150&fit=crop&q=80', tag: 'Football' },
    { url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&h=150&fit=crop&q=80', tag: 'Adventure' },
    { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&h=150&fit=crop&q=80', tag: 'BBQ' },
    { url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=150&h=150&fit=crop&q=80', tag: 'Cricket' },
    { url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=150&h=150&fit=crop&q=80', tag: 'Japan' },
    { url: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=150&h=150&fit=crop&q=80', tag: 'Sourdough' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const success = await onSubscribe(email);
      if (success) {
        setSubscribed(true);
        setEmail('');
      } else {
        setError('Subscription failed. Try again.');
      }
    } catch {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer id="main-footer" className="bg-zinc-100 border-t border-zinc-200 pt-16 pb-8 text-zinc-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-left">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
              <Logo variant="full" size="md" showTagline={true} />
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              A premium digital magazine exploring the intersections of sports, global travel, flavor science, and tech innovations. Crafted for immersive reading.
            </p>
            <div className="flex space-x-2 pt-2">
              <a href="#" className="p-2.5 bg-white hover:bg-rose-600 border border-zinc-200 text-zinc-600 hover:text-white rounded-none transition-all shadow-sm" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-white hover:bg-rose-600 border border-zinc-200 text-zinc-600 hover:text-white rounded-none transition-all shadow-sm" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-white hover:bg-rose-600 border border-zinc-200 text-zinc-600 hover:text-white rounded-none transition-all shadow-sm" aria-label="Github">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 bg-white hover:bg-rose-600 border border-zinc-200 text-zinc-600 hover:text-white rounded-none transition-all shadow-sm" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-zinc-900 font-bold text-xs uppercase tracking-widest">Categories</h3>
            <ul className="space-y-2.5 text-xs font-semibold uppercase tracking-wider">
              <li>
                <button onClick={() => onNavigate('category', 'cricket')} className="hover:text-rose-600 transition-colors flex items-center space-x-2 cursor-pointer text-zinc-600">
                  <span>🏏</span> <span>Cricket Highlights</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'football')} className="hover:text-rose-600 transition-colors flex items-center space-x-2 cursor-pointer text-zinc-600">
                  <span>⚽</span> <span>Football Tactics</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'travel')} className="hover:text-rose-600 transition-colors flex items-center space-x-2 cursor-pointer text-zinc-600">
                  <span>✈️</span> <span>Travel Journals</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'food')} className="hover:text-rose-600 transition-colors flex items-center space-x-2 cursor-pointer text-zinc-600">
                  <span>🍔</span> <span>Flavor Science</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('category', 'news')} className="hover:text-rose-600 transition-colors flex items-center space-x-2 cursor-pointer text-zinc-600">
                  <span>📰</span> <span>Breaking News</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Instagram Grid Gallery Mockup */}
          <div className="space-y-4">
            <h3 className="text-zinc-900 font-bold text-xs uppercase tracking-widest">Instagram Gallery</h3>
            <div id="instagram-gallery-grid" className="grid grid-cols-3 gap-2">
              {instagramPhotos.map((photo, idx) => (
                <div key={idx} className="relative group rounded-none overflow-hidden aspect-square bg-zinc-200 border border-zinc-200">
                  <img
                    src={photo.url}
                    alt={photo.tag}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-zinc-900 font-bold text-xs uppercase tracking-widest">Newsletter</h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-light">
              Subscribe to receive monthly digests of our finest investigative reports and visual logs.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-none text-emerald-700 text-xs text-center"
              >
                ✓ Subscribed successfully!
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex">
                  <div className="relative flex-grow">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="email"
                      required
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-xs text-zinc-900 placeholder-zinc-400 pl-9 pr-3 py-3 rounded-none border border-zinc-200 focus:outline-none focus:border-rose-600 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-zinc-900 text-white hover:bg-rose-600 px-4 py-3 rounded-none font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? '...' : <Send className="w-4 h-4" />}
                  </button>
                </div>
                {error && <p className="text-[10px] text-red-500">{error}</p>}
              </form>
            )}
            <div className="flex items-center space-x-2 text-[10px] text-zinc-400 pt-2 font-mono">
              <span>Sitemap:</span>
              <a href="/sitemap.xml" target="_blank" className="hover:text-rose-600 underline">sitemap.xml</a>
              <span>•</span>
              <span>RSS:</span>
              <a href="/rss.xml" target="_blank" className="hover:text-rose-600 underline">rss.xml</a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-200 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-mono">
          <p>© {new Date().getFullYear()} BlogSphere Inc. All rights reserved.</p>
          <p className="flex items-center mt-2 sm:mt-0">
            Designed for elite digital reading with <Heart className="w-3 h-3 text-rose-500 mx-1 fill-rose-500 animate-pulse" /> & precision.
          </p>
        </div>
      </div>
    </footer>
  );
}
