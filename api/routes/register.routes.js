const { check } = require('express-validator');
const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.post('/',
    check('email').normalizeEmail().isEmail(),
    authController.register);

//router.post('/', authController.register);
module.exports = router;