const router = require('express').Router();
const controller = require('../controllers/tutors.controller');
const { check } = require('express-validator');
const authCheck = require('../middleware/check-auth');

router.get('/', authCheck, controller.getTutors);

router.get('/:tutorId', authCheck, controller.getTutorById);

// do not use this route for tutor signup
router.post('/', 
    [
        check('firstName').notEmpty(),
        check('lastName').notEmpty(),
        // check('aboutMe').notEmpty(),
        check('skills').notEmpty(),
        check('availability').notEmpty()
    ],
    controller.createTutor);

router.patch('/:tutorId', authCheck, controller.updateTutor);

router.delete('/:tutorId', authCheck, controller.deleteTutor);

module.exports = router;