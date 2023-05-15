const { validationResult } = require('express-validator');
const User = require('../models/user.model');

module.exports.toggleFavoriteTutor = async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ message: 'One or more required parameters is missing or malformed.' });
    }

    const { userId } = req.userData;
    const { tutorId } = req.params;

    const user = await User.findById(userId);
    let response;
    if (user.favoriteTutors.includes(tutorId)) {
        user.favoriteTutors.splice(user.favoriteTutors.indexOf(tutorId), 1);
        response = false;
    } else {
        user.favoriteTutors.push(tutorId);
        response = true;
    }
    await user.save();
    res.status(200).json(response);
};
