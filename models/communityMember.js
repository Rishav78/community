const mongoose = require('mongoose');

const CMS = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communitys',
    },
    Accepted: {
        type: Boolean,
    },
    Type: {
        type: String,
    },
});

module.exports = mongoose.model('communitymembers', CMS);