const { type } = require('express/lib/response');
const { string } = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        Username: {
            type: String,
            required: true,
            unique: true
        },
        PhoneNumber:
        {
            type: String,
            unique: true,
            required: true
        },
        Email:
        {
            type: String,
            required: true

        },
        Password:
        {
            type: String,
            required: true

        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ]
    });



module.exports = new mongoose.model('User', userSchema);