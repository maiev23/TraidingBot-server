const {user} = require('../../models');

// test key start

// const request = require('request')
// const uuidv4 = require("uuid/v4")
// const sign = require('jsonwebtoken').sign

// const access_key = process.env.UPBIT_OPEN_API_ACCESS_KEY
// const secret_key = process.env.UPBIT_OPEN_API_SECRET_KEY
// const server_url = process.env.UPBIT_OPEN_API_SERVER_URL

// const payload = {
//     access_key: access_key,
//     nonce: uuidv4(),
// }

// const token = sign(payload, secret_key)

// const options = {
//     method: "GET",
//     url: server_url + "/v1/accounts",
//     headers: {Authorization: `Bearer ${token}`},
// }

// request(options, (error, response, body) => {
//     if (error) throw new Error(error)
//     console.log(body)
// })

// test key end

module.exports = {
    post: (req, res) => {
      // sKey와 aKey의 타당성을 확인하기 위해서 테스트로 해당 key들을 이용한 API 
      user.findOrCreate({
        where: {
          username: req.body.username
        },
        defaults: {
          username: req.body.username,
          password: req.body.password,
          sKey: req.body.sKey,
          aKey: req.body.aKey
        }
      })
        .spread((user, created) => {
          if (created) {
            res.status(200).send(user.dataValues);
          } else {
            res.status(409).send('User already exists')
          }
        })
    }
  };