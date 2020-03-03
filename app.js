const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

const signupRouter = require('./routes/signup.js');
const loginRouter = require('./routes/login.js');
const memeRouter = require('./routes/meme.js')
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

app.use(
  cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
  })
);

app.use(bodyParser.json());

app.use(cookieParse());

app.get('/', (req, res) => {
  res.send('working');
});

app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/meme', memeRouter);

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`));