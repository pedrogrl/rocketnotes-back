const DiskStorage = require("../providers/DiskStorage");
const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class UserAvatarController {
  async update(req, res) {
    const user_id = req.user.id;
    const avatarFilename = req.file.filename;

    const diskStorage = new DiskStorage();
    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não autenticado!");
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const file = await diskStorage.saveFile(avatarFilename);
    user.avatar = file;

    await knex("users").update(user).where({ id: user_id });

    res.json(user);
  }
}

module.exports = UserAvatarController;
