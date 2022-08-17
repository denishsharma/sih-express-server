const router = require("express").Router();
const recordController = require("../controllers/record.controller");

router.post("/create", recordController.create);
router.post("/:recordId", recordController.read);
router.post("/:recordId/update", recordController.update);
router.post("/:recordId/delete", recordController.delete);

module.exports = router;