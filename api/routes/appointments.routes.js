const router = require('express').Router();
const controller = require('../controllers/appointments.controller');
const { check } = require('express-validator');
const authCheck = require('../middleware/check-auth');

// router.get('/', authCheck, controller.getAppointments);

router.get('/:appointmentId', authCheck, controller.getAppointmentById);

router.post('/',
    authCheck,
    [
        check('tutorId').isMongoId(),
        //check('date').isISO8601(), not working despite giving ISO date
        check('from').isInt({ min: 0, max: 23 }),
        check('to').isInt({ min: 1, max: 24 })
    ],
    controller.createAppointment);
/*
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
*/
router.patch('/:appointmentId', authCheck, controller.updateAppointment);

router.delete('/:appointmentId', authCheck, controller.deleteAppointment);

router.get('/', authCheck, controller.getAllAppointment);

module.exports = router;