import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { addToCart } from '../store/cartSlice';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:opacity-75 transition"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500">Size {product.size}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">${product.price.toLocaleString()}</p>
        </div>
      </Link>
      {product.available ? (
        <button
          onClick={() => dispatch(addToCart(product))}
          className="mt-4 w-full bg-rose-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-rose-700 transition"
        >
          <ShoppingBag size={20} />
          Add to Cart
        </button>
      ) : (
        <div className="mt-4 w-full bg-gray-200 text-gray-500 py-2 px-4 rounded-md text-center">
          Sold Out
        </div>
      )}
    </div>
  );
}
