// ========================================
// USER & PROFILE TYPES
// ========================================

export interface Profile {
  id: string;
  username?: string;                    // ← ADDED (matches SQL schema)
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

// ========================================
// ARTICLE TYPES
// ========================================

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  featured_image: string;
  category: Category;
  tags: string[];
  author_id: string;                    // UUID referencing profiles.id
  author?: Profile;                     // ← CORRECT (not Author)
  status: 'draft' | 'published' | 'scheduled';
  published_at: string;
  scheduled_publish_at?: string;        // ← CORRECT NAME (matches SQL)
  draft_content?: ContentBlock[];       // ← ADDED (for auto-save)
  auto_save_timestamp?: string;         // ← ADDED (for auto-save)
  reading_time: number;
  views: number;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  canonical_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleVersion {
  id: string;
  article_id: string;
  author_id: string;                    // ← CORRECT (not created_by)
  title: string;
  content: ContentBlock[];
  excerpt?: string;
  featured_image?: string;
  tags?: string[];
  created_at: string;
}

// ========================================
// CONTENT BLOCK TYPES
// ========================================

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, unknown>;
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

// ========================================
// COMMENT TYPES
// ========================================

export interface Comment {
  id: string;
  article_id: string;
  parent_id?: string;
  author_id?: string;                   // Authenticated users
  author_name?: string;                 // Guest comments (optional)
  author_email?: string;                // Guest comments (optional)
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam'; // ← INCLUDES 'rejected'
  reported_count: number;               // ← ADDED (matches SQL)
  upvotes: number;                      // ← ADDED (matches SQL)
  downvotes: number;                    // ← ADDED (matches SQL)
  created_at: string;
  updated_at: string;                   // ← ADDED (matches SQL)
  replies?: Comment[];
}

// ========================================
// NEWSLETTER TYPES
// ========================================

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  tags?: string[];
  source?: string;
  status: 'active' | 'unsubscribed';
  subscribed_at: string;
  unsubscribed_at?: string;
}

// ========================================
// ANALYTICS TYPES
// ========================================

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  article_id?: string;
  page_path: string;
  referrer?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
}

// ========================================
// CATEGORY TYPES
// ========================================

export type Category =
  | 'Systems Innovations'
  | 'Integrated Risk Management'
  | 'Resilience'
  | 'AI and Analytics'
  | 'Real-Time Leadership';

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

// ========================================
// MODERATION & TASK TYPES
// ========================================

export interface CommentReport {
  id: string;
  comment_id: string;
  reporter_id?: string;                 // NULL for anonymous reports
  reason: 'spam' | 'harassment' | 'hate_speech' | 'irrelevant' | 'other';
  details?: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  name: string;
  query: string;
  filters: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduledTask {
  id: string;
  task_type: 'publish_article' | 'send_newsletter' | 'cleanup_drafts' | 'recalculate_analytics' | 'moderate_comments';
  payload: Record<string, unknown>;
  scheduled_at: string;
  executed_at?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  retry_count: number;
  max_retries: number;
  created_at: string;
  updated_at: string;
}