const router = require("express").Router();
const userController = require("../controllers/user.controller");

router.get("/token/:userKey", userController.token);
router.post("/create", userController.create);
router.post("/balance", userController.getBalance);
router.post("/transfer", userController.transfer);

module.exports = router;
