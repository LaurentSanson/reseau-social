const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const app = express();
const {checkUser, requireAuth} = require('./middlewares/auth.middleware');
require('dotenv').config({path: './config/.env'});
require('./config/db');

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