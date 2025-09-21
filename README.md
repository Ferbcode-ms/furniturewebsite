# 🪑 Fine Furnishings - Modern Furniture E-commerce Platform

A sophisticated, full-stack furniture e-commerce website built with Next.js 15, featuring a modern design, comprehensive admin panel, and seamless shopping experience.

## 🌟 Features

### 🛍️ Customer Features

- **Modern Homepage** - Elegant hero section with trending products and new arrivals
- **Product Catalog** - Comprehensive product browsing with advanced filtering
- **Smart Search** - Real-time product search with category filtering
- **Shopping Cart** - Persistent cart with add/remove/update functionality
- **Product Details** - Detailed product pages with specifications
- **Category Navigation** - Hierarchical category system with subcategories
- **Responsive Design** - Mobile-first design that works on all devices
- **Order Management** - Complete order placement and tracking system

### 🔧 Admin Features

- **Admin Dashboard** - Centralized management interface
- **Product Management** - Add, edit, delete products with detailed specifications
- **Category Management** - Create and manage product categories and subcategories
- **Order Management** - View, filter, and manage customer orders
- **Authentication** - Secure admin login system
- **Data Export** - Export orders and product data

### 🎨 Design Features

- **Modern UI** - Clean, minimalist design with smooth animations
- **Interactive Elements** - Circular text, curved loops, and scroll velocity effects
- **Typography** - Custom font combinations (Mulish + Anton)
- **Color Scheme** - Professional black and white with accent colors
- **Loading States** - Skeleton loaders and smooth transitions

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **SWR** - Data fetching and caching

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **MongoDB Driver** - Database connectivity
- **Zod** - Schema validation
- **JWT** - Authentication tokens

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Turbopack** - Fast bundling (dev mode)

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** database (local or cloud)
- **Git** (for cloning)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd furniture
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/furniture
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/furniture

# Database Name (optional, defaults to 'furniture')
MONGODB_DB=furniture

# Session Secret (for admin authentication)
SESSION_SECRET=your-super-secret-session-key-here
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/furniture`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Create Admin User

Run the admin seeding script to create an admin account:

```bash
# Replace with your desired email and password
MONGODB_URI="your_mongodb_uri" MONGODB_DB="furniture" node scripts/seedAdmin.js admin@example.com yourpassword
```

### 6. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
furniture/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   ├── categories/    # Category management
│   │   │   ├── orders/        # Order processing
│   │   │   └── products/      # Product management
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── products/          # Product pages
│   │   ├── order/             # Order pages
│   │   └── contact/           # Contact page
│   ├── components/            # React components
│   │   ├── cart/              # Shopping cart functionality
│   │   ├── layout/            # Layout components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utility functions
│   │   ├── mongodb.ts         # Database connection
│   │   ├── auth.ts            # Authentication logic
│   │   └── validations.ts     # Zod schemas
│   └── types/                 # TypeScript type definitions
├── scripts/                   # Database scripts
├── public/                    # Static assets
└── data-store/               # Data storage (if using file-based storage)
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
node scripts/seedAdmin.js <email> <password>  # Create admin user
node scripts/createIndexes.js                 # Create database indexes
```

## 🌐 Pages & Routes

### Public Pages

- **`/`** - Homepage with hero section and featured products
- **`/products`** - Product catalog with filtering and search
- **`/products/[id]`** - Individual product details
- **`/contact`** - Contact page
- **`/order`** - Order placement page

### Admin Pages

- **`/admin`** - Admin dashboard
- **`/admin/login`** - Admin login
- **`/admin/products`** - Product management
- **`/admin/categories`** - Category management
- **`/admin/orders`** - Order management

### API Endpoints

- **`/api/products`** - Product CRUD operations
- **`/api/categories`** - Category management
- **`/api/orders`** - Order processing
- **`/api/admin/*`** - Admin-specific endpoints

## 🛒 Shopping Cart Features

- **Add to Cart** - Add products with quantity selection
- **Cart Persistence** - Cart state maintained across sessions
- **Quantity Management** - Increase/decrease item quantities
- **Remove Items** - Remove individual items from cart
- **Cart Summary** - Real-time total calculation
- **Checkout Process** - Streamlined order placement

## 🎨 Custom Components

### Interactive Elements

- **CircularText** - Animated circular text component
- **CurvedLoop** - Curved marquee text effect
- **ScrollVelocity** - Velocity-based scrolling text
- **ProductCard** - Reusable product display component

### Layout Components

- **Navbar** - Responsive navigation with cart integration
- **Footer** - Conditional footer display
- **Container** - Consistent page layout wrapper
- **LoadingSpinner** - Various loading state components

## 🔐 Authentication & Security

- **Admin Authentication** - Secure login with session management
- **Middleware Protection** - Route protection for admin areas
- **Password Hashing** - SHA-256 password hashing
- **Session Management** - HTTP-only cookies for security

## 📱 Responsive Design

- **Mobile-First** - Optimized for mobile devices
- **Breakpoints** - Responsive design for all screen sizes
- **Touch-Friendly** - Optimized for touch interactions
- **Performance** - Optimized images and lazy loading

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🔧 Configuration

### Database Indexes

Run the index creation script for optimal performance:

```bash
node scripts/createIndexes.js
```

### Environment Variables

Ensure all required environment variables are set:

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB` - Database name (optional)
- `SESSION_SECRET` - Secret for session encryption

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**

   - Verify MongoDB is running
   - Check `MONGODB_URI` in `.env.local`
   - Ensure network access (for Atlas)

2. **Admin Login Issues**

   - Run the admin seeding script
   - Check session secret configuration
   - Clear browser cookies

3. **Build Errors**
   - Clear `.next` folder
   - Reinstall dependencies
   - Check TypeScript errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ using Next.js, React, and MongoDB**
