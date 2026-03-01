import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Clock, Eye, Calendar, Share2, Bookmark, 
  Twitter, Linkedin, Facebook, Link2, CheckCircle,
  ChevronUp, MessageCircle
} from 'lucide-react';
import { Article, CATEGORY_COLORS, Category } from '@/types';
import { useRelatedArticles } from '@/hooks/useArticles';
import ArticleCard from './ArticleCard';
import Comments from './Comments';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  onArticleClick: (slug: string) => void;
}

export default function ArticleDetail({ article, onBack, onArticleClick }: ArticleDetailProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { articles: relatedArticles, loading: relatedLoading } = useRelatedArticles(
    article.id,
    article.category as Category,
    4
  );

  const categoryColors = CATEGORY_COLORS[article.category as Category] || CATEGORY_COLORS['Systems Innovations'];

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const element = contentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const windowScrollTop = window.scrollY - element.offsetTop + 200;
        
        if (windowScrollTop <= 0) {
          setReadingProgress(0);
        } else if (windowScrollTop >= totalHeight) {
          setReadingProgress(100);
        } else {
          setReadingProgress((windowScrollTop / totalHeight) * 100);
        }
      }

      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article.title;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShowShareMenu(false);
  };

  // Generate Table of Contents from content
  const generateTOC = () => {
    // Simulated TOC based on article content
    return [
      { id: 'intro', title: 'Introduction', level: 2 },
      { id: 'key-concepts', title: 'Key Concepts', level: 2 },
      { id: 'implementation', title: 'Implementation Strategies', level: 2 },
      { id: 'case-study', title: 'Case Study', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 },
    ];
  };

  const toc = generateTOC();

  return (
    <div className="min-h-screen bg-white">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img 
          src={article.featured_image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-24 left-4 md:left-8 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            {/* Category */}
            <span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4"
              style={{ backgroundColor: categoryColors.accent }}
            >
              {article.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              {article.author && (
                <div className="flex items-center gap-3">
                  <img 
                    src={article.author.avatar} 
                    alt={article.author.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                  />
                  <div>
                    <p className="font-semibold text-white">{article.author.name}</p>
                    <p className="text-sm">{article.author.bio?.slice(0, 50)}...</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.reading_time} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {article.views.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`block text-sm text-gray-600 hover:text-blue-600 transition-colors ${
                      item.level === 3 ? 'pl-4' : ''
                    }`}
                  >
                    {item.title}
                  </a>
                ))}
              </nav>

              {/* Share & Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Share Article</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 bg-gray-100 rounded-full hover:bg-green-100 hover:text-green-600 transition-colors relative"
                  >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Link2 className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    isBookmarked 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>

              {/* Tags */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article ref={contentRef} className="lg:col-span-3">
            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-serif">
              {article.excerpt}
            </p>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none font-serif">
              <section id="intro">
                <h2 className="font-sans">Introduction</h2>
                <p>
                  In today's rapidly evolving business landscape, organizations face unprecedented challenges that demand new approaches to strategy, risk, and leadership. The traditional siloed thinking that once served businesses well is no longer sufficient to navigate the complexity of modern markets.
                </p>
                <p>
                  This article explores how {article.category.toLowerCase()} principles can transform your organization's approach to these challenges, providing practical frameworks and actionable insights that you can implement immediately.
                </p>
              </section>

              <section id="key-concepts">
                <h2 className="font-sans">Key Concepts</h2>
                <p>
                  Understanding the foundational concepts is crucial for successful implementation. Let's examine the core principles that underpin effective {article.category.toLowerCase()}:
                </p>
                <ul>
                  <li><strong>Interconnectedness:</strong> Recognizing that all parts of a system influence each other</li>
                  <li><strong>Feedback Loops:</strong> Understanding how actions create reactions that cycle back</li>
                  <li><strong>Emergence:</strong> How complex behaviors arise from simple rules</li>
                  <li><strong>Adaptation:</strong> The ability to evolve in response to changing conditions</li>
                </ul>
                
                <blockquote className="border-l-4 border-blue-500 pl-6 italic my-8">
                  "The measure of intelligence is the ability to change." — Albert Einstein
                </blockquote>
              </section>

              <section id="implementation">
                <h2 className="font-sans">Implementation Strategies</h2>
                <p>
                  Moving from theory to practice requires a structured approach. Here are proven strategies for implementing these concepts in your organization:
                </p>
                <ol>
                  <li><strong>Assessment:</strong> Begin with a comprehensive evaluation of your current state</li>
                  <li><strong>Stakeholder Alignment:</strong> Ensure all key players understand and support the initiative</li>
                  <li><strong>Pilot Programs:</strong> Start small with controlled experiments before scaling</li>
                  <li><strong>Measurement:</strong> Establish clear metrics to track progress and outcomes</li>
                  <li><strong>Iteration:</strong> Continuously refine your approach based on feedback</li>
                </ol>
              </section>

              <section id="case-study">
                <h2 className="font-sans">Case Study</h2>
                <p>
                  A Fortune 500 company recently implemented these principles with remarkable results. Within 18 months, they achieved:
                </p>
                <ul>
                  <li>40% reduction in operational risk incidents</li>
                  <li>25% improvement in strategic decision-making speed</li>
                  <li>35% increase in cross-functional collaboration</li>
                  <li>$50M in cost savings through improved efficiency</li>
                </ul>
                <p>
                  The key to their success was a commitment to holistic thinking and a willingness to challenge established assumptions about how work should be organized.
                </p>
              </section>

              <section id="conclusion">
                <h2 className="font-sans">Conclusion</h2>
                <p>
                  The principles of {article.category.toLowerCase()} offer a powerful framework for navigating complexity and building organizational resilience. By embracing these concepts and implementing them thoughtfully, leaders can position their organizations for sustainable success in an uncertain world.
                </p>
                <p>
                  The journey toward transformation begins with a single step. Start by assessing your current capabilities, identifying areas for improvement, and committing to continuous learning and adaptation.
                </p>
              </section>
            </div>

            {/* Author Bio */}
            {article.author && (
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl">
                <div className="flex items-start gap-6">
                  <img 
                    src={article.author.avatar} 
                    alt={article.author.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{article.author.name}</h3>
                    <p className="text-gray-600 mt-2">{article.author.bio}</p>
                    <div className="flex gap-3 mt-4">
                      {article.author.social_links?.linkedin && (
                        <a 
                          href={article.author.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {article.author.social_links?.twitter && (
                        <a 
                          href={article.author.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Share Bar */}
            <div className="lg:hidden mt-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Share this article</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Twitter className="w-5 h-5 text-blue-400" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Linkedin className="w-5 h-5 text-blue-700" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  >
                    {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Link2 className="w-5 h-5 text-gray-600" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                Comments
                <span className="text-sm font-normal text-gray-500">(Click to {showComments ? 'hide' : 'show'})</span>
              </button>
              
              {showComments && (
                <div className="mt-6 animate-fadeIn">
                  <Comments articleId={article.id} />
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-20 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard 
                  key={relatedArticle.id}
                  article={relatedArticle}
                  onClick={onArticleClick}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 animate-fadeIn z-40"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
