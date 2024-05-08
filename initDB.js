// initDB.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Incorporate the user schema directly if you don't have a separate user.js file
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    stepsUrl: String,
    sleepUrl: String,
    fiwareService: String,
    fiwareServicePath: String,
});

const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb+srv://kristinaderyagina:testuser1@cluster0.etwheso.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const newUser = new User({
    username: 'User5',
    password: bcrypt.hashSync('renros1', 10),
    stepsUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/659ec1ed0fccd33c0f418709',
    sleepUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/659ec2230fccd33c0f41871b',
    fiwareService: 'e8031e12_d9ba_40d8_9d06_d51da89ce08c',
    fiwareServicePath: '/e8031e12_d9ba_40d8_9d06_d51da89ce08c',
});

newUser.save()
    .then(() => {
        console.log('User successfully inserted');
        mongoose.connection.close();
    })
    .catch(error => {
        console.error('Error inserting user:', error);
        mongoose.connection.close();
    });
//    { username: 'User1', password: 'lfhliur1', stepsUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/6578612cd7539329b6a8a285', sleepUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/6578627bd7539329b6a8a2e5' },
// { username: 'User2', password: 'fieywgf2', stepsUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/659ec1ed0fccd33c0f418709', sleepUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/659ec2230fccd33c0f41871b' },


//const newUser = new User({
//     username: 'User4',
//     password: bcrypt.hashSync('lfhliur111', 10),
//     stepsUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/6578612cd7539329b6a8a285',
//     sleepUrl: 'https://evita-dashboard.evita.digital-enabler.eng.it/v2/entities/6578627bd7539329b6a8a2e5',
//     fiwareService: 'a5d8564c_391f_4958_a597_5fae30de6309',
//     fiwareServicePath: '/a5d8564c_391f_4958_a597_5fae30de6309',
// });

