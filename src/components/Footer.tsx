import React, { useState } from 'react';
import { 
  Mail, 
  Linkedin, 
  Facebook,   // ADDED MISSING IMPORT
  Instagram,  // ADDED MISSING IMPORT
  ArrowRight, 
  Phone, 
  Globe 
} from 'lucide-react'; // REMOVED UNUSED IMPORTS (Twitter, Youtube, MapPin)
import { CATEGORIES, Category, CATEGORY_COLORS } from '@/types';

interface FooterProps {
  onCategorySelect: (category: Category) => void;
  onNewsletterOpen: () => void;
}

export default function Footer({ onCategorySelect, onNewsletterOpen }: FooterProps) {
  const [email, setEmail] = useState('');

  const handleQuickSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onNewsletterOpen();
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Join 10,000+ Leaders Transforming Their Organizations
              </h3>
              <p className="text-white/80">
                Get weekly insights on systems thinking, risk management, and strategic leadership.
              </p>
            </div>
            <form onSubmit={handleQuickSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://appimize.app/assets/apps/user_1097/images/2c7d825bf937_232_1097.png" 
                alt="ASilva Innovations" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h4 className="font-bold text-xl">ASilva Innovations</h4>
                <p className="text-gray-400 text-sm">Transforming Systems, Empowering Resilience</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              We help organizations build adaptive capacity through systems thinking, integrated risk management, and strategic leadership development.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-gray-400">
              <a href="mailto:info@asilvainnovations.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                info@asilvainnovations.com
              </a>
              <a href="tel:+639178555134" className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                +63 (917) 855-5134
              </a>
              <a href="https://asilvainnovations.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                <Globe className="w-5 h-5" />
                asilvainnovations.com
              </a>
            </div>

            {/* Social Links - FIXED ICONS AND HREFS */}
            <div className="flex gap-4 mt-6">
              <a href="https://linkedin.com/company/asilvainnovations" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/asilvainnovations" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" /> {/* NOW IMPORTED */}
              </a>
              <a href="https://instagram.com/asilvainnovations" target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram className="w-5 h-5" /> {/* NOW IMPORTED */}
              </a>
            </div>
          </div>

          {/* Topics Column */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Topics</h5>
            <ul className="space-y-3">
              {CATEGORIES.map((category) => {
                const colors = CATEGORY_COLORS[category];
                return (
                  <li key={category}>
                    <button
                      onClick={() => onCategorySelect(category)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-left"
                    >
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      {category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Resources</h5>
            <ul className="space-y-3">
              <li>
                <a href="https://asilvainnovations.com/case-studies/" className="text-gray-400 hover:text-white transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/whitepapers/" className="text-gray-400 hover:text-white transition-colors">
                  Whitepapers
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/ddrive-m/" className="text-gray-400 hover:text-white transition-colors">
                  DDRiVE-M
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/strat-planner-pro" className="text-gray-400 hover:text-white transition-colors">
                  Strat Planner Pro
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/rtl/" className="text-gray-400 hover:text-white transition-colors">
                  Real-Time Leadership
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/smart-flood-detection/" className="text-gray-400 hover:text-white transition-colors">
                  Smart Flood Detection
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column - CRITICAL FIX APPLIED HERE */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Company</h5>
            <ul className="space-y-3">
              <li>
                <a href="https://asilvainnovations.com/about/" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/solutions" className="text-gray-400 hover:text-white transition-colors">
                  Our Solutions
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/products/" className="text-gray-400 hover:text-white transition-colors">
                  Our Products
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/pricing-plans" className="text-gray-400 hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="https://asilvainnovations.com/contact/" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              {/* FIXED: Changed self-closing tag to proper opening/closing tags */}
              <li>
                <a href="https://asilvainnovations.com/partnerships" className="text-gray-400 hover:text-white transition-colors">
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} ASilva Innovations. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="https://asilvainnovations.com/privacy-policy" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="https://asilvainnovations.com/terms/" className="text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="https://asilvainnovations.com/cookie-policy/" className="text-gray-500 hover:text-white transition-colors">
              Cookie Policy
               <a href="https://asilvainnovations.com/accessibility/" className="text-gray-500 hover:text-white transition-colors">
              Accessibility Policy
            <a href="https://asilvainnovations.com/ai-ethics-and-policy-framework/" className="text-gray-500 hover:text-white transition-colors">
              AI Ethics and Policy Framework
            </a>
            </a>
            <a href="https://asilvainnovations.com/site-map/" className="text-gray-500 hover:text-white transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}