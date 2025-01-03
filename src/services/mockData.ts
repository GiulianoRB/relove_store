import { Product } from '../types';
import { ProductService } from './productService';

// Helper function to generate products
const generateProducts = (): Omit<Product, 'id'>[] => {
  const categories = ['Denim', 'Tops', 'Dresses', 'Outerwear', 'Accessories'];
  const genders = ['Women', 'Men', 'Unisex'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const colors = ['Black', 'White', 'Blue', 'Brown', 'Green', 'Red', 'Pink', 'Navy', 'Gray', 'Beige'];
  const conditions = ['New with tags', 'Like new', 'Good', 'Fair'];
  
  const products: Omit<Product, 'id'>[] = [];
  
  // Generate 100 products
  for (let i = 0; i < 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const price = Math.floor(Math.random() * (150000 - 15000) + 15000);
    
    let images: string[] = [];
    switch (category.toLowerCase()) {
      case 'denim':
        images = [
          'https://images.unsplash.com/photo-1542272604-787c3835535d',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
          'https://images.unsplash.com/photo-1542272604-787c3835535d'
        ];
        break;
      case 'tops':
        images = [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
          'https://images.unsplash.com/photo-1618354691438-25bc04584c23',
          'https://images.unsplash.com/photo-1618354691229-88d47f285158'
        ];
        break;
      case 'dresses':
        images = [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
          'https://unsplash.com/es/fotos/mujer-con-conjunto-de-sujetador-y-bragas-de-encaje-blanco-mqBEBXiBQvI',
          'https://images.unsplash.com/photo-1595777457585-616e88ab67d0'
        ];
        break;
      case 'outerwear':
        images = [
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
          'https://images.unsplash.com/photo-1578932750294-f5075e85f44a',
          'https://images.unsplash.com/photo-1578932750294-f5075e85f44a'
        ];
        break;
      case 'accessories':
        images = [
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7c',
          'https://images.unsplash.com/photo-1591561954557-26941169b49e',
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'
        ];
        break;
    }

    const descriptions = [
      'A timeless piece that combines classic style with modern comfort. Perfect for any occasion, this item has been carefully preserved and shows minimal signs of wear.',
      'Expertly crafted with attention to detail, this vintage find brings unique character to your wardrobe. The quality of materials and construction is evident in every aspect.',
      'A rare find in excellent condition, this piece exemplifies the craftsmanship of its era. The design remains relevant and stylish for today\'s fashion-conscious consumer.',
      'This carefully curated piece brings together style and sustainability. Its classic design and quality construction make it a valuable addition to any wardrobe.',
      'A stunning example of vintage fashion at its finest. This piece has been professionally cleaned and maintained, ready to become a staple in your collection.'
    ];

    products.push({
      name: `Vintage ${category} ${Math.floor(Math.random() * 1000)}`,
      price,
      size,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      images,
      available: Math.random() > 0.2,
      category,
      gender,
      color,
      condition
    });
  }

  return products;
};

// Function to seed the database
export const seedDatabase = async () => {
  try {
    const products = generateProducts();
    await ProductService.seedProducts(products);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
