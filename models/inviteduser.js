const mongosse = require('./db');

const inviteduserSchema = new mongosse.Schema({
    UserId: {
        type: mongosse.Schema.Types.ObjectId,
        ref: 'users',
    },
    communityId: {
        type: mongosse.Schema.Types.ObjectId,
        ref: 'communitys',
    },
});

module.exports = mongosse.model('invitedusers', inviteduserSchema);