const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'aulait.db');

let db = null;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Database connection error:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Connected to SQLite database');
    });

    // Enable foreign keys and WAL mode for better performance
    db.run('PRAGMA foreign_keys = ON');
    db.run('PRAGMA journal_mode = WAL');

    // Create tables
    const createTables = `
      -- Content settings table (stores all website content)
      CREATE TABLE IF NOT EXISTS content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content_type TEXT NOT NULL UNIQUE,
        content_data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Categories table
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Products table
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        category_id TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
      );

      -- Gallery images table
      CREATE TABLE IF NOT EXISTS gallery_images (
        id TEXT PRIMARY KEY,
        title TEXT,
        image_url TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Site settings table
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setting_key TEXT NOT NULL UNIQUE,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_content_type ON content(content_type);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_gallery_order ON gallery_images(display_order);
    `;

    db.exec(createTables, (err) => {
      if (err) {
        console.error('❌ Error creating tables:', err.message);
        reject(err);
        return;
      }
      console.log('✅ Database tables created/verified');

      // Insert default content if not exists
      insertDefaultContent()
        .then(() => {
          console.log('✅ Default content inserted');
          resolve();
        })
        .catch(reject);
    });
  });
};

const insertDefaultContent = () => {
  return new Promise((resolve, reject) => {
    const defaultContent = {
      logo: {
        url: 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/logo/logo'
      },
      hero: {
        title: 'A Taste of Liquid Gold',
        subtitle: 'Experience coffee that transcends the ordinary. Crafted with passion, brewed to perfection.',
        cta: 'Explore Our Menu',
        video: ''
      },
      about: {
        title: 'About Au Lait',
        content: 'We are passionate about delivering the finest coffee experience to our customers.',
        image: ''
      },
      contact: {
        address: '123 Coffee Street, Bean City',
        phone: '+1 (555) 123-4567',
        email: 'info@aulait.com',
        hours: 'Mon-Fri: 7AM-8PM, Sat-Sun: 8AM-6PM'
      },
      gallery: {
        title: 'Our Gallery',
        images: []
      },
      settings: {
        siteTitle: 'Au Lait Coffee Shop',
        favicon: ''
      },
      categories: [
        {
          id: 'hot-drinks',
          name: 'Hot Drinks',
          description: 'Our signature hot coffee beverages'
        },
        {
          id: 'cold-drinks',
          name: 'Cold Drinks',
          description: 'Refreshing cold coffee drinks'
        },
        {
          id: 'savory-crepes',
          name: 'Savory Crepes',
          description: 'Delicious savory crepe options'
        },
        {
          id: 'sweet-crepes',
          name: 'Sweet Crepes',
          description: 'Sweet and decadent crepe varieties'
        },
        {
          id: 'specialty-drinks',
          name: 'Specialty Drinks',
          description: 'Unique and specialty beverage options'
        },
        {
          id: 'smoothies',
          name: 'Smoothies',
          description: 'Fresh and healthy smoothie options'
        },
        {
          id: 'breakfast-sandwich',
          name: 'Breakfast Sandwich',
          description: 'Breakfast sandwich options'
        },
        {
          id: 'brunch',
          name: 'Brunch',
          description: 'Brunch items and specials'
        },
        {
          id: 'sandwich',
          name: 'Sandwich',
          description: 'Lunch and dinner sandwich options'
        },
        {
          id: 'omelets',
          name: 'Omelets',
          description: 'Fluffy omelet varieties'
        },
        {
          id: 'soup-salads',
          name: 'Soup & Salads',
          description: 'Fresh soups and salads'
        },
        {
          id: 'benedicts',
          name: 'Benedicts',
          description: 'Eggs Benedict variations'
        }
      ],
      products: [
        // Hot Drinks
        {
          id: 'cafe-au-lait-12',
          name: 'Cafe Au Lait',
          price: '4.50',
          description: 'Rich coffee and steamed milk in perfect harmony',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'cafe-au-lait-16',
          name: 'Cafe Au Lait',
          price: '4.75',
          description: 'Rich coffee and steamed milk in perfect harmony',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'cafe-au-lait-20',
          name: 'Cafe Au Lait',
          price: '5.25',
          description: 'Rich coffee and steamed milk in perfect harmony',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'coffee-12',
          name: 'Coffee',
          price: '3.25',
          description: 'Fresh brewed coffee',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'coffee-16',
          name: 'Coffee',
          price: '3.75',
          description: 'Fresh brewed coffee',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'coffee-20',
          name: 'Coffee',
          price: '4.25',
          description: 'Fresh brewed coffee',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'espresso-12',
          name: 'Espresso',
          price: '3.00',
          description: 'Rich, intense shot with perfect crema',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=687&auto=format&fit=crop'
        },
        {
          id: 'espresso-16',
          name: 'Espresso',
          price: '3.50',
          description: 'Rich, intense shot with perfect crema',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=687&auto=format&fit=crop'
        },
        {
          id: 'espresso-20',
          name: 'Espresso',
          price: '4.25',
          description: 'Rich, intense shot with perfect crema',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=687&auto=format&fit=crop'
        },
        {
          id: 'latte-12',
          name: 'Latte',
          price: '4.75',
          description: 'Velvety steamed milk poured over espresso',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1655012735888-fd03a5c31c53?q=80&w=1170&auto=format&fit=crop'
        },
        {
          id: 'latte-16',
          name: 'Latte',
          price: '5.25',
          description: 'Velvety steamed milk poured over espresso',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1655012735888-fd03a5c31c53?q=80&w=1170&auto=format&fit=crop'
        },
        {
          id: 'latte-20',
          name: 'Latte',
          price: '5.75',
          description: 'Velvety steamed milk poured over espresso',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1655012735888-fd03a5c31c53?q=80&w=1170&auto=format&fit=crop'
        },
        {
          id: 'cappuccino-12',
          name: 'Cappuccino',
          price: '4.75',
          description: 'Equal parts espresso, steamed milk, and foam',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'cappuccino-16',
          name: 'Cappuccino',
          price: '5.25',
          description: 'Equal parts espresso, steamed milk, and foam',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'cappuccino-20',
          name: 'Cappuccino',
          price: '5.75',
          description: 'Equal parts espresso, steamed milk, and foam',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'americano-12',
          name: 'Americano',
          price: '3.75',
          description: 'Espresso diluted with hot water',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'americano-16',
          name: 'Americano',
          price: '3.75',
          description: 'Espresso diluted with hot water',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'americano-20',
          name: 'Americano',
          price: '5.25',
          description: 'Espresso diluted with hot water',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'hot-chocolate-12',
          name: 'Hot Chocolate',
          price: '4.50',
          description: 'Rich and creamy hot chocolate',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1542990253-0d0f5be92588?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'hot-chocolate-16',
          name: 'Hot Chocolate',
          price: '4.75',
          description: 'Rich and creamy hot chocolate',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1542990253-0d0f5be92588?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'hot-chocolate-20',
          name: 'Hot Chocolate',
          price: '5.50',
          description: 'Rich and creamy hot chocolate',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1542990253-0d0f5be92588?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'chai-latte-12',
          name: 'Chai Latte',
          price: '4.25',
          description: 'Spiced chai tea with steamed milk',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'chai-latte-16',
          name: 'Chai Latte',
          price: '4.75',
          description: 'Spiced chai tea with steamed milk',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'chai-latte-20',
          name: 'Chai Latte',
          price: '5.50',
          description: 'Spiced chai tea with steamed milk',
          category: 'hot-drinks',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop'
        },

        // Cold Drinks
        {
          id: 'cold-brew-16',
          name: 'Cold Brew',
          price: '5.00',
          description: 'Slow-steeped for 20 hours for smooth, bold flavor',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1169&auto=format&fit=crop'
        },
        {
          id: 'cold-brew-20',
          name: 'Cold Brew',
          price: '5.75',
          description: 'Slow-steeped for 20 hours for smooth, bold flavor',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1169&auto=format&fit=crop'
        },
        {
          id: 'iced-tea-16',
          name: 'Iced Tea',
          price: '4.00',
          description: 'Refreshing iced tea',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'iced-tea-20',
          name: 'Iced Tea',
          price: '4.50',
          description: 'Refreshing iced tea',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'bottled-water',
          name: 'Bottled Water',
          price: '2.50',
          description: 'Pure bottled water',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'sparkling-water',
          name: 'Sparkling Water',
          price: '4.00',
          description: 'Refreshing sparkling water',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'juice',
          name: 'Juice',
          price: '4.00',
          description: 'Fresh fruit juice (10oz)',
          category: 'cold-drinks',
          image: 'https://images.unsplash.com/photo-1600271886742-f0499f0a8743?q=80&w=800&auto=format&fit=crop'
        },

        // Specialty Drinks
        {
          id: 'macchiato',
          name: 'Macchiato',
          price: '4.00',
          description: 'Espresso "marked" with a dollop of foamed milk',
          category: 'specialty-drinks',
          image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'cortado',
          name: 'Cortado',
          price: '4.25',
          description: 'Equal parts espresso and steamed milk',
          category: 'specialty-drinks',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'affogato',
          name: 'Affogato',
          price: '5.50',
          description: 'Vanilla ice cream "drowned" in hot espresso',
          category: 'specialty-drinks',
          image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0df?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'hot-tea',
          name: 'Hot Tea',
          price: '3.50',
          description: 'Selection of premium hot teas',
          category: 'specialty-drinks',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'matcha-tea',
          name: 'Matcha Tea',
          price: '4.00',
          description: 'High-quality ceremonial matcha',
          category: 'specialty-drinks',
          image: 'https://images.unsplash.com/photo-1536256263952-8889267dd909?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'mimosa',
          name: 'Mimosa',
          price: '7.00',
          description: 'Classic mimosa with orange juice and champagne',
          category: 'specialty-drinks',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop'
        },

        // Savory Crepes
        {
          id: 'kevin-bacon',
          name: 'The Kevin Bacon',
          price: '12.95',
          description: 'Combination of turkey, bacon, cheese, and tomatoes with thousand island sauce',
          category: 'savory-crepes',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'the-classic',
          name: 'The Classic',
          price: '11.95',
          description: 'Ham, mozzarella cheese and our Dijonnaise sauce',
          category: 'savory-crepes',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'crepe-florentine',
          name: 'Crepe Florentine',
          price: '11.95',
          description: 'Spinach, mushrooms, mozzarella cheese and sunflower seeds, topped with a pepper parmesan sauce',
          category: 'savory-crepes',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'the-motz',
          name: 'The Motz',
          price: '11.95',
          description: 'Mozzarella, basil, and tomato with cracked pepper and olive oil',
          category: 'savory-crepes',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'morning-delight',
          name: 'Morning Delight',
          price: '8.95',
          description: 'Bacon, egg, and mozzarella in a savory crepe',
          category: 'savory-crepes',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=800&auto=format&fit=crop'
        },

        // Sweet Crepes
        {
          id: 'crepe-suzette',
          name: 'Crepe Suzette',
          price: '11.95',
          description: 'Classic French flavors of orange marmalade, Grand Marnier caramel sauce',
          category: 'sweet-crepes',
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'bananarama',
          name: 'The Bananarama',
          price: '12.95',
          description: 'Tasty mix of banana, granola, honey, and peanut butter',
          category: 'sweet-crepes',
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'nutty-banana',
          name: 'Nutty Banana',
          price: '12.95',
          description: 'Rich taste of Nutella paired with fresh banana, chocolate danish sauce and powdered sugar',
          category: 'sweet-crepes',
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'plain-jane',
          name: 'Plain Jane',
          price: '8.95',
          description: 'Choose from cinnamon and sugar, brown sugar, or lemon sugar. Enjoy the simplicity!',
          category: 'sweet-crepes',
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'crepe-damour',
          name: "Crepe d'amour",
          price: '12.95',
          description: 'The perfect pairing of Nutella and strawberries, mountain honey and powdered sugar',
          category: 'sweet-crepes',
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop'
        },

        // Smoothies
        {
          id: 'greek-stallion',
          name: 'Greek Stallion',
          price: '8.95',
          description: 'Kale, Spinach, Dates, Chia Seeds, Almond Milk, Banana, Cashews, Cinnamon, Mountain Honey',
          category: 'smoothies',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'classic-smoothie',
          name: 'Classic',
          price: '8.95',
          description: 'Coconut Water, Strawberry, Banana, Blueberry',
          category: 'smoothies',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'energy-smoothie',
          name: 'Energy',
          price: '8.95',
          description: 'Almond Butter, Banana, Almond Milk, Chocolate Protein, Mountain Honey',
          category: 'smoothies',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'berry-acai',
          name: 'Berry Acai',
          price: '8.95',
          description: 'Acai, Strawberry, Almond Milk, Blueberry, Banana, Coconut Water',
          category: 'smoothies',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'summer-smoothie',
          name: 'Summer',
          price: '8.95',
          description: 'Banana, Spinach, Almond Milk, Pineapple, Banana, Mango',
          category: 'smoothies',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
        },
        {
          id: 'popeye-smoothie',
          name: 'Popeye',
          price: '8.95',
          description: 'Banana, Spinach, Almond Milk, Almonds, Vanilla Protein, Mountain Honey, Dates, Cinnamon',
          category: 'smoothies',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=800&auto=format&fit=crop'
        }
      ]
    };

    // Insert default content for each section
    const insertPromises = Object.entries(defaultContent).map(([contentType, contentData]) => {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT OR REPLACE INTO content (content_type, content_data)
          VALUES (?, ?)
        `;

        db.run(query, [contentType, JSON.stringify(contentData)], function(err) {
          if (err) {
            console.error(`❌ Error inserting ${contentType}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Inserted/updated ${contentType} content`);
            resolve();
          }
        });
      });
    });

    Promise.all(insertPromises)
      .then(() => resolve())
      .catch(reject);
  });
};

// Content operations
const getContent = (contentType) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT content_data FROM content WHERE content_type = ?';

    db.get(query, [contentType], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row) {
        try {
          resolve(JSON.parse(row.content_data));
        } catch (parseErr) {
          reject(parseErr);
        }
      } else {
        resolve(null);
      }
    });
  });
};

const setContent = (contentType, contentData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT OR REPLACE INTO content (content_type, content_data, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(query, [contentType, JSON.stringify(contentData)], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, contentType, contentData });
      }
    });
  });
};

const getAllContent = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT content_type, content_data, updated_at FROM content ORDER BY content_type';

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const content = {};
      rows.forEach(row => {
        try {
          content[row.content_type] = JSON.parse(row.content_data);
        } catch (parseErr) {
          console.error(`Error parsing ${row.content_type}:`, parseErr);
        }
      });

      resolve(content);
    });
  });
};

// Category operations
const getCategories = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM categories ORDER BY name';

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const addCategory = (category) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)';

    db.run(query, [category.id, category.name, category.description], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...category });
      }
    });
  });
};

const updateCategory = (id, category) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';

    db.run(query, [category.name, category.description, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, ...category });
      }
    });
  });
};

const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM categories WHERE id = ?';

    db.run(query, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ deleted: this.changes > 0 });
      }
    });
  });
};

// Product operations
const getProducts = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const addProduct = (product) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO products (id, name, price, description, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)';

    db.run(query, [product.id, product.name, product.price, product.description, product.category, product.image], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...product });
      }
    });
  });
};

const updateProduct = (id, product) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE products SET name = ?, price = ?, description = ?, category_id = ?, image_url = ? WHERE id = ?';

    db.run(query, [product.name, product.price, product.description, product.category, product.image, id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id, ...product });
      }
    });
  });
};

const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM products WHERE id = ?';

    db.run(query, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ deleted: this.changes > 0 });
      }
    });
  });
};

// Gallery operations
const getGalleryImages = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM gallery_images ORDER BY display_order, created_at DESC';

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const addGalleryImage = (image) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO gallery_images (id, title, image_url, display_order) VALUES (?, ?, ?, ?)';

    db.run(query, [image.id, image.title, image.image_url, image.display_order || 0], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...image });
      }
    });
  });
};

const deleteGalleryImage = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM gallery_images WHERE id = ?';

    db.run(query, [id], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ deleted: this.changes > 0 });
      }
    });
  });
};

// Site settings operations
const getSiteSettings = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM site_settings';

    db.all(query, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const settings = {};
        rows.forEach(row => {
          settings[row.setting_key] = row.setting_value;
        });
        resolve(settings);
      }
    });
  });
};

const setSiteSetting = (key, value) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT OR REPLACE INTO site_settings (setting_key, setting_value, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `;

    db.run(query, [key, value], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ key, value });
      }
    });
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve) => {
    if (db) {
      db.close((err) => {
        if (err) {
          console.error('❌ Error closing database:', err.message);
        } else {
          console.log('✅ Database connection closed');
        }
        resolve();
      });
    } else {
      resolve();
    }
  });
};

module.exports = {
  initializeDatabase,
  getContent,
  setContent,
  getAllContent,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  getSiteSettings,
  setSiteSetting,
  closeDatabase
};
