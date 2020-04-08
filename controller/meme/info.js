const { users } = require('../../models');
const secretObj = require('../../config/jwt');
const jwt = require('jsonwebtoken');
const Upbit = require('../Upbit');
const crypto = require('crypto');

/* Access token, refresh token verification flow

1. access 토큰을 받았는가? 

a) yes -> verifying access token -> invalid token이면 에러메세지 전송, valid token이면 매매진행
b) no -> refresh토큰을 받았는가? -> verifying refresh token
c) refresh token이 새로운 access토큰을 client에게 발급, refresh token이 expired 됐다면 client 로그아웃

*/

module.exports = {
  post: async (req, res) => {
    let { accessToken, refreshToken } = req.body;
    if (accessToken) {
      console.log('엑세스 토큰 받음')
      jwt.verify(accessToken, secretObj.secret, async function (err, decoded) {
        if (err) {
          console.log('엑세스 토큰 인증실패 (expired)')
          res.status(401).send('invalid access token')
        } else {
          let key = await users.findOne({
            where: {
              username: decoded.username
            }
          })
          let decryptPassword = function (key, iv, encryptedPassword) {
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let result = decipher.update(encryptedPassword, 'base64', 'utf8')
            result += decipher.final('utf8');
            return result;
          }
          let sKey = decryptPassword(key.key, key.iv, key.sKey);
          let aKey = decryptPassword(key.key, key.iv, key.aKey);

          const upbit = new Upbit(sKey, aKey)
          
          //let json = await upbit.order_chance("KRW-BTC")
          let json = await upbit.order_chance(req.body.market)
          
          //console.log(json)
          res.status(201).send(json.data)
        }
      })

      //access토큰 없이 refresh토큰만 받았을때
    } else{
        jwt.verify(refreshToken, secretObj.secret, async function (err, decoded) {
          if (err) {
            console.log('리프레시 토큰 인증실패 (expired)')
            res.status(401).send('invalid refresh token')
          } else {
            accessToken = jwt.sign({  //새로운 access 토큰 발급
              username: decoded.username  // 토근의 내용(payload)
            }, secretObj.secret, {
              expiresIn: '20m'
            });
            res.send(accessToken); //새로운 access토큰을 client에게 보냄
          }
        })
    } 
  }
}

