const router = require("express").Router();
const idrnController = require("../controllers/idrn.controller");

router.post("/create", idrnController.create);

router.post("/template/create", idrnController.createTemplate);

module.exports = router;