const User = require('./models/User.model');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch(err => console.error('Error connecting to mongo', err));
  
const boss = {
    username: 'admin',
    name: 'Fabio',
    password: process.env.boss_password,
    acessLevel:'BOSS'

}
const newUser = new User(boss)
newUser.save()