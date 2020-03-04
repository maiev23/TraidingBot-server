const crypto = require('crypto');
const { users } = require('../../models');


const jwt = require('jsonwebtoken')
const secretObj = require('../../config/jwt');

module.exports = {
    post: (req, res) => {
        let token = jwt.sign({
            username: req.body.username  // 토근의 내용(payload)
        }, secretObj.secret, {
            expiresIn: '30m'

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

        users.findOne({
            where: {
                username: req.body.username
            }
        })
            .then(async user => {
                let passwordLogged = await saltHashPassword(req.body.password, user.salt);

                if (user.password === passwordLogged) {
                    res.json({
                        token: token
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