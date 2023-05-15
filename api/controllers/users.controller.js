const User = require('../models/user.model');
const { validationResult } = require('express-validator');

module.exports.getUsers = (req, res) => {
    User.find({}, '-password')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(() => res.status(500).json({ message: 'Failed to fetch users.' }));
};

module.exports.getUserById = (req, res) => {
    User.findById(req.params.userId, '-password')
        .then(user => {
            if (!user) return res.status(404).json({ message: 'No user found with the provided ID.' });
            res.status(200).json(user);
        })
        .catch(() => { res.status(500).json({ message: 'Failed to fetch user.' }); });
};

module.exports.getUserFavorite = (req, res) => {
    User.findById(req.params.userId, '-password')
        .then(user => {
            if (!user) return res.status(404).json({ message: 'No user found with the provided ID.' });
            res.status(200).json(user.favoriteTutors);
        })
        .catch(() => { res.status(500).json({ message: 'Failed to fetch user.' }); });
};

module.exports.makeTutor = (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'One or more required parameters is missing or malformed.' });
    }

    const { userId } = req.userData;
    const { aboutMe, availability, profilePictureUrl, skills } = req.body;

    const update = {
        aboutMe,
        availability,
        profilePictureUrl,
        skills,
        isTutor: true
    };

    User.findByIdAndUpdate(userId, update, { new: true })
        .then(user => res.json(user))
        .catch(error => res.status(500).json('Failed to update user.'));
};