const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    // subjectMatter: { type: String, required: true }, // e.g., "CS 3305"
    // duration: { type: Number, required: true, default: 1 }, // 1 means 1 hour. e.g., 2 = 2 hours, 3 = 3 hours. decimals are not allowed
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    meeting: {
        url: { type: String, required: true, default: '' },
        zoomId: { type: String, required: true, default: '' },
        password: { type: String, required: true, default: '' }
    }
}, { versionKey: false });

module.exports = mongoose.model('Appointment', appointmentSchema);