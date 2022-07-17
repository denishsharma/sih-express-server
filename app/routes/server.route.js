const router = require('express').Router();
const serverController = require('../controllers/server.controller');

router.get('/', serverController.index)
router.post('/register', serverController.register);
router.post('/authenticate', serverController.authenticate);

module.exports = router;