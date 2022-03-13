const { default: mongoose } = require('mongoose');
const Course = require('../Models/Course');
const User = require('../Models/User');

exports.viewAllCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({
            message: "All Courses",
            data: courses
        })
    } catch (error) {
        res.status(400).json({
            message: "Cannot view Courses"
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
        else {
            const course = await new Course({
                CourseName: req.body.CourseName,
                CourseDescription: req.body.CourseDescription,
                CoursePrice: req.body.CoursePrice,
                CourseTutor: req.body.CourseTutor,
                TutorRating: req.body.TutorRating,
                TutorExperience: req.body.TutorExperience,
                VideoLink: req.body.VideoLink,
                CourseImage: req.file.filename,

            })
            await course.save();

            res.status(200).json({
                message: " Course Added Successfully",
                CourseName: course.CourseName,
                CoursePrice: course.CoursePrice,
                CourseTutor: course.CourseTutor
            })
        }

    } catch (error) {
        res.status(400).json({
            data: error
        })
    }
}


exports.viewOneCourse = async (req, res) => {
    try {
        const id = req.params.courseId;
        const course = await Course.findById(id).populate('user', 'Username');
        if (course) {
            res.status(200).json({
                data: course
            })
        }
        else {
            res.status(400).json({
                message: "Course Not Found"
            })
        }

    } catch (error) {
        res.send(error);
    }
}

exports.modifyCourse = async (req, res) => {
    try {
        const id = req.params.courseId;
        const data = await Course.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json({
            message: " Course Added Successfully",
            CourseName: data.CourseName,
            CoursePrice: data.CoursePrice,
            CourseTutor: data.CourseTutor
        })


    } catch (error) {
        res.send(error);
    }
}

exports.deleteOneCourse = async (req, res) => {
    try {
        const id = req.params.courseId;
        const course = await Course.findById(id);

        if (course) {
            const deleteCourse = await Course.findByIdAndDelete(course);
            res.status(200).json({
                message: "Course removed",
                CourseName: deleteCourse.CourseName
            })
        }
        else {
            res.status(400).send({
                message: "Course Not Found"
            })
        }
    } catch (error) {
        res.send(error);
    }
}