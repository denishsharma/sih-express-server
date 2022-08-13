const router = require("express").Router();
const templateController = require("../controllers/template.controller");

router.get("/:templateId", templateController.getTemplate);
router.get("/:templateId/versions", templateController.getVersion);
router.get("/:templateId/version/:versionNumber", templateController.getVersion);
router.post("/create", templateController.createTemplate);

module.exports = router;