const mongoose = require('./db');

const communitySchema = new mongoose.Schema({
    CommunityName: {
        type: String
    }, 
    MembershipRule: {
        type: String,
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
    }, 
    Members: {
        type: Number,
        default: 0,
    },
    User: {
        type: Number,
        default: 0,
    }, 
    Invited: {
        type: Number,
        default: 0,
    }, 
    CommunityPic: {
        type: String,
    }, 
    Status: {
        type: String,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('communitys', communitySchema);