const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const cors = require('cors');
const {checkUser, requireAuth} = require('./middlewares/auth.middleware');
require('dotenv').config({path: './config/.env'});
require('./config/db');

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE',
  'preflightContinue': false
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// JWT
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user.id);
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


// Server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`)
})