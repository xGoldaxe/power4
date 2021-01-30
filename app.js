const express = require('express');
const app = express()
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const matchmakingRoutes = require('./routes/matchmaking');
const mongoose = require('mongoose');


app.use(express.json());
app.use(express.urlencoded());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

mongoose.connect('mongodb+srv://admin:1234@cluster0.zhtxh.mongodb.net/power4?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/api/auth/game', gameRoutes);
app.use('/api/auth/matchmaking', matchmakingRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;