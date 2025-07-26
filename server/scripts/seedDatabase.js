const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new User({
      name: 'Admin User',
      email: 'admin@mideyateller.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890'
    });
    await admin.save();
    console.log('Admin user created');

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 12);
    const customer = new User({
      name: 'Jane Doe',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
      phone: '+1987654321',
      preferences: {
        size: 'M',
        favoriteColors: ['black', 'red', 'blue'],
        style: 'modern'
      }
    });
    await customer.save();
    console.log('Sample customer created');

    // Create sample products
    const products = [
      {
        name: 'Elegant Evening Dress',
        description: 'A stunning black evening dress perfect for special occasions. Made with premium silk fabric and featuring intricate beadwork.',
        price: 299.99,
        category: 'evening',
        sizes: [
          { size: 'S', stock: 5 },
          { size: 'M', stock: 8 },
          { size: 'L', stock: 6 },
          { size: 'XL', stock: 3 }
        ],
        colors: [
          { name: 'Black', hexCode: '#000000', stock: 15 },
          { name: 'Navy Blue', hexCode: '#000080', stock: 7 }
        ],
        images: [
          { url: '/images/dress1.svg', alt: 'Elegant Evening Dress', isPrimary: true }
        ],
        materials: ['Silk', 'Polyester'],
        careInstructions: 'Dry clean only',
        tags: ['elegant', 'evening', 'formal', 'silk'],
        featured: true,
        seo: {
          metaTitle: 'Elegant Evening Dress - Mideyateller Fashion',
          metaDescription: 'Shop our stunning black evening dress perfect for special occasions.',
          slug: 'elegant-evening-dress'
        }
      },
      {
        name: 'Casual Summer Dress',
        description: 'Light and breezy summer dress perfect for everyday wear. Comfortable cotton blend with a flattering A-line silhouette.',
        price: 89.99,
        category: 'casual',
        sizes: [
          { size: 'XS', stock: 4 },
          { size: 'S', stock: 10 },
          { size: 'M', stock: 12 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 5 }
        ],
        colors: [
          { name: 'White', hexCode: '#FFFFFF', stock: 20 },
          { name: 'Light Blue', hexCode: '#ADD8E6', stock: 15 },
          { name: 'Pink', hexCode: '#FFC0CB', stock: 4 }
        ],
        images: [
          { url: '/images/dress2.svg', alt: 'Casual Summer Dress', isPrimary: true }
        ],
        materials: ['Cotton', 'Elastane'],
        careInstructions: 'Machine wash cold, tumble dry low',
        tags: ['casual', 'summer', 'comfortable', 'cotton'],
        featured: true,
        seo: {
          metaTitle: 'Casual Summer Dress - Mideyateller Fashion',
          metaDescription: 'Comfortable and stylish summer dress for everyday wear.',
          slug: 'casual-summer-dress'
        }
      },
      {
        name: 'Wedding Guest Dress',
        description: 'Perfect dress for wedding celebrations. Sophisticated design with delicate lace details and a midi length.',
        price: 199.99,
        category: 'formal',
        sizes: [
          { size: 'S', stock: 6 },
          { size: 'M', stock: 9 },
          { size: 'L', stock: 7 },
          { size: 'XL', stock: 4 }
        ],
        colors: [
          { name: 'Blush Pink', hexCode: '#F8BBD9', stock: 12 },
          { name: 'Sage Green', hexCode: '#9CAF88', stock: 8 },
          { name: 'Dusty Blue', hexCode: '#6B8CAE', stock: 6 }
        ],
        images: [
          { url: '/images/dress3.svg', alt: 'Wedding Guest Dress', isPrimary: true }
        ],
        materials: ['Chiffon', 'Lace', 'Polyester'],
        careInstructions: 'Hand wash or dry clean',
        tags: ['wedding', 'formal', 'lace', 'midi'],
        featured: true,
        seo: {
          metaTitle: 'Wedding Guest Dress - Mideyateller Fashion',
          metaDescription: 'Sophisticated wedding guest dress with delicate lace details.',
          slug: 'wedding-guest-dress'
        }
      },
      {
        name: 'Bohemian Maxi Dress',
        description: 'Free-spirited bohemian maxi dress with flowing fabric and intricate patterns. Perfect for festivals and casual outings.',
        price: 149.99,
        category: 'casual',
        sizes: [
          { size: 'S', stock: 7 },
          { size: 'M', stock: 10 },
          { size: 'L', stock: 8 },
          { size: 'XL', stock: 5 }
        ],
        colors: [
          { name: 'Floral Print', hexCode: '#FF6B6B', stock: 18 },
          { name: 'Earth Tones', hexCode: '#8B4513', stock: 12 }
        ],
        images: [
          { url: '/images/dress4.svg', alt: 'Bohemian Maxi Dress', isPrimary: true }
        ],
        materials: ['Rayon', 'Cotton'],
        careInstructions: 'Machine wash cold, hang dry',
        tags: ['bohemian', 'maxi', 'floral', 'festival'],
        featured: true,
        seo: {
          metaTitle: 'Bohemian Maxi Dress - Mideyateller Fashion',
          metaDescription: 'Free-spirited bohemian maxi dress perfect for festivals.',
          slug: 'bohemian-maxi-dress'
        }
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }
    console.log('Sample products created');

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@mideyateller.com / admin123');
    console.log('Customer: customer@example.com / customer123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
