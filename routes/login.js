const express = require('express');
const router = express.Router();
const { users } = require('../models');

// const { userController } = require('../controller');

const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");

// 1.jwt 객체의 sign()메서드를 호출해서 토큰을 생성한다.
router.post('/', async (req, res) => {
    let token = jwt.sign({
        username: "abc@gmail.com"  // 토근의 내용(payload)
    }, secretObj.secret); //비밀 키 

    //2. sequelize를 사용해서 요청한 이메일 주소에 해당하는 정보를 DB에서 조회합니다.
    users.findOne({
        where: {
            username: req.body.username
        }
    })
        .then(user => {
          if (user.password === req.body.password) {
            res.cookie("user: ", token);
            res.json({
                token: token
            })
        } else {
            res.status(409).send("email doesn't exist");
        }
        })
});

module.exports = router;

/*
router.post('/', (req, res) => {
    // controller에다가 배분해주시고 findOrCreate 대신 login 기능에 쓰일만한 sequelize method를 찾아주세요
    user.find({
      where: {
        username: req.body.username,
        password: req.body.password
      },
      defaults: {
        username: req.body.username,
        password: req.body.password
      }
    })
      .spread((user, created) => {
        if (created) {
          res.status(200).send(user.dataValues);
        } else {
          res.status(409).send('User already exists')
        }
      })
  });
*/