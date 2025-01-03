import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product } from '../types';
import { firestoreServiceProduct } from '../services/firebase';

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    try {
      const products = await firestoreServiceProduct.getAll();
      return products;
    } catch (error: any) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (product: Omit<Product, 'id'>) => {
    return await firestoreServiceProduct.create(product);
  }
);

export const modifyProduct = createAsyncThunk(
  'products/modifyProduct',
  async ({ id, product }: { id: string; product: Product }) => {
    return await firestoreServiceProduct.update(id, product);
  }
);

export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async (id: string) => {
    await firestoreServiceProduct.delete(id);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      // Create product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update product
      .addCase(modifyProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
      })
      // Delete product
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
