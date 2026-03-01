import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import Hero from './Hero';
import CategoryFilter from './CategoryFilter';
import ArticleGrid from './ArticleGrid';
import ArticleDetail from './ArticleDetail';
import BlockEditor from './BlockEditor';
import Analytics from './Analytics';
import NewsletterModal from './NewsletterModal';
import AuthModal from './AuthModal';
import BookmarksPage from './BookmarksPage';
import Footer from './Footer';
import { useArticles, useArticle } from '@/hooks/useArticles';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';

type ViewType = 'home' | 'article' | 'editor' | 'analytics' | 'bookmarks' | 'settings';

export default function AppLayout() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [hasShownNewsletter, setHasShownNewsletter] = useState(false);

  const { user, profile, updateProfile } = useAuth();

  // Fetch articles
  const { 
    articles, 
    loading, 
    hasMore, 
    loadMore 
  } = useArticles({
    category: selectedCategory,
    searchQuery,
    limit: 12,
  });

  // Fetch single article when viewing detail
  const { article: selectedArticle, loading: articleLoading } = useArticle(
    selectedArticleSlug || ''
  );

  // Newsletter trigger (after 30 seconds or 50% scroll)
  useEffect(() => {
    if (hasShownNewsletter || currentView !== 'home' || user) return;

    const timeoutId = setTimeout(() => {
      if (!hasShownNewsletter) {
        setShowNewsletter(true);
        setHasShownNewsletter(true);
      }
    }, 30000);

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > 50 && !hasShownNewsletter) {
        setShowNewsletter(true);
        setHasShownNewsletter(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasShownNewsletter, currentView, user]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentView('home');
  }, []);

  const handleCategorySelect = useCallback((category: Category | null) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleArticleClick = useCallback((slug: string) => {
    setSelectedArticleSlug(slug);
    setCurrentView('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((view: 'home' | 'editor' | 'analytics' | 'bookmarks' | 'settings') => {
    setCurrentView(view);
    setSelectedArticleSlug(null);
    if (view === 'home') {
      setSearchQuery('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    setCurrentView('home');
    setSelectedArticleSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Settings Page Component
  const SettingsPage = () => {
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(profile?.newsletter_subscribed ?? true);
    const [newsletterFrequency, setNewsletterFrequency] = useState(profile?.newsletter_frequency || 'weekly');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
      setSaving(true);
      const { error } = await updateProfile({
        full_name: fullName,
        newsletter_subscribed: newsletterSubscribed,
        newsletter_frequency: newsletterFrequency as any,
      });
      setSaving(false);
      if (!error) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    };

    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 pt-24">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in to access settings</h1>
            <p className="text-gray-600">You need to be signed in to manage your account settings.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Preferences</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletterSubscribed}
                  onChange={(e) => setNewsletterSubscribed(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Subscribe to newsletter</span>
              </label>

              {newsletterSubscribed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Frequency
                  </label>
                  <select
                    value={newsletterFrequency}
                    onChange={(e) => setNewsletterFrequency(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                    <option value="monthly">Monthly digest</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saved && (
              <span className="text-green-600 font-medium">Settings saved!</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'article':
        if (articleLoading) {
          return (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          );
        }
        if (selectedArticle) {
          return (
            <ArticleDetail
              article={selectedArticle}
              onBack={handleBack}
              onArticleClick={handleArticleClick}
            />
          );
        }
        return null;

      case 'editor':
        return <BlockEditor />;

      case 'analytics':
        return <Analytics />;

      case 'bookmarks':
        return <BookmarksPage onArticleClick={handleArticleClick} />;

      case 'settings':
        return <SettingsPage />;

      default:
        return (
          <>
            {/* Hero Section */}
            <Hero 
              featuredArticles={articles.slice(0, 3)} 
              onArticleClick={handleArticleClick}
            />

            {/* Category Filter */}
            <section className="bg-white sticky top-20 z-20 border-b border-gray-100 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelect={handleCategorySelect}
                />
              </div>
            </section>

            {/* Article Grid */}
            <ArticleGrid
              articles={articles}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={loadMore}
              onArticleClick={handleArticleClick}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />

            {/* Newsletter CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#0A2463] via-[#0D3B66] to-[#00B4D8]">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Transform Your Organization?
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of leaders who receive our weekly insights on systems thinking, 
                  risk management, and strategic leadership.
                </p>
                <button
                  onClick={() => setShowNewsletter(true)}
                  className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Subscribe to Our Newsletter
                </button>
              </div>
            </section>

            {/* About Section */}
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                      About ASilva Innovations
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                      Pioneering the Future of Organizational Excellence
                    </h2>
                    <p className="text-lg text-gray-600 mb-6">
                      ASilva Innovations is a leading consultancy specializing in systems thinking, 
                      integrated risk management, and strategic leadership development. We help 
                      organizations build adaptive capacity and resilience in an increasingly complex world.
                    </p>
                    <p className="text-lg text-gray-600 mb-8">
                      Our team of experts combines deep academic knowledge with practical experience 
                      to deliver transformative solutions that drive sustainable success.
                    </p>
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-4xl font-bold text-blue-600">500+</p>
                        <p className="text-gray-600">Organizations Transformed</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-teal-500">20+</p>
                        <p className="text-gray-600">Years Experience</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-amber-500">50+</p>
                        <p className="text-gray-600">Countries Served</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                      alt="Team collaboration"
                      className="rounded-2xl shadow-2xl"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                      <div className="flex items-center gap-4">
                        <img
                          src="https://asilvainnovations.com/assets/apps/user_1097/app_13212/draft/icon/app_logo.png?1769949231"
                          alt="ASilva Logo"
                          className="w-12 h-12"
                        />
                        <div>
                          <p className="font-bold text-gray-900">ASilva Innovations</p>
                          <p className="text-sm text-gray-500">Transforming Systems</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Pillars */}
            <section className="py-20 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Our Areas of Expertise
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Explore our five core content pillars that drive organizational transformation
                  </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    {
                      title: 'Systems Innovations',
                      fullTitle: 'Systems Innovations' as Category,
                      description: 'Holistic approaches to understanding and optimizing complex organizational systems',
                      color: 'bg-blue-500',
                    },
                    {
                      title: 'Integrated Risk',
                      fullTitle: 'Integrated Risk Management' as Category,
                      description: 'Comprehensive frameworks connecting risk across all business dimensions',
                      color: 'bg-amber-500',
                    },
                    {
                      title: 'Resilience',
                      fullTitle: 'Resilience' as Category,
                      description: 'Building organizations that thrive through disruption and emerge stronger',
                      color: 'bg-green-600',
                    },
                    {
                      title: 'AI & Analytics',
                      fullTitle: 'AI and Analytics' as Category,
                      description: 'Leveraging artificial intelligence for strategic decision-making',
                      color: 'bg-red-500',
                    },
                    {
                      title: 'Real-Time Leadership',
                      fullTitle: 'Real-Time Leadership' as Category,
                      description: 'Adaptive leadership skills for navigating uncertainty with confidence',
                      color: 'bg-teal-500',
                    },
                  ].map((pillar) => (
                    <button
                      key={pillar.title}
                      onClick={() => handleCategorySelect(pillar.fullTitle)}
                      className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-gray-100"
                    >
                      <div className={`w-12 h-12 ${pillar.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pillar.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
        onNavigate={handleNavigate}
        currentView={currentView}
        onAuthClick={() => setShowAuth(true)}
      />

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>

      {/* Footer */}
      {currentView !== 'article' && (
        <Footer
          onCategorySelect={handleCategorySelect}
          onNewsletterOpen={() => setShowNewsletter(true)}
        />
      )}

      {/* Newsletter Modal */}
      <NewsletterModal
        isOpen={showNewsletter}
        onClose={() => setShowNewsletter(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />
    </div>
  );
}
