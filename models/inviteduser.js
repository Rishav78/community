const mongosse = require('mongoose');

const inviteduserSchema = new mongosse.Schema({
    UserId: {
        type: mongosse.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    communityId: {
        type: mongosse.Schema.Types.ObjectId,
        ref: 'communitys',
        required: true
    },
});

module.exports = mongosse.model('invitedusers', inviteduserSchema);