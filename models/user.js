const mongoose = require('./db');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
    },
    Email: {
        type: String,
    },
    Password:{
        type: String,
    },
    Phno:{
        type: String,
    }, 
    City: {
        type: String,
    }, 
    DOB: {
        type: String,
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