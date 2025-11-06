const bcrypt = require('bcrypt');
const UsersRepository = require('../repositories/users.repository');
const User = require('../models/user.model');

class AuthController {
  constructor() {
    this.usersRepo = new UsersRepository();
  }

  async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      new User({ username, email, password }); 

      const existingUser = await this.usersRepo.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ erro: 'Usuário já existe.' });
      }

      const existingEmail = await this.usersRepo.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ erro: 'Email já cadastrado.' });
      }

      const hash = await bcrypt.hash(password, 10);

      const user = await this.usersRepo.create({ username, email, passwordHash: hash });

      req.session.userId = user.id;

      res.status(201).json({ 
        mensagem: 'Usuário registrado com sucesso!', 
        user: user.toJSON()
      });

    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await this.usersRepo.findByUsername(username);
      if (!user) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
      }

      req.session.userId = user.id;
      
      const userModel = User.fromDB(user);

      res.status(200).json({ 
        mensagem: 'Login realizado com sucesso!', 
        user: userModel.toJSON() 
      });

    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ mensagem: 'Logout realizado com sucesso.' });
    });
  }

  async me(req, res, next) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ erro: 'Não autenticado.' });
      }

      const user = await this.usersRepo.findById(req.session.userId);
      if (!user) {
        req.session.destroy();
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      res.status(200).json({ user: user.toJSON() });

    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;