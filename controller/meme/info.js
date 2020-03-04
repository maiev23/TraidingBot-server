const { users } = require('../../models');
const secretObj = require('../../config/jwt');
const jwt = require('jsonwebtoken');
const Upbit = require('../Upbit');
const crypto = require('crypto');
/*
1. 토큰을 안보냇을떄 

2. if invalid access token을 보냈을떄:

a) refresh토큰을 클라이언트가 가지고 있을때 - new access token 발급

b) expire된 refresh토큰을 클라이언트가 보낼 떄 -클라이언트 강제 로그아웃  (어디서 강제로 로그아웃 시키지?)

3. if access token 있을떄  - 정상작동
*/

/*
클라이언트한테 accesstoken을 받음 - accesstoken verify:
1) if err
2) 잘 작동

1. 엑세스 토큰인가? no
2. 리프레시 토큰인가? 
*/

module.exports = {
  post: async (req, res) => {
    let { accessToken, refreshToken } = req.body;
    if (accessToken !== undefined) {
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
          
          //let json = await upbit.order_chance(req.body.market)
          let json = await upbit.order_chance("KRW-BTC")
          
          //console.log(json)
          res.status(201).send(json.data)
        }
      })

      //access토큰 없이 refresh토큰만 받았을때
    } else if (accessToken === undefined) {
      if (refreshToken !== undefined) {
        jwt.verify(refreshToken, secretObj.secret, async function (err, decoded) {
          if (err) {
            console.log('리프레시 토큰 인증실패 (expired)')
            res.status(401).send('invalid refresh token')
          } else {
            accessToken = jwt.sign({  //새로운 access 토큰 발급
              username: decoded.username  // 토근의 내용(payload)
            }, secretObj.secret, {
              expiresIn: '1m'
            });
            res.send(accessToken); //새로운 access토큰을 client에게 보냄


          }
        })
      }
      //accessToken, refreshToken 둘 다 expired 돼서 client를 강제로 로그아웃 시킨다.
    } else {res.redirect("/login")}
  }
}


/*
module.exports = {
    post: async (req, res) => {
        let accessToken = await req.body.accessToken;
        let refreshToken = req.body.refreshToken;

        if (accessToken === undefined) {
            console.log('토큰없음')
          res.status(401).send('토큰을 보내주셔야 합니다')
        } else {
          jwt.verify(accessToken, secretObj.secret, async function(err,decoded){
            if(err){
              console.log('토큰 인증실패')
              res.status(401).send('invalid access token')
            } else{
              let key = await users.findOne({
                where: {
                  username: decoded.username
                }
              })
              const upbit = new Upbit(key.sKey, key.aKey)
              let json = await upbit.order_chance(req.body.market)
              res.status(201).send(json.data)
            }
    })
  }
}
}
*/