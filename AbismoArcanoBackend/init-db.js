// mi-blog-backend/init-db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Conéctate o crea la base de datos SQLite
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla de usuarios:', err.message);
      } else {
        console.log('Tabla de usuarios creada o ya existe.');

        // Opcional: Inserta un usuario de prueba si no existe
        const testUsername = 'testuser';
        const testPassword = 'password123'; // ¡Nunca uses esto en producción!

        db.get(`SELECT username FROM users WHERE username = ?`, [testUsername], (err, row) => {
          if (err) {
            console.error('Error al buscar usuario de prueba:', err.message);
            return;
          }
          if (!row) {
            bcrypt.hash(testPassword, 10, (err, hash) => {
              if (err) {
                console.error('Error al hashear la contraseña:', err.message);
                return;
              }
              db.run(`INSERT INTO users (username, password_hash) VALUES (?, ?)`, [testUsername, hash], function(err) {
                if (err) {
                  console.error('Error al insertar usuario de prueba:', err.message);
                } else {
                  console.log(`Usuario de prueba '${testUsername}' insertado con ID: ${this.lastID}`);
                }
                db.close(); // Cierra la conexión después de la operación
              });
            });
          } else {
            console.log(`Usuario de prueba '${testUsername}' ya existe.`);
            db.close(); // Cierra la conexión
          }
        });
      }
    });
  }
});
