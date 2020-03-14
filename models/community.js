const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    CommunityName: {
        type: String,
        required: true,
    }, 
    MembershipRule: {
        type: String,
        required: true
    }, 
    CommunityLocation: {
        type: String
    }, 
    CommunityOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }, 
    Discription: {
        type: String,
    }, 
    TotalReq: {
        type: Number,
        default: 0,
        required: true
    }, 
    Members: {
        type: Number,
        default: 0,
        required: true
    },
    User: {
        type: Number,
        default: 0,
        required: true
    }, 
    Invited: {
        type: Number,
        default: 0,
        required: true
    }, 
    CommunityPic: {
        type: String,
        default: 'defaultCommunity.jpg',
        required: true
    }, 
    Status: {
        type: String,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('communitys', communitySchema);