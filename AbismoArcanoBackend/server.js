// mi-blog-backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const PORT = 3001; // Puerto donde correrá tu backend.

// Middleware
app.use(cors());
app.use(express.json());

// Conéctate a la base de datos SQLite
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Middleware de Autenticación (BÁSICO: Solo para el template, NO USAR EN PRODUCCIÓN)
// Espera un header 'x-user-id' con el ID del usuario logueado.
const authenticateUser = (req, res, next) => {
  // En este template, el userId del frontend es 'user-X'
  // y en la BD es solo el número X. Necesitamos parsearlo.
  const frontendUserId = req.headers['x-user-id'];
  if (!frontendUserId || !frontendUserId.startsWith('user-')) {
    return res.status(401).json({ message: 'No autorizado: ID de usuario no proporcionado o inválido.' });
  }
  
  // Extrae solo el ID numérico
  req.userId = parseInt(frontendUserId.split('-')[1]);
  if (isNaN(req.userId)) {
      return res.status(401).json({ message: 'No autorizado: Formato de ID de usuario inválido.' });
  }
  next(); // Continúa con la siguiente función de middleware/ruta
};

// --- Rutas de Autenticación ---

// Ruta de Registro de Usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });

  try {
    const passwordHash = await bcrypt.hash(password, 10); // 10 es el costo del salt, cuanto más alto, más seguro pero más lento
    db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, [username, passwordHash], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
        console.error('Error al registrar usuario:', err.message);
        return res.status(500).json({ message: 'Error interno del servidor al registrar.' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente', userId: `user-${this.lastID}`, username });
      console.log(`Usuario '${username}' registrado con ID: ${this.lastID}`);
    });
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Ruta de Login de Usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      console.error('Error al buscar usuario:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (match) {
      // En una aplicación real, aquí generarías y enviarías un JWT (JSON Web Token)
      // Por ahora, simplemente enviamos el ID del usuario
      res.status(200).json({ message: 'Inicio de sesión exitoso.', userId: `user-${user.id}`, username: user.username });
      console.log(`Usuario '${user.username}' (ID: ${user.id}) ha iniciado sesión.`);
    } else {
      res.status(401).json({ message: 'Credenciales inválidas.' });
    }
  });
});

// --- Rutas de Blogs (PROTEGIDAS por authenticateUser para crear/gestionar) ---

// Obtener todos los blogs (PÚBLICA)
app.get('/blogs', (req, res) => {
  db.all(`SELECT b.*, u.username as owner_username FROM blogs b JOIN users u ON b.owner_id = u.id ORDER BY b.created_at DESC`, (err, rows) => {
    if (err) {
      console.error('Error al obtener blogs:', err.message);
      return res.status(500).json({ message: 'Error al obtener blogs.' });
    }
    // Formatea los IDs del propietario a 'user-X' para que coincida con el frontend
    const formattedBlogs = rows.map(blog => ({
      ...blog,
      ownerId: `user-${blog.owner_id}` // Coincide con el formato del frontend
    }));
    res.json(formattedBlogs);
  });
});

// Obtener un blog específico (PÚBLICA)
app.get('/blogs/:blogId', (req, res) => {
  const blogId = req.params.blogId;
  db.get(`SELECT b.*, u.username as owner_username FROM blogs b JOIN users u ON b.owner_id = u.id WHERE b.id = ?`, [blogId], (err, row) => {
    if (err) {
      console.error('Error al obtener blog:', err.message);
      return res.status(500).json({ message: 'Error al obtener blog.' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Blog no encontrado.' });
    }
    // Formatea el ID del propietario a 'user-X'
    const formattedBlog = {
      ...row,
      ownerId: `user-${row.owner_id}`
    };
    res.json(formattedBlog);
  });
});

// Crear un nuevo blog (PROTEGIDA)
app.post('/blogs', authenticateUser, (req, res) => {
  const { title, description, imageUrl, subscriptionPrice } = req.body;
  const ownerId = req.userId; // ID numérico del usuario logueado

  if (!title || !description) {
    return res.status(400).json({ message: 'Título y descripción del blog son requeridos.' });
  }

  const price = typeof subscriptionPrice === 'number' ? subscriptionPrice : 0.0; // Asegura que sea un número o 0

  db.run(`INSERT INTO blogs (owner_id, title, description, image_url, subscription_price, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [ownerId, title, description, imageUrl, price, Date.now()],
    function(err) {
      if (err) {
        console.error('Error al crear blog:', err.message);
        return res.status(500).json({ message: 'Error al crear el blog.' });
      }
      res.status(201).json({ message: 'Blog creado exitosamente', blogId: this.lastID });
    }
  );
});

// --- Rutas de Posts (PROTEGIDAS para crear, ACCESO CONTROLADO para ver) ---

// Obtener posts de un blog (ACCESO CONTROLADO)
app.get('/blogs/:blogId/posts', authenticateUser, (req, res) => { // authenticateUser para verificar suscripción
  const blogId = req.params.blogId;
  const currentUserId = req.userId; // ID numérico del usuario logueado

  db.get(`SELECT owner_id, subscription_price FROM blogs WHERE id = ?`, [blogId], (err, blog) => {
    if (err) {
      console.error('Error al obtener blog para posts:', err.message);
      return res.status(500).json({ message: 'Error al verificar blog.' });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog no encontrado.' });
    }

    const isOwner = blog.owner_id === currentUserId;
    const requiresSubscription = blog.subscription_price > 0;

    // Verificar si el usuario está suscrito
    db.get(`SELECT * FROM subscriptions WHERE subscriber_user_id = ? AND blog_id = ? AND status = 'active'`,
      [currentUserId, blogId], (err, subscription) => {
        const isSubscribed = !!subscription;

        let querySql = `SELECT * FROM posts WHERE blog_id = ? ORDER BY created_at DESC`;
        let queryParams = [blogId];

        // Si no es el dueño y el blog requiere suscripción y el usuario NO está suscrito,
        // solo muestra posts NO de pago (is_paid = 0).
        if (!isOwner && requiresSubscription && !isSubscribed) {
          querySql = `SELECT * FROM posts WHERE blog_id = ? AND is_paid = 0 ORDER BY created_at DESC`;
        }

        db.all(querySql, queryParams, (err, rows) => {
          if (err) {
            console.error('Error al obtener posts:', err.message);
            return res.status(500).json({ message: 'Error al obtener posts.' });
          }
          res.json(rows);
        });
      }
    );
  });
});

// Obtener un post específico (ACCESO CONTROLADO)
app.get('/blogs/:blogId/posts/:postId', authenticateUser, (req, res) => {
  const { blogId, postId } = req.params;
  const currentUserId = req.userId; // ID numérico del usuario logueado

  db.get(`SELECT b.owner_id, b.subscription_price, p.is_paid FROM blogs b JOIN posts p ON b.id = p.blog_id WHERE b.id = ? AND p.id = ?`,
    [blogId, postId], (err, result) => {
      if (err) {
        console.error('Error al obtener post y blog info:', err.message);
        return res.status(500).json({ message: 'Error al obtener post.' });
      }
      if (!result) {
        return res.status(404).json({ message: 'Post o Blog no encontrado.' });
      }

      const isOwner = result.owner_id === currentUserId;
      const postIsPaid = result.is_paid === 1;
      const blogRequiresSubscription = result.subscription_price > 0;

      // Si el post es de pago y el blog requiere suscripción y el usuario no es el dueño,
      // entonces verificamos la suscripción.
      if (postIsPaid && blogRequiresSubscription && !isOwner) {
        db.get(`SELECT * FROM subscriptions WHERE subscriber_user_id = ? AND blog_id = ? AND status = 'active'`,
          [currentUserId, blogId], (err, subscription) => {
            if (err) {
              console.error('Error al verificar suscripción:', err.message);
              return res.status(500).json({ message: 'Error al verificar suscripción.' });
            }
            if (!subscription) {
              return res.status(403).json({ message: 'Acceso denegado: Este post es de pago y no estás suscrito a este blog.' });
            }
            // Si está suscrito, procede a obtener el contenido completo del post
            db.get(`SELECT * FROM posts WHERE id = ?`, [postId], (err, post) => {
              if (err) return res.status(500).json({ message: 'Error al obtener post.' });
              res.json(post);
            });
          }
        );
      } else {
        // El post es gratuito, o el usuario es el dueño, o el blog no es de pago.
        db.get(`SELECT * FROM posts WHERE id = ?`, [postId], (err, post) => {
          if (err) {
            console.error('Error al obtener post:', err.message);
            return res.status(500).json({ message: 'Error al obtener post.' });
          }
          res.json(post);
        });
      }
    }
  );
});

// Crear un nuevo post (PROTEGIDA)
app.post('/blogs/:blogId/posts', authenticateUser, (req, res) => {
  const blogId = req.params.blogId;
  const { title, excerpt, content, imageUrl, isPaid } = req.body;
  const currentUserId = req.userId;

  if (!title || !content) {
    return res.status(400).json({ message: 'Título y contenido del post son requeridos.' });
  }

  // Verificar que el usuario que crea el post es el dueño del blog
  db.get(`SELECT owner_id FROM blogs WHERE id = ?`, [blogId], (err, blog) => {
    if (err) {
      console.error('Error al verificar propiedad del blog:', err.message);
      return res.status(500).json({ message: 'Error al verificar el blog.' });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog no encontrado.' });
    }
    if (blog.owner_id !== currentUserId) {
      return res.status(403).json({ message: 'No tienes permiso para crear posts en este blog.' });
    }

    const paidStatus = isPaid ? 1 : 0; // Convertir booleano a entero para SQLite

    db.run(`INSERT INTO posts (blog_id, title, excerpt, content, image_url, is_paid, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [blogId, title, excerpt, content, imageUrl, paidStatus, Date.now()],
      function(err) {
        if (err) {
          console.error('Error al crear post:', err.message);
          return res.status(500).json({ message: 'Error al crear el post.' });
        }
        res.status(201).json({ message: 'Post creado exitosamente', postId: this.lastID });
      }
    );
  });
});

// --- Rutas de Suscripciones (PROTEGIDAS) ---

// Verificar si un usuario está suscrito a un blog (PROTEGIDA)
app.get('/blogs/:blogId/check-subscription', authenticateUser, (req, res) => {
  const blogId = req.params.blogId;
  const currentUserId = req.userId;

  db.get(`SELECT * FROM subscriptions WHERE subscriber_user_id = ? AND blog_id = ? AND status = 'active'`,
    [currentUserId, blogId], (err, row) => {
      if (err) {
        console.error('Error al verificar suscripción:', err.message);
        return res.status(500).json({ message: 'Error al verificar suscripción.' });
      }
      res.json({ isSubscribed: !!row }); // Retorna true si hay una suscripción activa, false si no
    }
  );
});

// Simular suscripción a un blog (PROTEGIDA)
app.post('/blogs/:blogId/subscribe', authenticateUser, (req, res) => {
  const blogId = req.params.blogId;
  const currentUserId = req.userId;

  // Primero, verifica si el blog existe y su precio
  db.get(`SELECT subscription_price, owner_id FROM blogs WHERE id = ?`, [blogId], (err, blog) => {
    if (err) {
      console.error('Error al obtener blog para suscripción:', err.message);
      return res.status(500).json({ message: 'Error al suscribirse.' });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog no encontrado.' });
    }
    if (blog.owner_id === currentUserId) {
      return res.status(400).json({ message: 'No puedes suscribirte a tu propio blog.' });
    }

    // Aquí simularíamos la lógica de pago. Para este template, asumimos que el "pago" fue exitoso.
    // Podrías pasar detalles de pago en el body y simular validaciones aquí.
    console.log(`Simulando pago de ${blog.subscription_price} para el blog ${blog.title}`);

    // Insertar/actualizar suscripción
    db.run(`INSERT OR REPLACE INTO subscriptions (subscriber_user_id, blog_id, subscribed_at, status) VALUES (?, ?, ?, ?)`,
      [currentUserId, blogId, Date.now(), 'active'],
      function(err) {
        if (err) {
          console.error('Error al registrar suscripción:', err.message);
          return res.status(500).json({ message: 'Error al registrar la suscripción.' });
        }
        res.status(200).json({ message: 'Suscripción exitosa.', blogId: blogId, userId: currentUserId });
        console.log(`Usuario ${currentUserId} suscrito al blog ${blogId}`);
      }
    );
  });
});

// Obtener los blogs a los que un usuario está suscrito (PROTEGIDA)
app.get('/user/subscriptions', authenticateUser, (req, res) => {
  const currentUserId = req.userId;

  db.all(`SELECT s.blog_id, b.title, b.description, b.image_url, b.owner_id, u.username as owner_username
          FROM subscriptions s
          JOIN blogs b ON s.blog_id = b.id
          JOIN users u ON b.owner_id = u.id
          WHERE s.subscriber_user_id = ? AND s.status = 'active'`, [currentUserId], (err, rows) => {
    if (err) {
      console.error('Error al obtener suscripciones de usuario:', err.message);
      return res.status(500).json({ message: 'Error al obtener tus suscripciones.' });
    }
    // Formatea los IDs del propietario a 'user-X' para que coincida con el frontend
    const formattedSubscriptions = rows.map(sub => ({
      ...sub,
      ownerId: `user-${sub.owner_id}`
    }));
    res.json(formattedSubscriptions);
  });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
