const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const { check } = require('express-validator');

router.post('/',
    check('email').normalizeEmail().isEmail(),
    authController.login);
module.exports = router;