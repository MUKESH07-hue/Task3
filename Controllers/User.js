const User = require('../Models/User');
const Course = require('../Models/Course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation, updateValidation } = require('../utils/Validation');
const { response } = require('express');


// show all users
exports.viewAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            message: "All Users",
            data: users
        })
    } catch (error) {
        res.send(error);
    }
}



//Creating a new User
exports.createUser = async (req, res) => {
    try {

        //validating user
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        // UserName check
        const userExist = await User.findOne({ Username: req.body.Username });
        if (userExist) {
            res.status(400).json({
                message: "User already present , Try logging in"
            })
        }
        else {
            try {
                // hash the password before saving it to the database
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.Password, salt);

                const user = new User({
                    Username: req.body.Username,
                    PhoneNumber: req.body.PhoneNumber,
                    Email: req.body.Email,
                    Password: hashedPassword
                })
                const saveUser = await user.save();

                res.status(200).json({
                    message: "User Created SuccessFully",
                    Username: user.Username,
                    id: user._id
                })

            }
            catch (error) {
                res.status(400).json({
                    message: "Phone Number Already Used"
                })
            }
        }

    } catch (error) {
        res.status(400).json({
            message: "User not created",
            data: error
        })
    }
}



// returns user details by username
exports.getUser = async (req, res) => {
    try {
        const user = await User.findOne({ Username: req.params.Username }).populate('courses', 'CourseName');
        res.status(200).json({
            message: "User details",
            Name: user.Username,
            Contact: user.PhoneNumber,
            EmailId: user.Email,
            courses: user.courses


        })
    } catch (error) {
        res.status(400).json({
            message: "User Not Found ",
            error: error
        })
    }
}

// Updating the user
exports.updateUser = async (req, res) => {

    try {

        const { error } = updateValidation(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const user = await User.findOne({ Username: req.params.Username })
        if (user) {


            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.Password, salt);

            const newUser =
            {
                Username: req.body.Username,
                PhoneNumber: req.body.PhoneNumber,
                Email: req.body.Email,
                Password: hashedPassword
            }

            const updateUser = await User.findByIdAndUpdate(user._id, newUser);
            res.status(200).json({
                message: "User details updated",
                Username: user.Username,
                id: user._id
            })

        } else {
            res.status(400).json({
                message: "User not Found ",
            })
        }

    } catch (error) {
        res.status(400).json({
            message: "User details could not be updated ",
            data: error
        })
    }

}

// logging in user
exports.loginUser = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).send({
                data: error.details[0].message
            })
        }
        const user = await User.findOne({ Username: req.body.Username });
        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or PassWord"
            })
        }

        const validPassword = await bcrypt.compare(req.body.Password, user.Password)
        if (!validPassword) {
            return res.status(400).json({
                message: "Invalid Email or PassWord"
            })
        }
        //create and assign a token
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "24h"
        });
        // we dont need to explicitly add header token
        res.header("auth-token", token);

        res.status(200).json({
            name: user.Username,
            message: "SuccessFully logged in",
            token: token
        })

    } catch (error) {
        res.status(400).json({
            message: "Login Failed , Couldn't Find User"
        })
    }
}

exports.addCourse = async (req, res) => {
    try {
        const courseExist = await Course.findOne({ CourseName: req.body.CourseName });
        if (courseExist) {
            return res.status(400).json({
                message: "Course Already present"
            })
        }

        const user = await User.findOne({ Username: req.params.Username })

        const newCourse = await new Course({
            CourseName: req.body.CourseName,
            CourseDescription: req.body.CourseDescription,
            CoursePrice: req.body.CoursePrice,
            CourseTutor: req.body.CourseTutor,
            TutorRating: req.body.TutorRating,
            TutorExperience: req.body.TutorExperience,
            VideoLink: req.body.VideoLink,
            CourseImage: req.file.filename,

        })

        user.courses.push(newCourse);
        newCourse.user = user;

        await user.save();
        await newCourse.save();

        res.status(200).json({
            message: "Successfully registered to the course",
            name: user.Username,
        })
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}