import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilterSidebar } from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import { RootState } from '../store/store';
import { fetchProducts } from '../store/productSlice';

const defaultFilters = {
  category: {
    title: 'Category',
    options: [
      { value: 'denim', label: 'Denim', count: 0 },
      { value: 'tops', label: 'Tops', count: 0 },
      { value: 'dresses', label: 'Dresses', count: 0 },
      { value: 'outerwear', label: 'Outerwear', count: 0 },
      { value: 'accessories', label: 'Accessories', count: 0 },
    ],
  },
  gender: {
    title: 'Gender',
    options: [
      { value: 'women', label: 'Women', count: 0 },
      { value: 'men', label: 'Men', count: 0 },
      { value: 'unisex', label: 'Unisex', count: 0 },
    ],
  },
  size: {
    title: 'Size',
    options: [
      { value: 'xs', label: 'XS', count: 0 },
      { value: 's', label: 'S', count: 0 },
      { value: 'm', label: 'M', count: 0 },
      { value: 'l', label: 'L', count: 0 },
      { value: 'xl', label: 'XL', count: 0 },
    ],
  },
  color: {
    title: 'Color',
    options: [
      { value: 'black', label: 'Black', count: 0 },
      { value: 'white', label: 'White', count: 0 },
      { value: 'blue', label: 'Blue', count: 0 },
      { value: 'brown', label: 'Brown', count: 0 },
      { value: 'green', label: 'Green', count: 0 },
    ],
  },
  price: {
    title: 'Price Range',
    options: [
      { value: '0-25', label: 'Under $25', count: 0 },
      { value: '25-50', label: '$25 - $50', count: 0 },
      { value: '50-100', label: '$50 - $100', count: 0 },
      { value: '100+', label: 'Over $100', count: 0 },
    ],
  },
  condition: {
    title: 'Condition',
    options: [
      { value: 'new', label: 'New with tags', count: 0 },
      { value: 'like-new', label: 'Like new', count: 0 },
      { value: 'good', label: 'Good', count: 0 },
      { value: 'fair', label: 'Fair', count: 0 },
    ],
  },
};

export function HomePage() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state: RootState) => state.products);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    console.log("HomePage: useEffect - fetching products");
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    console.log("HomePage: products state changed", products);
  }, [products]);

  useEffect(() => {
    console.log("HomePage: loading state changed", loading);
  }, [loading]);

  useEffect(() => {
    console.log("HomePage: error state changed", error);
  }, [error]);

  const handleFilterChange = (type: string, value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[type] || [];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(v => v !== value)
        : [...currentFilters, value];
      
      return {
        ...prev,
        [type]: newFilters,
      };
    });
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    for (const [type, values] of Object.entries(selectedFilters)) {
      if (values.length === 0) continue;
      
      switch (type) {
        case 'category':
          if (values.length && !values.includes(product.category.toLowerCase())) {
            return false;
          }
          break;
        case 'size':
          if (values.length && !values.includes(product.size.toLowerCase())) {
            return false;
          }
          break;
        case 'gender':
          if (values.length && !values.includes(product.gender?.toLowerCase() || '')) {
            return false;
          }
          break;
        case 'color':
          if (values.length && !values.includes(product.color?.toLowerCase() || '')) {
            return false;
          }
          break;
        case 'condition':
          if (values.length && !values.includes(product.condition?.toLowerCase() || '')) {
            return false;
          }
          break;
        case 'price':
          const price = product.price / 100;
          const inRange = values.some(range => {
            switch (range) {
              case '0-25': return price <= 25;
              case '25-50': return price > 25 && price <= 50;
              case '50-100': return price > 50 && price <= 100;
              case '100+': return price > 100;
              default: return false;
            }
          });
          if (!inRange) return false;
          break;
      }
    }
    return true;
  });

  console.log("HomePage: filteredProducts", filteredProducts);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-4xl font-serif text-center mb-12">Latest Arrivals</h1>
      <div className="flex gap-8">
        <FilterSidebar
          filters={defaultFilters}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
