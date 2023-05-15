const router = require('express').Router();
const controller = require('../controllers/favorites.controller');
const { check } = require('express-validator');
const authCheck = require('../middleware/check-auth');

// In order to use any of the routes below this line, the Authorization header MUST be set in the request headers.
// Otherwise, you will get a 401 error.
// router.use(authCheck);

// Usgae: POST .../api/favorites?tutorId={tutorId}
// Example: POST .../api/favorites?tutorId=63fa577a5e5f21d524196846
// tutorId MUST be set in the query string. The API gets the id of the user making the request by using the checkAuth middleware.
router.post('/:tutorId',
    authCheck,
    [
        check('tutorId').isMongoId(),
        check('tutorId').matches(/[A-Za-z0-9]{24}/)
    ],
    controller.toggleFavoriteTutor);

module.exports = router;
