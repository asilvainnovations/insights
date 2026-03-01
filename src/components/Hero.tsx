import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Article, CATEGORY_COLORS, Category } from '@/types';

interface HeroProps {
  featuredArticles: Article[];
  onArticleClick: (slug: string) => void;
}

export default function Hero({ featuredArticles, onArticleClick }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const articles = featuredArticles.slice(0, 3);

  useEffect(() => {
    if (articles.length <= 1) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
        setIsAnimating(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [articles.length]);

  const goToSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
    }, 300);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % articles.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + articles.length) % articles.length);
  };

  const currentArticle = articles[currentSlide];

  if (!currentArticle) {
    return (
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[#0A2463] via-[#0D3B66] to-[#00B4D8] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Transforming Systems,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
              Empowering Resilience
            </span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Insights on systems thinking, risk management, AI analytics, and strategic leadership
          </p>
        </div>
      </section>
    );
  }

  const categoryColors = CATEGORY_COLORS[currentArticle.category as Category] || CATEGORY_COLORS['Systems Innovations'];

  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-[#0A2463] via-[#0D3B66] to-[#00B4D8] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Logo and Tagline */}
        <div className="text-center mb-12">
          <img 
            src="https://appimize.app/assets/apps/user_1097/images/2c7d825bf937_232_1097.png" 
            alt="ASilva Innovations" 
            className="h-16 w-16 mx-auto mb-6 drop-shadow-2xl"
          />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            Transforming Systems,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
              Empowering Resilience
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Expert insights on systems thinking, integrated risk management, AI analytics, and real-time leadership
          </p>
        </div>

        {/* Featured Article Carousel */}
        <div className="relative mt-16">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div 
              className="bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-300 group"
              onClick={() => onArticleClick(currentArticle.slug)}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-64 md:h-96 overflow-hidden">
                  <img 
                    src={currentArticle.featured_image} 
                    alt={currentArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span 
                      className="px-4 py-1.5 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: categoryColors.accent }}
                    >
                      {currentArticle.category}
                    </span>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4 text-white/70 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentArticle.reading_time} min read
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {currentArticle.views.toLocaleString()} views
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-teal-300 transition-colors">
                    {currentArticle.title}
                  </h2>

                  <p className="text-white/80 text-lg mb-6 line-clamp-3">
                    {currentArticle.excerpt}
                  </p>

                  {/* Author */}
                  {currentArticle.author && (
                    <div className="flex items-center gap-3 mb-6">
                      <img 
                        src={currentArticle.author.avatar} 
                        alt={currentArticle.author.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                      />
                      <div>
                        <p className="text-white font-medium">{currentArticle.author.name}</p>
                        <p className="text-white/60 text-sm">
                          {new Date(currentArticle.published_at).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-teal-300 font-semibold group-hover:gap-4 transition-all">
                    Read Article
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {articles.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {articles.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {articles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
