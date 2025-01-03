import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import { RootState } from '../store/store';
import { removeFromCart, updateQuantity } from '../store/cartSlice';

export function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Your cart is empty</p>
        <Link
          to="/"
          className="text-rose-600 hover:text-rose-700 transition flex items-center gap-2"
        >
          Continue Shopping
          <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-serif mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
            >
              <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4">
                  <Link
                    to={`/product/${item.id}`}
                    className="text-lg font-medium hover:text-rose-600 transition truncate"
                  >
                    {item.name}
                  </Link>
                  <p className="text-lg font-light shrink-0">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">Size: {item.size}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`quantity-${item.id}`} className="sr-only">
                      Quantity
                    </label>
                    <select
                      id={`quantity-${item.id}`}
                      value={item.quantity}
                      onChange={(e) =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            quantity: Number(e.target.value),
                          })
                        )
                      }
                      className="rounded-md border-gray-300 py-1.5 text-base focus:border-rose-500 focus:ring-rose-500"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-gray-400 hover:text-rose-600 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-base font-medium">Total</span>
                <span className="text-base font-medium">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>
            
            <Link
              to="/checkout"
              className="w-full bg-rose-600 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-rose-700 transition"
            >
              Proceed to Checkout
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
