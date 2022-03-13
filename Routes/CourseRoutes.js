const express = require('express');
const router = express.Router();
const courseController = require('../Controllers/Course');

const verifyToken = require('../utils/verifyToken');



const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads')
    },

    filename: function (request, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fieldsize: 1024 * 1024 * 3
    }
})

router.get('/allcourses', courseController.viewAllCourses);

router.post('/newcourse', verifyToken, upload.single('CourseImage'), courseController.addCourse);

router.get('/:courseId', courseController.viewOneCourse);

router.patch('/updatecourse/:courseId', verifyToken, courseController.modifyCourse);

router.delete('/deletecourse/:courseId', verifyToken, courseController.deleteOneCourse);


module.exports = router;