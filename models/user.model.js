const mongoose = require('mongoose');

const User = mongoose.model(
    "User", new mongoose.Schema({
        id:{
            type: Number,
            unique: true,
            required: true,
        },
        email:{
            type: String,
            unique: true,
            required: true,
            minlength:1,
            maxlength:255
        },
        first_name:{
            type: String,
            required: false,
            maxlength:255
        },
        last_name:{
            type: String,
            required: false,
            maxlength:255
        },
        avatar:{
            type: String,
            required: false,
            maxlength:255
        }
    })
);

module.exports = User;