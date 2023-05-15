const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateRegisterInput = require("../controllers/register.controller");
const validateLoginInput = require("../controllers/login.controller");


const User = require("../models/user.model");
const keys = process.env.JWT_SECRET || require('../../config.json').JWT_SECRET;

module.exports.register = (req,res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
  // Check validation
  User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists" });
      } else {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.status(200).json(user))
              .catch(err => console.log(err));
          });
        });
      }
    });
};


module.exports.login = (req,res) =>  {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);
    // Check validation
      if (!isValid) {
        return res.status(400).json(errors);
      }
    const email = req.body.email;
    const password = req.body.password;
  // Find user by email
    User.findOne({ email }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ emailnotfound: "Email not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          };
  // Sign token
          jwt.sign(
            payload,
            keys,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              const { firstName, lastName, email, isTutor, isAdmin, _id: userId } = user;
              res.json({
                success: true,
                token: "Bearer " + token,
                expiresIn: 31556926,
                firstName,
                lastName,
                email,
                isTutor,
                isAdmin,
                userId
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  };