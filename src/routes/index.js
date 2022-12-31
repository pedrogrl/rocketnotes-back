const { Router } = require("express");

const usersRoutes = require("./users.routes.js");
const notesRoutes = require("./notes.routes.js");
const tagsRoutes = require("./tags.routes.js");
const sessionsRoutes = require("./sessions.routes.js");

const router = Router();

router.use("/users", usersRoutes);
router.use("/notes", notesRoutes);
router.use("/tags", tagsRoutes);
router.use('/sessions', sessionsRoutes)

module.exports = router;
