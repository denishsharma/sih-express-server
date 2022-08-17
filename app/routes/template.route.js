const router = require("express").Router();
const templateController = require("../controllers/template.controller");

router.get("/:templateId", templateController.getTemplate);
router.get("/:templateId/versions", templateController.getVersion);
router.get("/:templateId/version/:versionNumber", templateController.getVersion);

router.post("/create", templateController.createTemplate);
router.post("/update", templateController.updateTemplate);
router.post("/delete", templateController.deleteTemplate);

router.post("/:templateId/field/add", templateController.createField);
router.post("/:templateId/field/update", templateController.updateField);

module.exports = router;