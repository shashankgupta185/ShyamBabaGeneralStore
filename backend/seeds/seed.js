const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { initDB } = require('../models/schema');
require('dotenv').config();

const categories = [
  { name: 'Atta', slug: 'atta', image: '🌾' },
  { name: 'Ghee & Oil', slug: 'ghee-oil', image: '🫒' },
  { name: 'Masala', slug: 'masala', image: '🌶️' },
  { name: 'Cold Drink', slug: 'cold-drink', image: '🥤' },
  { name: 'Chocolate', slug: 'chocolate', image: '🍫' },
  { name: 'Chips and Namkeen', slug: 'chips-namkeen', image: '🍿' },
  { name: 'Noodles and Pasta', slug: 'noodles-pasta', image: '🍜' },
  { name: 'Dryfruits', slug: 'dryfruits', image: '🥜' },
  { name: 'Tea & Coffee', slug: 'tea-coffee', image: '☕' },
];

const products = {
  'atta': [
    { name: 'Aashirvaad Shudh Chakki Atta', brand: 'Aashirvaad', weight: '5 kg', price: 295, discount_price: 249, rating: 4.5, total_reviews: 2340, stock: 150, description: 'Made from the finest quality wheat grains, Aashirvaad Shudh Chakki Atta gives you soft rotis every time.' },
    { name: 'Vedaka Dalia', brand: 'Vedaka', weight: '500 g', price: 55, discount_price: 42, rating: 4.2, total_reviews: 890, stock: 200, description: 'Premium quality broken wheat for daily healthy breakfast.' },
    { name: 'Select Sharbati Atta', brand: 'Select', weight: '5 kg', price: 320, discount_price: 275, rating: 4.4, total_reviews: 1560, stock: 120, description: 'Premium Sharbati wheat atta for soft and fluffy rotis.' },
    { name: 'Pillsbury Chakki Fresh Atta', brand: 'Pillsbury', weight: '5 kg', price: 280, discount_price: 239, rating: 4.3, total_reviews: 1890, stock: 180, description: 'Pillsbury Chakki Fresh Atta made from 100% whole wheat.' },
    { name: 'Rajdhani Besan', brand: 'Rajdhani', weight: '1 kg', price: 120, discount_price: 99, rating: 4.1, total_reviews: 670, stock: 250, description: 'Premium quality gram flour for pakoras and sweets.' },
    { name: 'Fortune Chakki Fresh Atta', brand: 'Fortune', weight: '10 kg', price: 520, discount_price: 459, rating: 4.6, total_reviews: 3200, stock: 80, description: 'Fresh chakki atta from Fortune for the healthiest rotis.' },
    { name: 'Patanjali Whole Wheat Atta', brand: 'Patanjali', weight: '5 kg', price: 250, discount_price: 219, rating: 4.0, total_reviews: 1120, stock: 160, description: 'Naturally processed whole wheat atta by Patanjali.' },
    { name: 'Aashirvaad Multigrain Atta', brand: 'Aashirvaad', weight: '5 kg', price: 350, discount_price: 299, rating: 4.4, total_reviews: 1780, stock: 100, description: 'Blend of 6 grains for healthy and tasty rotis.' },
  ],
  'ghee-oil': [
    { name: 'Fortune Mustard Oil', brand: 'Fortune', weight: '1 L', price: 195, discount_price: 169, rating: 4.3, total_reviews: 2100, stock: 200, description: 'Kachi Ghani pure mustard oil with strong aroma.' },
    { name: 'Saffola Gold Blended Oil', brand: 'Saffola', weight: '1 L', price: 199, discount_price: 179, rating: 4.4, total_reviews: 3450, stock: 180, description: 'Heart-healthy blended cooking oil with dual seed technology.' },
    { name: 'Ananda Pure Cow Ghee', brand: 'Ananda', weight: '1 L', price: 580, discount_price: 499, rating: 4.6, total_reviews: 1890, stock: 90, description: 'Pure cow ghee made from fresh cream for authentic taste.' },
    { name: 'Amul Pure Ghee', brand: 'Amul', weight: '1 L', price: 620, discount_price: 549, rating: 4.7, total_reviews: 4560, stock: 120, description: 'Amul Pure Ghee made from fresh cream. Rich aroma and taste.' },
    { name: 'Fortune Sunflower Oil', brand: 'Fortune', weight: '5 L', price: 750, discount_price: 649, rating: 4.3, total_reviews: 2780, stock: 100, description: 'Light and healthy refined sunflower oil for everyday cooking.' },
    { name: 'Dhara Mustard Oil', brand: 'Dhara', weight: '1 L', price: 180, discount_price: 155, rating: 4.2, total_reviews: 1560, stock: 220, description: 'Pure kachi ghani mustard oil for Indian cooking.' },
    { name: 'Patanjali Cow Ghee', brand: 'Patanjali', weight: '500 ml', price: 320, discount_price: 280, rating: 4.1, total_reviews: 980, stock: 150, description: 'Desi cow ghee from Patanjali for purity and taste.' },
    { name: 'Oleev Active Olive Oil', brand: 'Oleev', weight: '1 L', price: 499, discount_price: 429, rating: 4.0, total_reviews: 670, stock: 70, description: 'Olive oil blended with rice bran for healthier cooking.' },
  ],
  'masala': [
    { name: 'MDH Chana Masala', brand: 'MDH', weight: '100 g', price: 68, discount_price: 55, rating: 4.5, total_reviews: 3200, stock: 300, description: 'Authentic blend of spices for perfect chana masala.' },
    { name: 'Everest Garam Masala', brand: 'Everest', weight: '100 g', price: 75, discount_price: 62, rating: 4.6, total_reviews: 4100, stock: 350, description: 'Aromatic garam masala blend for rich Indian dishes.' },
    { name: 'Catch Turmeric Powder', brand: 'Catch', weight: '200 g', price: 55, discount_price: 45, rating: 4.3, total_reviews: 1890, stock: 400, description: 'Pure turmeric powder for authentic color and flavor.' },
    { name: 'Tata Sampann Coriander Powder', brand: 'Tata Sampann', weight: '200 g', price: 72, discount_price: 59, rating: 4.4, total_reviews: 1560, stock: 280, description: 'Unpolished coriander powder crafted by chef Sanjeev Kapoor.' },
    { name: 'MDH Deggi Mirch', brand: 'MDH', weight: '100 g', price: 62, discount_price: 49, rating: 4.3, total_reviews: 2340, stock: 320, description: 'Bright red chili powder for perfect color and mild taste.' },
    { name: 'Everest Kitchen King Masala', brand: 'Everest', weight: '100 g', price: 72, discount_price: 59, rating: 4.5, total_reviews: 2890, stock: 260, description: 'All-purpose masala blend for everyday cooking.' },
    { name: 'Catch Red Chilli Powder', brand: 'Catch', weight: '200 g', price: 85, discount_price: 72, rating: 4.2, total_reviews: 1230, stock: 300, description: 'Hot and spicy red chilli powder for fiery dishes.' },
    { name: 'MDH Pav Bhaji Masala', brand: 'MDH', weight: '100 g', price: 65, discount_price: 52, rating: 4.6, total_reviews: 2670, stock: 280, description: 'Special blend for making authentic Mumbai pav bhaji.' },
  ],
  'cold-drink': [
    { name: 'Coca-Cola Original', brand: 'Coca-Cola', weight: '750 ml', price: 40, discount_price: 35, rating: 4.3, total_reviews: 5600, stock: 500, description: 'The classic refreshing taste of Coca-Cola.' },
    { name: 'Pepsi Black', brand: 'Pepsi', weight: '750 ml', price: 45, discount_price: 38, rating: 4.1, total_reviews: 2340, stock: 400, description: 'Zero sugar bold cola taste with maximum refreshment.' },
    { name: 'Sprite Lime Flavoured', brand: 'Sprite', weight: '750 ml', price: 40, discount_price: 35, rating: 4.2, total_reviews: 3890, stock: 450, description: 'Clear, crisp lemon-lime flavored soft drink.' },
    { name: 'Thums Up', brand: 'Thums Up', weight: '750 ml', price: 40, discount_price: 35, rating: 4.4, total_reviews: 4500, stock: 480, description: 'Strong cola taste for the bold ones. Taste the thunder!' },
    { name: 'Maaza Mango Drink', brand: 'Maaza', weight: '600 ml', price: 35, discount_price: 30, rating: 4.3, total_reviews: 3200, stock: 380, description: 'Rich and juicy mango flavored drink.' },
    { name: 'Limca Lime n Lemoni', brand: 'Limca', weight: '750 ml', price: 40, discount_price: 34, rating: 4.1, total_reviews: 1890, stock: 350, description: 'Fresh lime and lemon flavored carbonated drink.' },
    { name: 'Frooti Mango Drink', brand: 'Frooti', weight: '600 ml', price: 30, discount_price: 25, rating: 4.2, total_reviews: 2780, stock: 420, description: 'Mango Frooti, fresh and juicy! India\'s favorite mango drink.' },
    { name: 'Real Fruit Power Mixed Fruit', brand: 'Real', weight: '1 L', price: 110, discount_price: 95, rating: 4.4, total_reviews: 1560, stock: 200, description: 'Made from real fruit pulp. No added preservatives.' },
  ],
  'chocolate': [
    { name: 'Cadbury Dairy Milk Silk', brand: 'Cadbury', weight: '150 g', price: 175, discount_price: 149, rating: 4.7, total_reviews: 8900, stock: 300, description: 'Smooth, creamy, and irresistibly chocolatey Dairy Milk Silk.' },
    { name: 'KitKat Wafer Bar', brand: 'Nestlé', weight: '37.3 g (Pack of 6)', price: 120, discount_price: 99, rating: 4.4, total_reviews: 3450, stock: 400, description: 'Crispy wafer fingers covered in smooth chocolate.' },
    { name: '5 Star Chocolate Bar', brand: 'Cadbury', weight: '40 g (Pack of 10)', price: 150, discount_price: 120, rating: 4.3, total_reviews: 2100, stock: 350, description: 'Soft caramel and nougat covered in milk chocolate.' },
    { name: 'Ferrero Rocher', brand: 'Ferrero', weight: '16 pcs', price: 599, discount_price: 499, rating: 4.8, total_reviews: 5670, stock: 80, description: 'Premium wafer ball filled with hazelnut cream and whole hazelnut.' },
    { name: 'Amul Dark Chocolate', brand: 'Amul', weight: '150 g', price: 120, discount_price: 99, rating: 4.2, total_reviews: 1890, stock: 250, description: '55% cocoa dark chocolate for the dark chocolate lovers.' },
    { name: 'Cadbury Celebrations Pack', brand: 'Cadbury', weight: '136 g', price: 180, discount_price: 149, rating: 4.5, total_reviews: 4560, stock: 200, description: 'Assorted chocolates pack perfect for gifting.' },
    { name: 'Munch Crunch Bar', brand: 'Nestlé', weight: '32 g (Pack of 12)', price: 120, discount_price: 99, rating: 4.1, total_reviews: 1560, stock: 380, description: 'Crunchy wafer coated with smooth chocolate.' },
    { name: 'Snickers Bar', brand: 'Mars', weight: '50 g (Pack of 6)', price: 240, discount_price: 199, rating: 4.5, total_reviews: 3200, stock: 220, description: 'Loaded with peanuts, caramel, and nougat in milk chocolate.' },
  ],
  'chips-namkeen': [
    { name: 'Lay\'s Classic Salted Chips', brand: 'Lay\'s', weight: '130 g', price: 50, discount_price: 40, rating: 4.3, total_reviews: 4500, stock: 400, description: 'Crispy, thin potato chips with classic salted flavor.' },
    { name: 'Kurkure Masala Munch', brand: 'Kurkure', weight: '115 g', price: 40, discount_price: 32, rating: 4.4, total_reviews: 5600, stock: 450, description: 'Crunchy, spicy, and tangy namkeen snack.' },
    { name: 'Haldiram Aloo Bhujia', brand: 'Haldiram\'s', weight: '400 g', price: 140, discount_price: 119, rating: 4.5, total_reviews: 3200, stock: 250, description: 'Classic aloo bhujia namkeen for tea-time snacking.' },
    { name: 'Uncle Chipps Spicy Treat', brand: 'Uncle Chipps', weight: '130 g', price: 45, discount_price: 35, rating: 4.2, total_reviews: 2100, stock: 380, description: 'Thick cut spicy potato chips with bold masala flavor.' },
    { name: 'Bingo Mad Angles Achari Masti', brand: 'Bingo', weight: '130 g', price: 40, discount_price: 30, rating: 4.3, total_reviews: 2890, stock: 350, description: 'Triangular chips with achari (pickle) flavor.' },
    { name: 'Haldiram Moong Dal', brand: 'Haldiram\'s', weight: '400 g', price: 125, discount_price: 105, rating: 4.4, total_reviews: 2340, stock: 280, description: 'Crispy fried moong dal namkeen, a classic Indian snack.' },
    { name: 'Lay\'s Magic Masala', brand: 'Lay\'s', weight: '130 g', price: 50, discount_price: 40, rating: 4.5, total_reviews: 6700, stock: 420, description: 'India\'s favorite masala flavored potato chips.' },
    { name: 'Bikano Bhujia Sev', brand: 'Bikano', weight: '400 g', price: 130, discount_price: 110, rating: 4.3, total_reviews: 1780, stock: 200, description: 'Traditional bhujia sev made from besan and spices.' },
  ],
  'noodles-pasta': [
    { name: 'Maggi 2-Minute Masala Noodles', brand: 'Maggi', weight: '70 g (Pack of 12)', price: 168, discount_price: 144, rating: 4.5, total_reviews: 12000, stock: 500, description: 'India\'s favorite instant noodles with masala tastemaker.' },
    { name: 'Yippee Noodles Magic Masala', brand: 'Yippee', weight: '70 g (Pack of 12)', price: 168, discount_price: 140, rating: 4.3, total_reviews: 4500, stock: 400, description: 'Long, non-sticky noodles with unique masala taste.' },
    { name: 'Top Ramen Curry Noodles', brand: 'Top Ramen', weight: '70 g (Pack of 8)', price: 120, discount_price: 99, rating: 4.1, total_reviews: 2100, stock: 350, description: 'Smooth curry flavored instant noodles.' },
    { name: 'Borges Penne Pasta', brand: 'Borges', weight: '500 g', price: 160, discount_price: 135, rating: 4.3, total_reviews: 890, stock: 200, description: 'Durum wheat penne pasta imported from Italy.' },
    { name: 'Del Monte Fusilli Pasta', brand: 'Del Monte', weight: '500 g', price: 120, discount_price: 99, rating: 4.2, total_reviews: 1230, stock: 250, description: 'Premium quality fusilli pasta made from durum wheat.' },
    { name: 'Maggi Pazzta Cheese Macaroni', brand: 'Maggi', weight: '70 g (Pack of 6)', price: 150, discount_price: 125, rating: 4.0, total_reviews: 1890, stock: 300, description: 'Instant pasta with cheesy macaroni flavor.' },
    { name: 'Ching\'s Schezwan Noodles', brand: 'Ching\'s', weight: '60 g (Pack of 10)', price: 150, discount_price: 125, rating: 4.2, total_reviews: 2340, stock: 280, description: 'Instant noodles with spicy schezwan flavor.' },
    { name: 'Disano Spaghetti Pasta', brand: 'Disano', weight: '500 g', price: 110, discount_price: 89, rating: 4.1, total_reviews: 780, stock: 220, description: 'Pure durum wheat spaghetti pasta for authentic Italian dishes.' },
  ],
  'dryfruits': [
    { name: 'Happilo Premium Almonds', brand: 'Happilo', weight: '500 g', price: 450, discount_price: 379, rating: 4.6, total_reviews: 5600, stock: 150, description: 'Premium quality California almonds, rich in nutrients.' },
    { name: 'Nutraj Cashew Nuts W320', brand: 'Nutraj', weight: '500 g', price: 520, discount_price: 449, rating: 4.5, total_reviews: 3200, stock: 120, description: 'Whole cashew nuts W320 grade, perfect for snacking.' },
    { name: 'Vedaka Raisins', brand: 'Vedaka', weight: '500 g', price: 220, discount_price: 179, rating: 4.3, total_reviews: 1890, stock: 200, description: 'Seedless green raisins, naturally sweet and nutritious.' },
    { name: 'Happilo Pistachios Roasted & Salted', brand: 'Happilo', weight: '500 g', price: 680, discount_price: 569, rating: 4.7, total_reviews: 2340, stock: 80, description: 'Roasted and lightly salted pistachios for perfect crunch.' },
    { name: 'Amazon Brand Walnuts', brand: 'Vedaka', weight: '250 g', price: 320, discount_price: 269, rating: 4.4, total_reviews: 1560, stock: 130, description: 'Premium quality walnut kernels, omega-3 rich brain food.' },
    { name: 'Nutraj Mixed Dry Fruits', brand: 'Nutraj', weight: '500 g', price: 599, discount_price: 499, rating: 4.5, total_reviews: 2100, stock: 100, description: 'Healthy mix of almonds, cashews, raisins, and pistachios.' },
    { name: 'Happilo Dates Kalmi', brand: 'Happilo', weight: '350 g', price: 199, discount_price: 159, rating: 4.3, total_reviews: 1230, stock: 180, description: 'Soft and sweet Kalmi dates, naturally packed with energy.' },
    { name: 'Farmley Premium Anjeer', brand: 'Farmley', weight: '200 g', price: 280, discount_price: 229, rating: 4.4, total_reviews: 890, stock: 140, description: 'Premium dried figs, excellent source of fiber and minerals.' },
  ],
  'tea-coffee': [
    { name: 'Tata Tea Premium', brand: 'Tata Tea', weight: '500 g', price: 260, discount_price: 225, rating: 4.5, total_reviews: 6700, stock: 300, description: 'Rich and aromatic premium blend tea from Tata.' },
    { name: 'Wagh Bakri Premium Leaf Tea', brand: 'Wagh Bakri', weight: '500 g', price: 280, discount_price: 239, rating: 4.4, total_reviews: 3450, stock: 250, description: 'Premium leaf tea with strong and rich taste.' },
    { name: 'Society Assam Leaf Tea', brand: 'Society', weight: '500 g', price: 240, discount_price: 199, rating: 4.3, total_reviews: 2100, stock: 220, description: 'Strong Assam CTC tea for the perfect chai.' },
    { name: 'Nescafe Classic Coffee', brand: 'Nescafé', weight: '200 g', price: 450, discount_price: 389, rating: 4.6, total_reviews: 8900, stock: 200, description: 'Pure soluble coffee for a rich and smooth cup of coffee.' },
    { name: 'Bru Instant Coffee', brand: 'Bru', weight: '200 g', price: 400, discount_price: 349, rating: 4.4, total_reviews: 4560, stock: 180, description: 'Instant coffee with a rich, smooth taste and roasted aroma.' },
    { name: 'Taj Mahal Tea Bags', brand: 'Taj Mahal', weight: '100 bags', price: 310, discount_price: 269, rating: 4.5, total_reviews: 3200, stock: 200, description: 'Premium tea bags for a perfect cup of tea every time.' },
    { name: 'Red Label Natural Care Tea', brand: 'Red Label', weight: '500 g', price: 290, discount_price: 249, rating: 4.3, total_reviews: 2340, stock: 260, description: 'Tea blended with 5 Ayurvedic herbs for daily wellness.' },
    { name: 'Continental Xtra Instant Coffee', brand: 'Continental', weight: '200 g', price: 375, discount_price: 319, rating: 4.2, total_reviews: 1560, stock: 170, description: 'Freeze-dried instant coffee for an intense coffee experience.' },
  ],
};

const seed = async () => {
  try {
    await initDB();
    const conn = await pool.getConnection();

    console.log('🌱 Seeding categories...');
    const categoryMap = {};
    for (const cat of categories) {
      const [existing] = await conn.query('SELECT id FROM categories WHERE slug = ?', [cat.slug]);
      if (existing.length > 0) {
        categoryMap[cat.slug] = existing[0].id;
      } else {
        const [result] = await conn.query(
          'INSERT INTO categories (name, slug, image) VALUES (?, ?, ?)',
          [cat.name, cat.slug, cat.image]
        );
        categoryMap[cat.slug] = result.insertId;
      }
    }
    console.log('✅ Categories seeded');

    console.log('🌱 Seeding products...');
    for (const [catSlug, prods] of Object.entries(products)) {
      const categoryId = categoryMap[catSlug];
      for (const prod of prods) {
        const slug = prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const [existing] = await conn.query('SELECT id FROM products WHERE slug = ?', [slug]);
        if (existing.length > 0) continue;

        await conn.query(
          `INSERT INTO products (name, slug, category_id, brand, weight, price, discount_price, stock, rating, total_reviews, images, description, is_featured, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            prod.name, slug, categoryId, prod.brand, prod.weight,
            prod.price, prod.discount_price, prod.stock,
            prod.rating, prod.total_reviews,
            JSON.stringify([`https://via.placeholder.com/300x300.png?text=${encodeURIComponent(prod.name.substring(0, 20))}`]),
            prod.description,
            prod.rating >= 4.5 ? 1 : 0,
          ]
        );
      }
    }
    console.log('✅ Products seeded');

    console.log('🌱 Creating admin user...');
    const adminEmail = 'admin@shopcode.com';
    const [existingAdmin] = await conn.query('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (existingAdmin.length === 0) {
      const hash = await bcrypt.hash('admin123', 12);
      await conn.query(
        'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Admin', adminEmail, hash, '9999999999', 'admin']
      );
      console.log('✅ Admin user created (admin@shopcode.com / admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    console.log('🌱 Creating demo customer...');
    const demoEmail = 'demo@shopcode.com';
    const [existingDemo] = await conn.query('SELECT id FROM users WHERE email = ?', [demoEmail]);
    if (existingDemo.length === 0) {
      const hash = await bcrypt.hash('demo123', 12);
      await conn.query(
        'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
        ['Demo User', demoEmail, hash, '8888888888', 'customer']
      );
      console.log('✅ Demo user created (demo@shopcode.com / demo123)');
    } else {
      console.log('ℹ️ Demo user already exists');
    }

    conn.release();
    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
