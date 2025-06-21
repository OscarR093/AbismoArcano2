// mi-blog-backend/server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const cors = require('cors'); // Importa el paquete CORS

const app = express();
const PORT = 3001; // Puerto donde correrá tu backend. Asegúrate de que no entre en conflicto con Vite (generalmente 5173).

// Middleware
app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend (Vite)
app.use(express.json()); // Habilita Express para parsear JSON en el cuerpo de las solicitudes

// Conéctate a la base de datos SQLite
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// --- Rutas de Autenticación ---

// Ruta de Registro de Usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });
  }

  try {
    // Generar hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10); // 10 es el costo del salt, cuanto más alto, más seguro pero más lento

    // Insertar usuario en la base de datos
    db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, [username, passwordHash], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ message: 'El nombre de usuario ya existe.' });
        }
        console.error('Error al registrar usuario:', err.message);
        return res.status(500).json({ message: 'Error interno del servidor al registrar.' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente', userId: this.lastID, username });
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

  if (!username || !password) {
    return res.status(400).json({ message: 'Nombre de usuario y contraseña son requeridos.' });
  }

  // Buscar usuario en la base de datos
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) {
      console.error('Error al buscar usuario:', err.message);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Comparar la contraseña ingresada con el hash almacenado
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

// Ruta de ejemplo (pública, no requiere autenticación)
app.get('/public-data', (req, res) => {
  res.json({ message: 'Esta es información pública.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

