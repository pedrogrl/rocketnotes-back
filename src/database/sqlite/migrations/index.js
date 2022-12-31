const sqliteConnection = require("../../sqlite/index.js");
const createUsers = require("./createUsers.js");

async function migrationsRun() {
  const schemas = [createUsers].join("");

  sqliteConnection()
    .then((db) => db.exec(schemas))
    .catch((err) => console.error(err));
}

module.exports = migrationsRun;