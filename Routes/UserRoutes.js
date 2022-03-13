const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken');

const userController = require('../Controllers/User');

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

router.get('/allusers', userController.viewAllUsers);

router.post('/register', userController.createUser);

router.get('/:Username', userController.getUser);

router.patch('/updateuser/:Username', userController.updateUser);

router.post('/login', userController.loginUser);

router.post('/:Username/courses/newcourse', verifyToken, upload.single('CourseImage'), userController.addCourse);



module.exports = router;