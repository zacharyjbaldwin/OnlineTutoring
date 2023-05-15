
const router = require('express').Router();
const { check } = require('express-validator');
const controller = require('../controllers/users.controller');
const authCheck = require('../middleware/check-auth');

router.get('/', controller.getUsers);
router.get('/:userId', controller.getUserById);
router.get('/:userId/favorites', controller.getUserFavorite);

router.patch('/',
    authCheck,
    [
        check('aboutMe').notEmpty(),
        check('availability').notEmpty(),
        check('profilePictureUrl').notEmpty(),
        check('skills').notEmpty()
    ],
    controller.makeTutor);

module.exports = router;