const { users } = require('../../models');
const secretObj = require('../../config/jwt');
const jwt = require('jsonwebtoken')
const Upbit= require('../Upbit')
const crypto = require('crypto');
module.exports = {
    post: async (req, res) => {
        let token = await req.body.accessToken
        if (token === undefined) {
            console.log('토큰없음')
          res.status(401).send('need user token')
        } else {
          jwt.verify(token, secretObj.secret, async function(err,decoded){
            if(err){
              console.log('토큰 인증실패')
              res.status(401).send('need user token')
            } else{
              let key = await users.findOne({
                where: {
                  username: decoded.username
                }
              })
            console.log(req.body)
            let decryptPassword = function (key, iv, encryptedPassword) {
              const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
              let result = decipher.update(encryptedPassword, 'base64', 'utf8')
              result += decipher.final('utf8');
              return result;
            }
            let sKey = decryptPassword(key.key, key.iv, key.sKey);
            let aKey = decryptPassword(key.key, key.iv, key.aKey);
  
            const upbit = new Upbit(sKey, aKey)
            let json = await upbit.order_ask(req.body.market, req.body.jumuns, req.body.mesu)
            res.status(201).send(json)
        }
    })
  }
}
}