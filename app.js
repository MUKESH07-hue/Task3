const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express();
const dotenv = require('dotenv');
dotenv.config();


//Database Coonection
mongoose.connect('mongodb://localhost:27017/Coursedb')
    .then(
        console.log("Database Connected")
    ).catch(err => { console.log(err) })

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//importing routes
const userRoute = require('./Routes/UserRoutes');
const courseRoute = require('./Routes/CourseRoutes');
const urlencoded = require('body-parser/lib/types/urlencoded');

//Routes middleWare
app.use('/user', userRoute);
app.use('/course', courseRoute);

app.listen(3000, () => {
    console.log("Listening on port 3000!!")
})
