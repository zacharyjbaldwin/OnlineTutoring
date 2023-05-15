const router = require('express').Router();
const controller = require('../controllers/helloworld.controller');

// GET /
router.get('/', controller.helloWorld);

module.exports = router;