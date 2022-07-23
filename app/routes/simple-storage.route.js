const router = require("express").Router();
const simpleStorageController = require("../controllers/simple-storage.controller");

router.post("/store", simpleStorageController.store);
router.post("/myFavoriteNumber", simpleStorageController.getMyFavoriteNumber);

module.exports = router;
