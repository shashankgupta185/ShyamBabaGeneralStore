# 🛒 ShopCode Grocery - Full-Stack E-Commerce Platform

A production-ready grocery e-commerce platform inspired by **Blinkit / Flipkart Grocery UI**, built with **React + Express.js + Node.js + MySQL**.

---

## 📁 Project Structure

```
SHOPCODE/
├── backend/
│   ├── config/
│   │   └── db.js              # MySQL connection pool
│   ├── controllers/
│   │   ├── adminController.js  # Admin CRUD, stats
│   │   ├── authController.js   # JWT auth, register/login
│   │   ├── cartController.js   # Cart operations
│   │   ├── orderController.js  # Order management
│   │   └── productController.js# Product listing, search
│   ├── middleware/
│   │   ├── auth.js             # JWT auth & admin middleware
│   │   └── upload.js           # Multer image upload
│   ├── models/
│   │   └── schema.js           # MySQL table creation
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── seeds/
│   │   └── seed.js             # Seed data (72 products, 9 categories)
│   ├── uploads/                # Uploaded images
│   ├── .env                    # Environment config
│   ├── package.json
│   └── server.js               # Express server entry
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AdminLayout.jsx
    │   │   ├── CategoryGrid.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── ProductGrid.jsx
    │   │   └── StickyCartBar.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AdminLogin.jsx
    │   │   │   ├── AdminOrders.jsx
    │   │   │   └── AdminProducts.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CategoryPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── Home.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── SearchPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx
    │   └── index.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MySQL** 8.0+ (running locally)
- **npm** or **yarn**

### 1. Setup MySQL Database

```sql
CREATE DATABASE shopcode_grocery;
```

### 2. Configure Backend

```bash
cd backend

# Edit .env file if needed (default MySQL root with no password)
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=
# DB_NAME=shopcode_grocery

npm install
```

### 3. Seed the Database

```bash
npm run seed
```

This creates:
- **9 categories** (Atta, Ghee & Oil, Masala, Cold Drink, Chocolate, Chips & Namkeen, Noodles & Pasta, Dryfruits, Tea & Coffee)
- **72 realistic Indian grocery products** with prices, ratings, brands
- **Admin user**: `admin@shopcode.com` / `admin123`
- **Demo user**: `demo@shopcode.com` / `demo123`

### 4. Start Backend Server

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Setup & Start Frontend

```bash
cd ../frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

| Role     | Email                | Password  |
|----------|----------------------|-----------|
| Customer | demo@shopcode.com    | demo123   |
| Admin    | admin@shopcode.com   | admin123  |

---

## 🛍️ Features

### Customer Features
- ✅ Homepage with hero banner, category grid, featured products
- ✅ Category browsing with sidebar filters (price, brand, big packs)
- ✅ Product search
- ✅ Product cards with discount badges, ratings, add-to-cart
- ✅ Quantity increment/decrement controls
- ✅ Sticky bottom cart bar with free delivery indicator
- ✅ Full cart management
- ✅ Checkout with address form
- ✅ Order history with status tracking
- ✅ JWT authentication (register/login)
- ✅ Mobile-first responsive design

### Admin Features
- ✅ Admin dashboard with revenue, orders, products, users stats
- ✅ Sales chart (last 30 days)
- ✅ Top selling products
- ✅ Low stock alerts
- ✅ Full product CRUD (add, edit, delete)
- ✅ Product active/inactive toggle
- ✅ Image upload support
- ✅ Order management with delivery/payment status updates
- ✅ Status filtering

---

## 📡 API Endpoints

### Public
| Method | Endpoint              | Description           |
|--------|----------------------|-----------------------|
| GET    | /api/categories      | All categories        |
| GET    | /api/products        | All products          |
| GET    | /api/products/:slug  | Products by category  |
| GET    | /api/product/:id     | Single product        |
| GET    | /api/search?q=       | Search products       |

### Auth
| Method | Endpoint            | Description    |
|--------|---------------------|----------------|
| POST   | /api/auth/register  | Register       |
| POST   | /api/auth/login     | Login          |
| GET    | /api/auth/profile   | Get profile    |

### Cart (Auth required)
| Method | Endpoint          | Description      |
|--------|------------------|------------------|
| GET    | /api/cart         | Get cart         |
| POST   | /api/cart/add     | Add to cart      |
| POST   | /api/cart/update  | Update quantity  |
| DELETE | /api/cart/remove  | Remove item      |

### Orders (Auth required)
| Method | Endpoint            | Description      |
|--------|---------------------|------------------|
| POST   | /api/order/create   | Place order      |
| GET    | /api/order/history  | Order history    |

### Admin (Admin auth required)
| Method | Endpoint                     | Description         |
|--------|------------------------------|---------------------|
| GET    | /api/admin/dashboard/stats   | Dashboard stats     |
| GET    | /api/admin/products          | All products        |
| POST   | /api/admin/product/add       | Add product         |
| PUT    | /api/admin/product/update/:id| Update product      |
| DELETE | /api/admin/product/delete/:id| Delete product      |
| GET    | /api/admin/orders            | All orders          |
| PUT    | /api/admin/order/status/:id  | Update order status |

---

## 🗄️ Database Schema (MySQL)

### categories
| Column     | Type         |
|-----------|--------------|
| id        | INT PK AUTO  |
| name      | VARCHAR(100) |
| slug      | VARCHAR(120) |
| image     | VARCHAR(500) |
| is_active | TINYINT      |

### products
| Column         | Type          |
|---------------|---------------|
| id            | INT PK AUTO   |
| name          | VARCHAR(255)  |
| slug          | VARCHAR(280)  |
| category_id   | INT FK        |
| brand         | VARCHAR(150)  |
| weight        | VARCHAR(50)   |
| price         | DECIMAL(10,2) |
| discount_price| DECIMAL(10,2) |
| stock         | INT           |
| rating        | DECIMAL(2,1)  |
| total_reviews | INT           |
| images        | JSON          |
| description   | TEXT          |
| is_featured   | TINYINT       |
| is_active     | TINYINT       |

### users
| Column        | Type                     |
|--------------|--------------------------|
| id           | INT PK AUTO              |
| name         | VARCHAR(150)             |
| email        | VARCHAR(200) UNIQUE      |
| password_hash| VARCHAR(255)             |
| phone        | VARCHAR(20)              |
| role         | ENUM(customer, admin)    |
| addresses    | JSON                     |

### cart_items
| Column        | Type          |
|--------------|---------------|
| id           | INT PK AUTO   |
| user_id      | INT FK        |
| product_id   | INT FK        |
| quantity     | INT           |
| price_at_time| DECIMAL(10,2) |

### orders
| Column          | Type                                       |
|----------------|---------------------------------------------|
| id             | INT PK AUTO                                 |
| user_id        | INT FK                                      |
| items          | JSON                                        |
| total_amount   | DECIMAL(10,2)                               |
| payment_status | ENUM(pending, paid, failed, refunded)       |
| delivery_status| ENUM(processing, shipped, delivered, cancelled)|
| payment_method | VARCHAR(50)                                 |
| address        | JSON                                        |

---

## 🎨 Design System

- **Primary**: `#f8cb46` (Yellow - action buttons)
- **Green**: `#0c831f` (Add to cart, success)
- **Font**: Inter (Google Fonts)
- **Cards**: Rounded corners (12px), soft shadows
- **Mobile-first**: Flexbox + CSS Grid
- **Responsive**: 360px → 1280px+ support

---

## 📦 Product Categories & Sample Products

| Category         | Sample Products                                          |
|-----------------|----------------------------------------------------------|
| Atta            | Aashirvaad Shudh Chakki, Vedaka Dalia, Pillsbury Atta   |
| Ghee & Oil      | Fortune Mustard Oil, Saffola Gold, Amul Pure Ghee       |
| Masala           | MDH Chana Masala, Everest Garam Masala, Catch Turmeric  |
| Cold Drink       | Coca-Cola, Thums Up, Maaza Mango, Frooti               |
| Chocolate        | Dairy Milk Silk, Ferrero Rocher, KitKat, Snickers       |
| Chips & Namkeen  | Lay's Salted, Kurkure, Haldiram Bhujia, Bingo          |
| Noodles & Pasta  | Maggi 2-Min, Yippee, Borges Penne, Ching's Schezwan    |
| Dryfruits        | Happilo Almonds, Nutraj Cashews, Pistachios, Anjeer     |
| Tea & Coffee     | Tata Tea, Wagh Bakri, Nescafe Classic, Bru Instant      |

---

## License

MIT
