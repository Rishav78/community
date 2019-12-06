const users = require('../../models/user');

async function activateUser(req) {
    const { id } = req.params;
    await users.updateOne({ '_id': id }, { ActivationState: true })
}

async function deactivateUser(req) {
    const { id } = req.params;
    await users.updateOne({ '_id': id }, { ActivationState: false })
}

exports.activateAndDeactivate = (req, res) => {
    const { state } = req.body;
    if(state === 1) activateUser(req);
    else deactivateUser(req);
    res.send(req.body);   
}