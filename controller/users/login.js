const crypto = require('crypto');
const { users } = require('../../models');


const jwt = require('jsonwebtoken')
const secretObj = require('../../config/jwt');

module.exports = {
    post: (req, res) => {
        let accessToken = jwt.sign({
            username: req.body.username  // 토근의 내용(payload)
        }, secretObj.secret, {

            expiresIn: '20m' //access token은 20분

        });

        let refreshToken = jwt.sign({
            username: req.body.username  // 토근의 내용(payload)
        }, secretObj.secret, {
            expiresIn: '2h'//access token은 2시간

        });

        let saltHashPassword = function (userpassword, salt) {
            return new Promise((resolve, reject) => {
                crypto.pbkdf2(userpassword, salt, 100263, 64, 'sha512', (err, key) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(key.toString('hex'));
                    }
                });
            });
        };

        //2. sequelize를 사용해서 요청한 이메일 주소에 해당하는 정보를 DB에서 조회합니다.
        users.findOne({
            where: {
                username: req.body.username
            }
        })
            .then(async user => {
                let passwordLogged = await saltHashPassword(req.body.password, user.salt);

                if (user.password === passwordLogged) {
                    res.send({
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
                } else {
                    console.log(user.password);
                    console.log(passwordLogged);
                    res.status(409).send("wrong password");
                }
            })
            .catch(err => {
                console.log(err);
                res.status(409).send('username does not exist');
            })


    }
};