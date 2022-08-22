const router = require("express").Router();
const taskController = require("../controllers/task.controller");

router.post("/create", taskController.create);

router.post("/:signature/teams", taskController.getTeams);
router.post("/:teamId/tasks", taskController.getTasks);

router.post("/assign", taskController.assign);
router.post("/unassign", taskController.unassign);

router.post("/all/tasks", taskController.getAllTasks);

module.exports = router;