const db = require('../database/sqlite');
const User = require('../models/user.model');

class UsersRepository {
  async findById(id) {
    const row = await db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
    return row ? User.fromDB(row) : null;
  }

  async findByUsername(username) {
    const row = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    return row || null;
  }

  async findByEmail(email) {
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return row || null;
  }

  async create({ username, email, passwordHash }) {
    const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    const result = await db.run(sql, [username, email, passwordHash]);
    
    return this.findById(result.lastInsertRowid);
  }
}

module.exports = UsersRepository;