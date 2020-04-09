const User = require('../models/User.model');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');

mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err));
  
// const salt = bcrypt.genSaltSync(bcryptSalt);
// const hashPass = bcrypt.hashSync(password, salt);
  
bcrypt.hash(process.env.boss_password, 10)
  .then(hash => {
    User.create({
      username: 'admin',
      name: 'Fabio',
      password: hash,
      role: 'BOSS'
    })
      .then(() => {
        mongoose.connection.close()
      })
      .catch(error => {
        console.log(error)
      });
  });
