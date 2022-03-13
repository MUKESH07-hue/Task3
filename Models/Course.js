const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    CourseName: {
        type: String,
        required: true
    },
    CourseDescription:
    {
        type: String,
        required: true
    },
    CoursePrice:
    {
        type: Number,
        required: true
    },
    CourseTutor:
    {
        type: String,
        required: true
    },
    TutorRating:
    {
        type: Number,

    },
    TutorExperience:
    {
        type: String
    },
    VideoLink:
    {
        type: String,
        required: true
    },
    CourseImage:
    {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = new mongoose.model('Course', courseSchema);