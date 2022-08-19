const router = require("express").Router();
const taskController = require("../controllers/task.controller");

router.post("/create", taskController.create);
router.get("/:signature", taskController.read);

module.exports = router;