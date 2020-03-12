const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(`mongodb://localhost/${process.env.MONGO_DB}`,{ useNewUrlParser: true }, (err) => {
    if(err) throw err;
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected')
});

module.exports = mongoose;