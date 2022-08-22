const router = require("express").Router();
const teamController = require("../controllers/team.controller");

router.post("/create", teamController.create);
router.post("/:teamId/tasks", teamController.getTasks);
router.post("/:teamId/users", teamController.getUsers);

router.post("/assign/task", teamController.assignTask);
router.post("/assign/user", teamController.assignUser);

router.post("/unassign/task", teamController.unassignTask);
router.post("/unassign/user", teamController.unassignUser);

module.exports = router;