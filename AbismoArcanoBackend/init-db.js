// mi-blog-backend/init-db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Conéctate o crea la base de datos SQLite
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');

    db.serialize(() => { // Usar serialize para ejecutar comandos secuencialmente
      // Tabla de usuarios
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error al crear la tabla de usuarios:', err.message);
        } else {
          console.log('Tabla de usuarios creada o ya existe.');

          // Inserta un usuario de prueba si no existe
          const testUsername = 'testuser';
          const testPassword = 'password123';
          db.get(`SELECT username FROM users WHERE username = ?`, [testUsername], (err, row) => {
            if (!row) {
              bcrypt.hash(testPassword, 10, (err, hash) => {
                db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, [testUsername, hash], function(err) {
                  if (!err) console.log(`Usuario de prueba '${testUsername}' insertado con ID: ${this.lastID}`);
                });
              });
            } else {
              console.log(`Usuario de prueba '${testUsername}' ya existe.`);
            }
          });
        }
      });

      // Tabla de blogs
      db.run(`CREATE TABLE IF NOT EXISTS blogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        subscription_price REAL DEFAULT 0.0, -- Nuevo campo para el precio de suscripción
        created_at INTEGER,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )`, (err) => {
        if (err) {
          console.error('Error al crear la tabla de blogs:', err.message);
        } else {
          console.log('Tabla de blogs creada o ya existe.');
          // Insertar blogs de prueba si la tabla está vacía
          db.get(`SELECT COUNT(*) AS count FROM blogs`, (err, row) => {
            if (row.count === 0) {
              // Necesitamos IDs de usuario para los blogs, así que los obtenemos
              db.all(`SELECT id, username FROM users`, (err, users) => {
                if (err || users.length === 0) {
                  console.warn('No hay usuarios para asignar blogs de prueba.');
                  return;
                }
                const user1Id = users.find(u => u.username === 'testuser')?.id || users[0].id; // Asigna al testuser o al primer usuario
                const user2Id = users.length > 1 ? users[1].id : user1Id; // Si hay otro, asigna al segundo, si no, al primero

                const insertBlog = (blogData, callback) => {
                  db.run(`INSERT INTO blogs (owner_id, title, description, image_url, subscription_price, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
                    [blogData.ownerId, blogData.title, blogData.description, blogData.imageUrl, blogData.subscriptionPrice, blogData.createdAt], function(err) {
                      if (!err) console.log(`Blog '${blogData.title}' insertado con ID: ${this.lastID}`);
                      callback(err, this.lastID); // Pasa el ID del blog recién creado
                    }
                  );
                };

                insertBlog({
                  ownerId: user1Id,
                  title: 'Aventuras en la Cocina',
                  description: 'Recetas deliciosas y consejos culinarios para todos.',
                  imageUrl: 'https://placehold.co/600x400/9AE6B4/276749?text=Cocina',
                  subscriptionPrice: 5.99, // Con precio
                  createdAt: Date.now() - 86400000 * 5
                }, (err, blogId1) => {
                  if (blogId1) {
                    // Insertar posts para el blog 1
                    db.run(`INSERT INTO posts (blog_id, title, excerpt, content, image_url, is_paid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [blogId1, 'Mi Primera Receta: Pasta Carbonara', 'Una auténtica carbonara italiana que puedes hacer en casa.', '<p>Aprende a preparar una deliciosa pasta carbonara con esta receta paso a paso...</p><p><strong>Ingredientes:</strong> Huevo, Pecorino Romano, Guanciale, Pasta.</p>', 'https://placehold.co/600x300/FEEBC6/9C4221?text=Carbonara', 0, Date.now() - 86400000 * 4]
                    );
                    db.run(`INSERT INTO posts (blog_id, title, excerpt, content, image_url, is_paid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [blogId1, 'Post Premium: Secretos del Mole', 'Descubre los trucos para un mole poblano inigualable (solo suscriptores).', '<p>Este es el contenido <strong>premium</strong> sobre los secretos del Mole. Acceso restringido.</p>', 'https://placehold.co/600x300/FBD38D/C05621?text=MolePremium', 1, Date.now() - 86400000 * 2] // Es de pago
                    );
                  }
                });

                insertBlog({
                  ownerId: user2Id,
                  title: 'Explorando el Desarrollo Web',
                  description: 'Artículos sobre React, JavaScript, CSS y más.',
                  imageUrl: 'https://placehold.co/600x400/A0AEC0/2D3748?text=Desarrollo',
                  subscriptionPrice: 0.0, // Gratuito
                  createdAt: Date.now() - 86400000 * 3
                }, (err, blogId2) => {
                  if (blogId2) {
                    // Insertar posts para el blog 2
                    db.run(`INSERT INTO posts (blog_id, title, excerpt, content, image_url, is_paid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [blogId2, 'Introducción a React Hooks', 'Una guía sencilla para entender useState y useEffect.', '<p>Los Hooks cambiaron React. Aquí te explico cómo funcionan los más básicos...</p>', 'https://placehold.co/600x300/D6BCFA/44337A?text=Hooks', 0, Date.now() - 86400000 * 2]
                    );
                  }
                });

                insertBlog({
                  ownerId: user1Id,
                  title: 'Viajes alrededor del mundo',
                  description: 'Compartiendo experiencias y consejos de mis aventuras.',
                  imageUrl: 'https://placehold.co/600x400/B2F5EA/00B295?text=Viajes',
                  subscriptionPrice: 2.50, // Con precio
                  createdAt: Date.now() - 86400000
                }, (err, blogId3) => {
                  if (blogId3) {
                     db.run(`INSERT INTO posts (blog_id, title, excerpt, content, image_url, is_paid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                      [blogId3, 'Guía de Viaje a Tokio (Premium)', 'Consejos exclusivos para explorar Tokio como un local.', '<p>Contenido premium sobre Tokio.</p>', 'https://placehold.co/600x300/B2F5EA/00B295?text=TokioPremium', 1, Date.now() - 86400000 * 0.5]
                    );
                  }
                });
              });
            }
          });
        }
      });

      // Tabla de posts
      db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        blog_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT,
        image_url TEXT,
        is_paid INTEGER DEFAULT 0, -- Nuevo campo: 0 para gratis, 1 para de pago
        created_at INTEGER,
        FOREIGN KEY (blog_id) REFERENCES blogs(id)
      )`, (err) => {
        if (err) console.error('Error al crear la tabla de posts:', err.message);
        else console.log('Tabla de posts creada o ya existe.');
      });

      // Tabla de suscripciones
      db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscriber_user_id INTEGER NOT NULL,
        blog_id INTEGER NOT NULL,
        subscribed_at INTEGER,
        status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
        UNIQUE(subscriber_user_id, blog_id), -- Un usuario solo puede suscribirse una vez a un blog
        FOREIGN KEY (subscriber_user_id) REFERENCES users(id),
        FOREIGN KEY (blog_id) REFERENCES blogs(id)
      )`, (err) => {
        if (err) console.error('Error al crear la tabla de suscripciones:', err.message);
        else console.log('Tabla de suscripciones creada o ya existe.');
      });

    }); // Fin db.serialize()

    // Cierra la base de datos después de un pequeño retraso para asegurar que las operaciones se completen
    // En un entorno de producción, la base de datos no se cerraría así
    setTimeout(() => {
      db.close((err) => {
        if (err) console.error('Error al cerrar la base de datos:', err.message);
        else console.log('Conexión a la base de datos cerrada.');
      });
    }, 2000); // Dar tiempo para que las inserciones de prueba se completen
  }
});
