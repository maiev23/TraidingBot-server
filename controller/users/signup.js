var crypto = require('crypto');

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt){
    var value = crypto.createHmac('sha512', salt).update(password).digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);
}

saltHashPassword('kevinpassword');

const { users } = require('../../models');

module.exports = {
  post: (req, res) => {
    // sKey와 aKey의 타당성을 확인하기 위해서 테스트로 해당 key들을 이용한 API 
    users.findOrCreate({
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