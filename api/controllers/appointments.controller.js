const { validationResult } = require('express-validator');
const { findOneAndUpdate } = require('../models/appointment.model');
const Appointment = require('../models/appointment.model');
const User = require('../models/user.model');
const mailHelper = require('../helpers/mail-helper');
const zoomHelper = require('../helpers/zoom-helper');
const TIMEMAP = [
    '12AM',
    '1AM',
    '2AM',
    '3AM',
    '4AM',
    '5AM',
    '6AM',
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
    '7PM',
    '8PM',
    '9PM',
    '10PM',
    '11PM',
    '12AM',
];

/*
const WEEKDAY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

module.exports.getTutors = (req, res) => {
    const pageSize = req.query.pageSize || 8;
    const pageNumber = req.query.pageNumber || 0;
    const filter = { isTutor: true };
    const search = req.query.searchQuery ? req.query.searchQuery.trim().toLowerCase() : undefined;
    const availableMin = req.query.availableMin || 0;
    const availableMax = req.query.availableMax || 24;
    const date = req.query.date === 'undefined' ? undefined : req.query.date;

    Appointment.find(filter)
        .then(tutors => {
            if (search) {
                tutors = tutors.filter(tutor => {
                    const nameMatch = `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(search) || `${tutor.firstName}${tutor.lastName}`.toLowerCase().includes(search);
                    let skillMatch = false;
                    tutor.skills.forEach(skill => {
                        if (skill.includes(search.toUpperCase() || skill.split(' ').join('').includes(search.toUpperCase()))) {
                            skillMatch = true;
                        }
                    });

                    return nameMatch || skillMatch;
                });
            }

            if (date) {
                const filterDate = new Date(date);
                const dow = WEEKDAY[filterDate.getDay()];
                tutors = tutors.filter(tutor => {
                    return tutor.availability[dow].length > 0;
                });
            }

            if (availableMin > -1 && availableMax > -1) {
                tutors = tutors.filter(tutor => {
                    let found = false;
                    for (let i = 0; i < 7; i++) {
                        for (let availability of tutor.availability[WEEKDAY[i]]) {
                            if (availability.from >= availableMin && availability.to <= availableMax) found = true;
                        }
                    }
                    return found;
                });
            }

            const skip = pageNumber * pageSize;

            res.status(200).json({
                tutorCount: tutors.length,
                pageCount: Math.ceil(tutors.length / pageSize),
                pageNumber,
                tutors: tutors.slice(skip, skip + pageSize)
            })
        })
        .catch((error) => { console.log(error); res.status(500).json({ message: 'Failed to fetch tutors.' }); });
};
*/
module.exports.getAppointmentById = (req, res) => {
    Appointment.findById(req.params.appointmentId, '-password')
        .then(Appointment => {
            if (!Appointment) return res.status(404).json({ message: 'No appointment found with the provided ID.' });
            res.status(200).json(Appointment);
        })
        .catch(() => { res.status(500).json({ message: 'Failed to fetch appointment.' }); });
};

module.exports.createAppointment = async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'One or more required parameters is missing or malformed.' });
    }

    const { userId: studentId, firstName, lastName, email } = req.userData;
    const { tutorId, date, from, to } = req.body;

    if (from > to) {
        return res.status(400).json({ message: 'One or more required parameters is missing or malformed.' });
    }

    let tutor;
    try {
        tutor = await User.findById(tutorId);
    } catch (e) {
        return res.status(500).json({ message: 'Failed to create appointment.' });
    }

    Appointment.findOne({ tutorId, date, from, to })
        .then(appointment => {
            if (appointment) {
                return res.status(409).json({ message: 'There is already an appointment scheduled for that day and time slot.', code: 'SCHEDULE_CONFLICT' });
            }

            zoomHelper.generateMeeting(`Meeting with ${tutor.firstName} ${tutor.lastName}`, date)
                .then(meeting => {
                    const appt = new Appointment({
                        studentId,
                        tutorId,
                        date: (new Date(date)).toISOString(),
                        from,
                        to,
                        meeting
                    });

                    appt.save()
                        .then(appointment => {
                            // send a message to the student that their appointment has been confirmed
                            mailHelper.sendMessage(email, 'Your appointment confirmation', `<p>Hello ${firstName},<br><br>Your tutoring appointment with ${tutor.firstName} ${tutor.lastName} on ${new Date(date).toLocaleDateString()} at ${TIMEMAP[from]} has been confirmed.<br><br>Join the meeting with this link: ${meeting.url}.<br><br>If that doesn't work, you can join the Zoom meeting manually using ${meeting.zoomId} as the meeting ID and ${meeting.password} as the password.<br><br>To view all of your upcoming appointments, visit <a href="https://www.utdtutoring.com/profile">https://www.utdtutoring.com/profile</a>.</p>`);
                            if (tutor) {
                                // send a message to the tutor to alert them that a student has scheduled an appointment with them
                                mailHelper.sendMessage(tutor.email, 'New tutoring appointment', `<p>Hello ${tutor.firstName},<br><br>${firstName} ${lastName} has scheduled a tutoring session with you on ${new Date(date).toLocaleDateString()} at ${TIMEMAP[from]}.<br><br>Join the meeting with this link: ${meeting.url}.<br><br>If that doesn't work, you can join the Zoom meeting manually using ${meeting.zoomId} as the meeting ID and ${meeting.password} as the password.<br><br>To view all of your upcoming appointments, visit <a href="https://www.utdtutoring.com/profile">https://www.utdtutoring.com/profile</a>.</p>`)
                            }
                            res.status(201).json(appointment);
                        })
                        .catch(error => {
                            console.log(error);
                            res.status(500).json({ message: 'Failed to create appointment.' });
                        });
                    User.findOneAndUpdate({ _id: studentId }, { $inc: { "hoursTutor": 1 } }).then(User => { if (!User) return res.status(404).json({ message: 'Could not find User.' }); })
                    User.findOneAndUpdate({ _id: tutorId }, { $inc: { "hoursTutor": 1 } }).then(User => { if (!User) return res.status(404).json({ message: 'Could not find User.' }); })

                })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({ message: 'Failed to create appointment.' });
                });
        })
        .catch(err => {
            console.log(err);
        });

};
/*
// do not use this route for signing up tutors
module.exports.createTutor = (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'One or more required parameters is missing or malformed.' });
    }

    const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'.split(' ');

    const { firstName, lastName, skills, availability } = req.body;

    const tutor = new User({
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}${lastName.toLowerCase()}@utdallas.edu`,
        password: 'password123',
        favoriteTutors: [],
        isTutor: true,
        isAdmin: false,
        aboutMe: lorem.splice(0, Math.floor(Math.random() * lorem.length)).join(' '),
        skills,
        profilePictureUrl: 'https://placeholder.com/assets/images/150x150-2-500x500.png',
        availability
    });

    tutor.save()
        .then(tutor => { res.status(201).json(tutor); })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: 'Failed to create tutor.' });
        });
};
*/
module.exports.updateAppointment = (req, res) => {
    Appointment.findByIdAndUpdate(req.params.appointmentId, req.body, { new: true })
        .then(appointment => { res.status(200).json({ message: 'Updated appointment.', appointment }); })
        .catch(() => { res.status(500).json({ message: 'Failed to update appointment.' }); });
};

module.exports.deleteAppointment = (req, res) => {
    Appointment.findById(req.params.appointmentId)
        .then(appointment => {
            if (!appointment) return res.status(404).json({ message: 'No appointment found with the provided ID.' });
            if (new Date(new Date().setDate(new Date().getDate() + 1)) > new Date(appointment.date)) {
                return res.status(400).json({ message: 'Unable to cancel appointment as it is less than 24 hours from now.', code: 'NO_CANCEL_WITHIN_24_HOURS' });
            }
            appointment.delete()
                .then(() => {
                    User.findOneAndUpdate({ _id: appointment.studentId }, { $inc: { "hoursTutor": -1 } }).then(User => { if (!User) return res.status(404).json({ message: 'Could not find User.' }); })
                    User.findOneAndUpdate({ _id: appointment.tutorId }, { $inc: { "hoursTutor": -1 } }).then(User => { if (!User) return res.status(404).json({ message: 'Could not find User.' }); })
                    res.status(204).json({ message: 'Deleted appointment.' });
                })
                .catch(() => { return res.status(500).json({ message: 'Failed to delete appointment.' }) });
        })
        .catch(() => { res.status(500).json({ message: 'Failed to delete appointment.' }); });
};

module.exports.getAllAppointment = (req, res) => {
    let filter = {};
    if (req.query.tutorId) filter.tutorId = req.query.tutorId;
    if (req.query.studentId) filter.studentId = req.query.studentId;

    Appointment.find(filter)
        .populate('studentId')
        .populate('tutorId')
        .sort({ date: 'asc' })
        .then(appointments => {
            res.json(appointments);
        });

    return;

    const userId = req.query.tutorId === 'undefined' ? undefined : req.query.tutorId && req.query.studentId === 'undefined' ? undefined : req.query.studentId;
    const tutorId = req.query.tutorId === 'undefined' ? undefined : req.query.tutorId;
    const studentId = req.query.studentId === 'undefined' ? undefined : req.query.studentId;


    if (tutorId)
        Appointment.find({
            $or: [
                { tutorId: tutorId }

            ]
        })
        .populate('studentId')
        .then(Appointment => { res.status(200).json(Appointment); })
            .catch((err) => {
                console.log(err);
                res.status(404).json({ message: 'No routes are found.' });
            });
    else if (studentId)
        Appointment.find({
            $or: [

                { studentId: studentId }
            ]
        })
        .then(Appointment => { res.status(200).json(Appointment); })
            .catch(() => {
                res.status(404).json({ message: 'No routes are found.' });
            });

    else if (userId)
        Appointment.find({
            $and: [
                { tutorId: tutorId }
                , { studentId: studentId }
            ]
        })
            .then(Appointment => { res.status(200).json(Appointment); })
            .catch(() => {
                res.status(404).json({ message: 'No routes are found.' });
            });

    else
        Appointment.find({}).then(Appointment => { res.status(200).json(Appointment); })
            .catch(() => {
                res.status(404).json({ message: 'No routes are found.' });
            });


};
