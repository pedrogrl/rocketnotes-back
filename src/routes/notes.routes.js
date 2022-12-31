const { Router } = require("express");
const notesRouter = Router();

const NotesController = require("../controllers/NotesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const notesController = new NotesController();

notesRouter.use(ensureAuthenticated);

notesRouter.post("/", notesController.create);
notesRouter.get("/:id", notesController.show);
notesRouter.delete("/:id", notesController.delete);
notesRouter.get("/", notesController.index);

module.exports = notesRouter;
