const router = require("express").Router();
const volunteerProfileController = require("../controllers/volunteer-profile.controller");

router.post("/add", volunteerProfileController.addProfile);
router.post("/update", volunteerProfileController.updateProfile);
router.post("/giveAccess", volunteerProfileController.giveEditorAccess);
router.post("/revokeAccess", volunteerProfileController.revokeEditorAccess);

module.exports = router;