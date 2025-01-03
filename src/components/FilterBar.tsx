import React from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FilterBar({ categories, selectedCategory, onCategoryChange }: FilterBarProps) {
  return (
    <div className="sticky top-16 bg-[#faf7f5]/80 backdrop-blur-md z-40 py-4 mb-8">
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter size={20} />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            selectedCategory === ''
              ? 'bg-rose-600 text-white'
              : 'bg-white text-gray-700 hover:bg-rose-50'
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-rose-600 text-white'
                : 'bg-white text-gray-700 hover:bg-rose-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
