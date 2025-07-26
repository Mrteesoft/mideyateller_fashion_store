# Mideyateller Fashion Store

A modern, professional fashion e-commerce website built with Next.js and Node.js, featuring a world-class user interface with full mobile responsiveness and comprehensive backend functionality.

## 🌟 Features

### Frontend
- **Modern UI/UX**: Professional design with glassmorphism effects and smooth animations
- **Dynamic Carousel**: World-class product showcase with auto-play and manual navigation
- **Fully Responsive Design**: Optimized for desktop, tablet, and mobile devices with clean mobile UI
- **Mobile-First Navigation**: Hamburger menu with smooth animations and touch-friendly interface
- **Enhanced Typewriter Effect**: Smooth character-by-character typing animation
- **Interactive Navigation**: 7-section navigation with smooth scrolling and mobile optimization
- **Professional Sections**: Hero, Collections, About, Services, Custom, Testimonials, Contact
- **Mobile Performance**: Optimized touch targets, smooth scrolling, and accessibility features

### Backend
- **RESTful API**: Complete Node.js/Express backend with MongoDB
- **Authentication**: JWT-based user authentication and authorization
- **Product Management**: Full CRUD operations for products and categories
- **Order System**: Complete order processing and management
- **Custom Requests**: Bespoke dress request system with file uploads
- **Contact System**: Contact form and newsletter subscription
- **Admin Dashboard**: Comprehensive admin panel with analytics

## 🚀 Tech Stack

### Frontend
- **Next.js 14**: React framework with static export for optimal performance
- **React 18**: Modern React with hooks and context
- **CSS3 Modules**: Modular styling with advanced animations and mobile optimization
- **Google Fonts**: Playfair Display and Inter typography
- **Mobile-First Design**: Responsive breakpoints and touch-optimized interface

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **Bcrypt**: Password hashing and security
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

## 📱 Mobile Features

### Responsive Design
- **Mobile-First Approach**: Designed for mobile devices first, then scaled up
- **Touch-Friendly Interface**: 44px minimum touch targets for better usability
- **Hamburger Navigation**: Smooth slide-in mobile menu with staggered animations
- **Optimized Images**: Responsive images that adapt to screen size
- **Clean Mobile UI**: Simplified layout for better mobile experience

### Performance Optimizations
- **Static Export**: Pre-rendered HTML for faster loading
- **Optimized Assets**: Compressed images and minified CSS/JS
- **Smooth Scrolling**: Hardware-accelerated scrolling for better performance
- **Reduced Motion Support**: Respects user's motion preferences
- **Fast Loading**: Optimized for mobile networks

### Accessibility
- **Focus Management**: Clear focus indicators for keyboard navigation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: High contrast ratios for better readability
- **Touch Accessibility**: Large touch targets and proper spacing

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/Mrteesoft/mideyateller_fashion_store.git
cd mideyateller_fashion_store

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

## 🌐 Deployment

### Netlify (Frontend)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `out`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Heroku (Backend)
1. Create a Heroku app
2. Connect to your GitHub repository
3. Set environment variables
4. Deploy the `server` directory

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=your-backend-api-url
NEXT_PUBLIC_SITE_URL=your-frontend-url
```

#### Backend (.env)
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
PORT=3002
NODE_ENV=production
```

## 📱 Mobile Testing

### Testing Checklist
- [ ] Navigation menu works smoothly on mobile
- [ ] All touch targets are at least 44px
- [ ] Carousel swipes work on touch devices
- [ ] Forms are easy to use on mobile
- [ ] Text is readable without zooming
- [ ] Images load properly on mobile
- [ ] Performance is good on slow networks

### Browser Testing
- Chrome Mobile
- Safari iOS
- Firefox Mobile
- Samsung Internet
- Edge Mobile

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user orders

### Custom Requests
- `POST /api/custom-requests` - Create custom request
- `GET /api/custom-requests/my-requests` - Get user requests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mrteesoft**
- GitHub: [@Mrteesoft](https://github.com/Mrteesoft)
- Project: [Mideyateller Fashion Store](https://github.com/Mrteesoft/mideyateller_fashion_store)

## 🙏 Acknowledgments

- Design inspiration from modern fashion e-commerce platforms
- Icons from Heroicons and custom SVG designs
- Typography from Google Fonts (Playfair Display, Inter)
- Mobile-first design principles
- Built with love for the fashion industry in Nigeria 🇳🇬

---

**🎊 Experience the world-class mobile-responsive Mideyateller Fashion Store! 📱✨**
