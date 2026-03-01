export interface Profile {
  id: string;
  username?: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'editor' | 'author' | 'contributor';
  bio: string | null;
  social_links: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  newsletter_subscribed?: boolean;
  newsletter_frequency?: 'daily' | 'weekly' | 'monthly';
  created_at: string;
  updated_at: string;
}

export type BlockType =
  | 'paragraph'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'image'
  | 'video'
  | 'quote'
  | 'code'
  | 'callout-info'
  | 'callout-warning'
  | 'callout-success'
  | 'table'
  | 'faq'
  | 'tweet'
  | 'divider'
  | 'button'
  | 'gallery';

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, unknown>;
}

export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';

export type Category =
  | 'Systems Innovations'
  | 'Integrated Risk Management'
  | 'Resilience'
  | 'AI and Analytics'
  | 'Real-Time Leadership';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  featured_image: string;
  category: Category;
  tags: string[];
  author_id: string;
  author?: Profile;
  status: ArticleStatus;
  published_at: string;
  scheduled_publish_at?: string;
  draft_content?: ContentBlock[];
  auto_save_timestamp?: string;
  reading_time: number;
  views: number;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
  created_at: string;
  updated_at: string;
}

export const CATEGORY_COLORS: Record<Category, { bg: string; text: string; accent: string }> = {
  'Systems Innovations': { bg: 'bg-blue-100', text: 'text-blue-700', accent: '#2E5EFF' },
  'Integrated Risk Management': { bg: 'bg-amber-100', text: 'text-amber-700', accent: '#FF9F1C' },
  'Resilience': { bg: 'bg-green-100', text: 'text-green-700', accent: '#2D6A4F' },
  'AI and Analytics': { bg: 'bg-coral-100', text: 'text-red-600', accent: '#FF6B6B' },
  'Real-Time Leadership': { bg: 'bg-teal-100', text: 'text-teal-700', accent: '#4ECDC4' },
};

export const CATEGORIES: Category[] = [
  'Systems Innovations',
  'Integrated Risk Management',
  'Resilience',
  'AI and Analytics',
  'Real-Time Leadership',
];

export interface Comment {
  id: string;
  article_id: string;
  parent_id?: string;
  author_id?: string;
  author_name?: string;
  author_email?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  reported_count: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface EditorState {
  title: string;
  excerpt: string;
  content: ContentBlock[];
  featured_image: string;
  category: Category;
  tags: string[];
  status: ArticleStatus;
  scheduled_publish_at?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
}