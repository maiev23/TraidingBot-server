const express = require('express');

const app = express();
const port = 4000;

const signupRouter = require('./routes/signup.js');
const loginRouter = require('./routes/login.js');

const bodyParser = require('body-parser');

const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());

app.use(
    session({
        secret: '@teamTB', // 비밀번호
        resave: false, // 세션 데이터가 바뀌기 전까지는 세션 데이터의 값을 저장하지 않는다
        saveUninitialized: true // 세션이 필요하기 전까지는 세션을 구동 시키지 않는다. 
    })
);

app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).send('Success');
});

app.use('/signup', signupRouter);
app.use('/login', loginRouter);

app.listen(port, () => 
console.log(`Example app listening on port ${port}!`));