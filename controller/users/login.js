const { users } = require('../../models');

const jwt = require('jsonwebtoken')
const secretObj = require('../../config/jwt');

module.exports = {
    post: (req, res) => {
        let token = jwt.sign({
            username: req.body.username  // 토근의 내용(payload)
        }, secretObj.secret, {
            expiresIn: '30m'

          }); //비밀 키 
        //2. sequelize를 사용해서 요청한 이메일 주소에 해당하는 정보를 DB에서 조회합니다.

        users.findOne({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        })
            .then(user => {
                if (user.password === req.body.password) {
                    res.json({
                        token: token
                    })
                } else {
                    res.status(409).send("email doesn't exist");
                }
            })
            .catch(err =>{
                res.status(409).send(err);
            })


    }
};