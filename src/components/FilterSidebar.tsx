import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RootState } from '../store/store';

const getFilterCounts = (products: any[]) => {
  const counts = {
    category: {} as Record<string, number>,
    gender: {} as Record<string, number>,
    size: {} as Record<string, number>,
    color: {} as Record<string, number>,
    condition: {} as Record<string, number>,
    price: {
      '0-25': 0,
      '25-50': 0,
      '50-100': 0,
      '100+': 0
    } as Record<string, number>
  };

  products.forEach(product => {
    counts.category[product.category.toLowerCase()] = (counts.category[product.category.toLowerCase()] || 0) + 1;
    
    if (product.gender) {
      counts.gender[product.gender.toLowerCase()] = (counts.gender[product.gender.toLowerCase()] || 0) + 1;
    }
    
    counts.size[product.size.toLowerCase()] = (counts.size[product.size.toLowerCase()] || 0) + 1;
    
    if (product.color) {
      counts.color[product.color.toLowerCase()] = (counts.color[product.color.toLowerCase()] || 0) + 1;
    }
    
    if (product.condition) {
      counts.condition[product.condition.toLowerCase()] = (counts.condition[product.condition.toLowerCase()] || 0) + 1;
    }
    
    const price = product.price / 100;
    if (price <= 25) counts.price['0-25']++;
    else if (price <= 50) counts.price['25-50']++;
    else if (price <= 100) counts.price['50-100']++;
    else counts.price['100+']++;
  });

  return counts;
};

interface FilterSection {
  title: string;
  options: { value: string; label: string; count: number }[];
}

interface FilterSidebarProps {
  filters: {
    category: FilterSection;
    gender: FilterSection;
    size: FilterSection;
    color: FilterSection;
    price: FilterSection;
    condition: FilterSection;
  };
  selectedFilters: Record<string, string[]>;
  onFilterChange: (type: string, value: string) => void;
}

export function FilterSidebar({ filters, selectedFilters, onFilterChange }: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    category: true,
    gender: true,
    size: true,
    color: false,
    price: false,
    condition: false,
  });

  const { items: products } = useSelector((state: RootState) => state.products);
  const filterCounts = getFilterCounts(products);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updatedFilters = {
    category: {
      ...filters.category,
      options: filters.category.options.map(option => ({
        ...option,
        count: filterCounts.category[option.value] || 0
      }))
    },
    gender: {
      ...filters.gender,
      options: filters.gender.options.map(option => ({
        ...option,
        count: filterCounts.gender[option.value] || 0
      }))
    },
    size: {
      ...filters.size,
      options: filters.size.options.map(option => ({
        ...option,
        count: filterCounts.size[option.value] || 0
      }))
    },
    color: {
      ...filters.color,
      options: filters.color.options.map(option => ({
        ...option,
        count: filterCounts.color[option.value] || 0
      }))
    },
    price: {
      ...filters.price,
      options: filters.price.options.map(option => ({
        ...option,
        count: filterCounts.price[option.value] || 0
      }))
    },
    condition: {
      ...filters.condition,
      options: filters.condition.options.map(option => ({
        ...option,
        count: filterCounts.condition[option.value.toLowerCase()] || 0
      }))
    }
  };

  const renderFilterSection = (type: string, section: FilterSection) => (
    <div key={type} className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-sm font-medium text-gray-900"
        onClick={() => toggleSection(type)}
      >
        {section.title}
        {expandedSections[type] ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
      </button>
      {expandedSections[type] && (
        <div className="mt-2 space-y-1">
          {section.options.map((option) => (
            <label key={`${type}-${option.value}`} className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                checked={selectedFilters[type]?.includes(option.value)}
                onChange={() => onFilterChange(type, option.value)}
              />
              <span className="ml-2 text-sm text-gray-600">
                {option.label}
                <span className="ml-1 text-gray-400">({option.count})</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-64 flex-none">
      <div className="sticky top-20 bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
        {Object.entries(updatedFilters).map(([type, section]) => 
          renderFilterSection(type, section)
        )}
      </div>
    </div>
  );
}
