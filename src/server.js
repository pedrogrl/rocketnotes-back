require('dotenv/config')
require("express-async-errors");

const dbMigrations = require("./database/sqlite/migrations");

const AppError = require("./utils/AppError.js");

const uploadConfig = require("./configs/upload");

const cors = require("cors");
const express = require("express");
const routes = require("./routes/index.js");

dbMigrations();

const app = express();
app.use(cors());
app.use(express.json()); // informar que os conteudos serao JSON (body)

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log("\x1b[36m%s\x1b[0m", `Server is running on Port ${PORT}`)
);
