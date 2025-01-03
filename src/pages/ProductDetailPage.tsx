import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { RootState } from '../store/store';
import { fetchProducts } from '../store/productSlice';
import { addToCart } from '../store/cartSlice';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { items: products, loading } = useSelector((state: RootState) => state.products);
  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-rose-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 space-y-8 lg:h-fit">
          <div className="space-y-4">
            <h1 className="text-3xl font-serif text-gray-900">{product.name}</h1>
            <p className="text-2xl font-light">${product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Size: {product.size}</p>
          </div>

          <div className="prose prose-rose">
            <p>{product.description}</p>
          </div>

          {product.available ? (
            <button
              onClick={() => dispatch(addToCart(product))}
              className="w-full bg-rose-600 text-white py-4 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-rose-700 transition"
            >
              <ShoppingBag size={20} />
              Add to Cart
            </button>
          ) : (
            <div className="w-full bg-gray-200 text-gray-500 py-4 px-6 rounded-md text-center">
              Sold Out
            </div>
          )}

          <div className="border-t pt-8">
            <h2 className="font-medium mb-4">Product Details</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Carefully inspected for quality</li>
              <li>• Professional cleaning</li>
              <li>• Authentic vintage piece</li>
              <li>• Available for pickup in store</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
