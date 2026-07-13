export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  createdAt: string;
  password?: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  twitter?: string;
  github?: string;
  instagram?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  videoUrl?: string;
  published: boolean;
  createdAt: string;
  publishedAt: string;
  readingTime: number;
  views: number;
  categorySlug: string;
  authorId: string;
  likesCount: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postSlug: string;
  userEmail: string;
  userName: string;
  userAvatar: string;
}

export interface Bookmark {
  id: string;
  userEmail: string;
  postSlug: string;
  createdAt: string;
}

export interface Like {
  id: string;
  userEmail: string;
  postSlug: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userEmail: string;
}

export interface AdminStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  subscribersCount: number;
  usersCount: number;
  analytics: {
    viewsByDate: { [date: string]: number };
    viewsByCategory: { [category: string]: number };
  };
}

export type CategorySlug = 'cricket' | 'football' | 'travel' | 'food' | 'news' | 'technology';

export interface CategoryDetails {
  slug: CategorySlug;
  name: string;
  icon: string;
  color: string; // Tailwind color class for bg/text
  accentColor: string; // Focus ring/accent color
  description: string;
  bannerImage: string;
  tags: string[];
}

export const CATEGORIES: { [slug in CategorySlug]: CategoryDetails } = {
  cricket: {
    slug: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    color: 'bg-teal-600 text-teal-100 hover:bg-teal-700 border-teal-500',
    accentColor: 'text-teal-500 ring-teal-500 focus:border-teal-500 border-teal-500',
    description: 'Pitch breakdowns, dynamic T20 analysis, match reports, and Test match strategies from our senior correspondents.',
    bannerImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&h=600&fit=crop&q=80',
    tags: ['T20', "WTC", "IPL", "Test Cricket", "Lords", "Tactics", "Bowler Matchups"]
  },
  football: {
    slug: 'football',
    name: 'Football',
    icon: '⚽',
    color: 'bg-rose-600 text-rose-100 hover:bg-rose-700 border-rose-500',
    accentColor: 'text-rose-500 ring-rose-500 focus:border-rose-500 border-rose-500',
    description: 'Tactical analysis, modern pressing systems, underdog triumphs, and transfers from elite European leagues.',
    bannerImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&h=600&fit=crop&q=80',
    tags: ['Tactics', 'Pep Guardiola', 'Premier League', 'Champions League', 'Underdogs', 'Football Culture']
  },
  travel: {
    slug: 'travel',
    name: 'Travel',
    icon: '✈️',
    color: 'bg-blue-600 text-blue-100 hover:bg-blue-700 border-blue-500',
    accentColor: 'text-blue-500 ring-blue-500 focus:border-blue-500 border-blue-500',
    description: 'Wanderlust logs, breathtaking photojournalism, remote summits, and guides to hidden cultural gems.',
    bannerImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=600&fit=crop&q=80',
    tags: ['Bolivia', 'Japan', 'Adventure', 'Kyoto', 'Slow Travel', 'Cultural Travel', 'Landscape Photography']
  },
  food: {
    slug: 'food',
    name: 'Food',
    icon: '🍔',
    color: 'bg-amber-600 text-amber-100 hover:bg-amber-700 border-amber-500',
    accentColor: 'text-amber-500 ring-amber-500 focus:border-amber-500 border-amber-500',
    description: 'Flavour science, step-by-step masterclasses, wood smoke physics, and world street food critique.',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&h=600&fit=crop&q=80',
    tags: ['BBQ', 'Texas', 'Meat Science', 'Baking', 'Sourdough', 'Food Chemistry', 'Bread']
  },
  news: {
    slug: 'news',
    name: 'News',
    icon: '📰',
    color: 'bg-violet-600 text-violet-100 hover:bg-violet-700 border-violet-500',
    accentColor: 'text-violet-500 ring-violet-500 focus:border-violet-500 border-violet-500',
    description: 'Investigation logs, tech frontiers, global policy, urban engineering, and smart green grids.',
    bannerImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&h=900&fit=crop&q=80',
    tags: ['Artificial Intelligence', 'Tech Policy', 'Climate Change', 'Urban Infrastructure', 'Green Energy', 'Engineering']
  },
  technology: {
    slug: 'technology',
    name: 'Technology',
    icon: '💻',
    color: 'bg-indigo-600 text-indigo-100 hover:bg-indigo-700 border-indigo-500',
    accentColor: 'text-indigo-500 ring-indigo-500 focus:border-indigo-500 border-indigo-500',
    description: 'Software engineering, system design, web standards, databases, and cutting-edge frontend architectures.',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&h=600&fit=crop&q=80',
    tags: ['React', 'TypeScript', 'System Design', 'Performance', 'Web Standards', 'Next.js', 'Databases']
  }
};
