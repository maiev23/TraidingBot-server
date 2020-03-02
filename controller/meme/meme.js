const { users } = require('../../models');
const secretObj = require('../../config/jwt');
const jwt = require('jsonwebtoken')
const Upbit= require('../Upbit')
module.exports = {
    post: async (req, res) => {
        console.log(1)
        console.log(req.body)
        let token = await req.body.token
        if (token === undefined) {
            console.log('토큰없음')
          res.status(401).send('need user token')
        } else {
          let decoded = await jwt.verify(token, secretObj.secret)
          console.log(decoded.username)
          // TODO : 유저의 session을 이용하여, 데이터베이스에 있는 정보를 제공하도록 구현하세요.
          if (!decoded) {
              console.log('토큰 인증실패')
            res.status(401).send('need user token')
          } else {
            // console.log("aaaa------", req.body)
            let key = await users.findOne({
              where: {
                username: decoded.username
              }
            })
            const upbit = new Upbit(key.sKey, key.aKey)
            let json = await upbit.order_chance(req.body.market)
            res.status(201).send(json.data)
          }
        }
    }
  };
  