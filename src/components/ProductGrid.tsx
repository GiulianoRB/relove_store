import React from 'react';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onLoadMore?: () => void;
}

export default function ProductGrid({ products, onLoadMore }: ProductGridProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    onChange: (inView) => {
      if (inView && onLoadMore) {
        onLoadMore();
      }
    },
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <div ref={ref} className="h-10" />
    </div>
  );
}
