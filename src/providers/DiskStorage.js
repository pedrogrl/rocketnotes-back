const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    await fs.promises.rename( // mover arquivo de lugar
      path.resolve(uploadConfig.TEMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);
    try {
      await fs.promises.stat(filePath); // verifica se esta disponivel
    } catch {
      return;
    }

    await fs.promises.unlink(filePath); // deleta
  }
}

module.exports = DiskStorage;