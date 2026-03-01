import React from 'react';
import { CATEGORIES, Category, CATEGORY_COLORS } from '@/types';
import { Layers, Shield, Leaf, Brain, Zap } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Category | null;
  onSelect: (category: Category | null) => void;
}

const categoryIcons: Record<Category, React.ReactNode> = {
  'Systems Innovations': <Layers className="w-4 h-4" />,
  'Integrated Risk Management': <Shield className="w-4 h-4" />,
  'Resilience': <Leaf className="w-4 h-4" />,
  'AI and Analytics': <Brain className="w-4 h-4" />,
  'Real-Time Leadership': <Zap className="w-4 h-4" />,
};

export default function CategoryFilter({ selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-3 pb-2 min-w-max">
        {/* All Button */}
        <button
          onClick={() => onSelect(null)}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg scale-105'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Topics
        </button>

        {/* Category Buttons */}
        {CATEGORIES.map((category) => {
          const colors = CATEGORY_COLORS[category];
          const isSelected = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onSelect(category)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                isSelected
                  ? 'text-white shadow-lg scale-105'
                  : `${colors.bg} ${colors.text} hover:opacity-80`
              }`}
              style={isSelected ? { backgroundColor: colors.accent } : undefined}
            >
              {categoryIcons[category]}
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
