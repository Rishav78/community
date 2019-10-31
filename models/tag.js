const mongoose = require('./db');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
    }, 
    CreatedBy: {
        type: String,
    },
},{
    timestamps: true,
});

module.exports = mongoose.model('tags', tagSchema);