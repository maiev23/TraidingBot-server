const { users } = require('../../models');
const secretObj = require('../../config/jwt');
const jwt = require('jsonwebtoken')
const Upbit= require('../Upbit')
module.exports = {
    post: async (req, res) => {
        let token = await req.headers.token
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
              const upbit = new Upbit(key.sKey, key.aKey)
              let json = await upbit.order_list(null,req.body.status,null,1)
              res.status(201).send(json.data)
            }
    })
  }
}
}