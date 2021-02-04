const express = require('express');
const app = express()
const userRoutes = require('./routes/user');
const gameRoutes = require('./routes/game');
const historicRoutes = require('./routes/historic');
const statsRoutes = require('./routes/stats');
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

let dbConnection;
mongoose.connect(process.env.DB_LOGIN,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
    dbConnection = true;
  })
  .catch(() => {
    console.log('Connexion à MongoDB échouée !');
    dbConnection = false;
  });

app.use('/api/test', (req, res, next) => {
  if(dbConnection) {
    res.status(200).json({ message : 'connected well' })
  } else {
    res.status(400).json({ error : 'connection failed' })
  }
})

app.use('/api/auth/game', gameRoutes);
app.use('/api/auth/historic', historicRoutes);
app.use('/api/auth/stats', statsRoutes);
app.use('/api/auth/matchmaking', matchmakingRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;