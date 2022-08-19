const router = require("express").Router();
const organizationController = require("../controllers/organization.controller");

router.post("/create", organizationController.create);
router.get("/all", organizationController.readAll);

router.get("/:signature", organizationController.read);
router.post("/:signature/update", organizationController.update);
router.post("/:signature/delete", organizationController.delete);

router.post("/:signature/addUsers", organizationController.addUsers);
router.post("/:signature/removeUsers", organizationController.removeUsers);

module.exports = router;