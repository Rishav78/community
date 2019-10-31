const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Project',{ useNewUrlParser: true }, (err) => {
    if(err) throw err;
});

module.exports = mongoose;