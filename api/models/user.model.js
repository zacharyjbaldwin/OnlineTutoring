const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({

    // properties on all users:
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favoriteTutors: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true, default: [] },
    isTutor: { type: Boolean, required: true, default: false },
    isAdmin: { type: Boolean, required: true, default: false },

    // properties exclusive to tutors:
    aboutMe: { type: String, required: false },
    skills: { type: [String], required: true, default: [] },
    profilePictureUrl: { type: String, required: false },

    availability: {
        monday: {
            type: [
                {
                    from: { type: Number, required: true, min: 0, max: 23 }, // 0 is 12AM, 23 is 11PM
                    to: { type: Number, required: true, min: 1, max: 24 } // 1 is 1AM, 24 is 12AM the next day
                }
            ],
            required: true,
            default: [],
            _id: false
        },
        tuesday: { type: [{ from: { type: Number, required: true, min: 0, max: 23 }, to: { type: Number, required: true, min: 1, max: 24 } }], required: true, default: [], _id: false },
        wednesday: { type: [{ from: { type: Number, required: true, min: 0, max: 23 }, to: { type: Number, required: true, min: 1, max: 24 } }], required: true, default: [], _id: false },
        thursday: { type: [{ from: { type: Number, required: true, min: 0, max: 23 }, to: { type: Number, required: true, min: 1, max: 24 } }], required: true, default: [], _id: false },
        friday: { type: [{ from: { type: Number, required: true, min: 0, max: 23 }, to: { type: Number, required: true, min: 1, max: 24 } }], required: true, default: [], _id: false },
        saturday: { type: [{ from: { type: Number, required: true, min: 0, max: 23 }, to: { type: Number, required: true, min: 1, max: 24 } }], required: true, default: [], _id: false },
        sunday: { type: [{ from: { type: Number, required: true, min: 0, max: 23 }, to: { type: Number, required: true, min: 1, max: 24 } }], required: true, default: [], _id: false }
    },
    hoursTutor: {type: Number, required: true, default: 0}
}, { versionKey: false });

mongoose.plugin(uniqueValidator);

module.exports = User = mongoose.model('User', userSchema);