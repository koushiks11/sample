const mongoose = require('mongoose');

// Define the Mongoose schema for the user
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});



// Create a Mongoose model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
