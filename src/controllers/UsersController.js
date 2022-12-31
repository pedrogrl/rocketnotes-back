const { hash, compare } = require("bcryptjs");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name) {
      throw new AppError("Nome é obrigatório!");
    }

    const database = await sqliteConnection();
    const emailExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    ); // caso não ache retorna undefined

    if (emailExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ name, email, password });
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);
    const userWithSameEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (!user) {
      throw new AppError("Usuário não encontrado!");
    } else if (userWithSameEmail && userWithSameEmail.id != user.id) {
      throw new AppError("Email já em uso!");
    } else if (password && !old_password) {
      throw new AppError("Informe a senha antiga!");
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    database.run(
      `
      UPDATE users
      SET name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    res.json();
  }
}

module.exports = UsersController;
