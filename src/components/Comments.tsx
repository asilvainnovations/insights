import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types';

interface CommentsProps {
  articleId: string;
}

export default function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { user, profile } = useAuth();

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (user && profile) {
      setName(profile.full_name || '');
      setEmail(user.email || '');
    }
  }, [user, profile]);

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('comments')
        .select('*')
        .eq('article_id', articleId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setComments(data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Auto-approve comments from authenticated users
      const status = user ? 'approved' : 'pending';

      const { data, error: insertError } = await supabase
        .from('comments')
        .insert([{
          article_id: articleId,
          author_name: name,
          author_email: email,
          content,
          status,
          user_id: user?.id || null
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // If auto-approved, add to the list immediately
      if (status === 'approved' && data) {
        setComments([data, ...comments]);
      }

      setSuccess(true);
      setContent('');
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Comment Form */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Leave a Comment</h3>
        
        {user && (
          <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-medium">
              {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
              <p className="text-sm text-blue-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Your comments are auto-approved
              </p>
            </div>
          </div>
        )}
        
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
            <p className="font-medium">Thank you for your comment!</p>
            <p className="text-sm mt-1">
              {user 
                ? 'Your comment has been posted.' 
                : 'Your comment is pending moderation and will appear shortly.'
              }
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="comment-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="comment-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 mb-1">
                Comment
              </label>
              <textarea
                id="comment-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                placeholder="Share your thoughts..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Comment
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div>
        <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {comments.length} Comment{comments.length !== 1 ? 's' : ''}
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                    <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
                    <div className="h-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {comment.author_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{comment.author_name}</span>
                    {comment.user_id && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        Member
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{formatDate(comment.created_at)}</p>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
