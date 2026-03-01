import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronDown, User, LogOut, Bookmark, Settings } from 'lucide-react';
import { CATEGORIES, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategorySelect: (category: Category | null) => void;
  selectedCategory: Category | null;
  onNavigate: (view: 'home' | 'editor' | 'analytics' | 'bookmarks' | 'settings') => void;
  currentView: string;
  onAuthClick: () => void;
}

export default function Header({ 
  onSearch, 
  onCategorySelect, 
  selectedCategory,
  onNavigate,
  currentView,
  onAuthClick
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, profile, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setCategoriesOpen(false);
      setUserMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setSearchOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    onNavigate('home');
  };

  const getCategoryColor = (category: Category) => {
    const colors: Record<Category, string> = {
      'Systems Innovations': 'text-blue-500',
      'Integrated Risk Management': 'text-amber-500',
      'Resilience': 'text-green-600',
      'AI and Analytics': 'text-red-500',
      'Real-Time Leadership': 'text-teal-500',
    };
    return colors[category];
  };

  const getUserInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img 
              src="https://appimize.app/assets/apps/user_1097/images/2c7d825bf937_232_1097.png" 
              alt="ASilva Innovations" 
              className="h-10 w-10 object-contain"
            />
            <div className="hidden sm:block">
              <h1 className={`font-bold text-lg leading-tight transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                ASilva Innovations
              </h1>
              <p className={`text-xs transition-colors ${
                isScrolled ? 'text-gray-500' : 'text-white/70'
              }`}>
                Insights & Strategy
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className={`font-medium transition-colors ${
                currentView === 'home'
                  ? isScrolled ? 'text-blue-600' : 'text-white'
                  : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}
            >
              Articles
            </button>

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoriesOpen(!categoriesOpen);
                  setUserMenuOpen(false);
                }}
                className={`flex items-center gap-1 font-medium transition-colors ${
                  isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
                }`}
              >
                Topics
                <ChevronDown className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      onCategorySelect(null);
                      setCategoriesOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                      !selectedCategory ? 'bg-gray-50 font-medium' : ''
                    }`}
                  >
                    All Topics
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onCategorySelect(cat);
                        setCategoriesOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                        selectedCategory === cat ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${getCategoryColor(cat).replace('text-', 'bg-')}`}></span>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('editor')}
              className={`font-medium transition-colors ${
                currentView === 'editor'
                  ? isScrolled ? 'text-blue-600' : 'text-white'
                  : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}
            >
              Write
            </button>

            <button
              onClick={() => onNavigate('analytics')}
              className={`font-medium transition-colors ${
                currentView === 'analytics'
                  ? isScrolled ? 'text-blue-600' : 'text-white'
                  : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}
            >
              Analytics
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth Section */}
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserMenuOpen(!userMenuOpen);
                        setCategoriesOpen(false);
                      }}
                      className={`flex items-center gap-2 p-1 rounded-full transition-colors ${
                        isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                      }`}
                    >
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt={profile.full_name || 'User'} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-sm font-medium">
                          {getUserInitials()}
                        </div>
                      )}
                    </button>

                    {userMenuOpen && (
                      <div 
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-medium text-gray-900 truncate">
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            onNavigate('bookmarks');
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <Bookmark className="w-4 h-4 text-gray-500" />
                          My Bookmarks
                        </button>
                        
                        <button
                          onClick={() => {
                            onNavigate('settings');
                            setUserMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <Settings className="w-4 h-4 text-gray-500" />
                          Settings
                        </button>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onAuthClick}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-2 rounded-full transition-colors ${
                isScrolled 
                  ? 'hover:bg-gray-100 text-gray-600' 
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar Expanded */}
        {searchOpen && (
          <div className="pb-4 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-5 py-3 pl-12 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {/* User Info for Mobile */}
            {user && (
              <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || 'User'} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-medium">
                      {getUserInitials()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                onNavigate('home');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Articles
            </button>
            
            <div className="px-4 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Topics
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onCategorySelect(cat);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 ${
                  selectedCategory === cat ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${getCategoryColor(cat).replace('text-', 'bg-')}`}></span>
                {cat}
              </button>
            ))}

            <button
              onClick={() => {
                onNavigate('editor');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Write
            </button>

            <button
              onClick={() => {
                onNavigate('analytics');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium"
            >
              Analytics
            </button>

            {user && (
              <>
                <button
                  onClick={() => {
                    onNavigate('bookmarks');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                >
                  <Bookmark className="w-5 h-5" />
                  My Bookmarks
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Settings
                </button>
              </>
            )}

            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4 px-5 py-3 border border-red-200 text-red-600 font-medium rounded-full hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  setIsMenuOpen(false);
                }}
                className="w-full mt-4 px-5 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium rounded-full flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
