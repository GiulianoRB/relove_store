import { firestoreService } from './firebase';
import { Product } from '../types';

export const ProductService = {

  getProducts: async (): Promise<Product[]> => {
    const response = await firestoreService.getAll<Product>('products');
    return response
  },

  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await firestoreService.create<Omit<Product, 'id'>, Product>('products', product);
    return response
  },

  updateProduct: async (id: string, product: Product): Promise<Product> => {
    const response = await firestoreService.update<Product>('products', id, product);
    return response
  },

  deleteProduct: async (id: string): Promise<void> => {
    await firestoreService.delete('products', id)
  },

  seedProducts: async (products: Omit<Product, 'id'>[]): Promise<void> => {
    const batch = products.map(product => 
      firestoreService.create('products', product)
    );
    await Promise.all(batch);
  }

};
