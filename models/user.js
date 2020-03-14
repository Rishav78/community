const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password:{
        type: String,
        required: true
    },
    Phno:{
        type: String,
        required: true
    }, 
    City: {
        type: String,
    }, 
    DOB: {
        type: String
    }, 
    Gender: {
        type: String
    }, 
    About: {
        type: String,
    }, 
    Expectations: {
        type: String
    }, 
    Role: {
        type: String,
    }, 
    Status: {
        type: Boolean,
    }, 
    Image: {
        type: String
    }, 
    ActivationState: {
        type: Boolean,
    }, 
    LoginAs: {
        type: String
    }, 
    Verified: {
        type: Boolean,
    }
},{
    timestamps: true,
});

module.exports = mongoose.model('users', userSchema);