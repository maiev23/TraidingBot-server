var crypto = require('crypto');

// Hashing

var randomSaltGenerator = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};

var saltHashPassword = function (userpassword, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(userpassword, salt, 100263, 64, 'sha512', (err, key) => {
      if (err) {
        reject(err);
      } else {
        resolve(key.toString('hex'));
      }
    });
  });
}

// Encryption & Decryption

const cipher = crypto.createCipher('aes-256-cbc', '열쇠');
let result = cipher.update('암호화할문장', 'utf8', 'base64'); // 'HbMtmFdroLU0arLpMflQ'
result += cipher.final('base64'); // 'HbMtmFdroLU0arLpMflQYtt8xEf4lrPn5tX5k+a8Nzw='

const decipher = crypto.createDecipher('aes-256-cbc', '열쇠');
let result2 = decipher.update(result, 'base64', 'utf8'); // 암호화할문 (base64, utf8이 위의 cipher과 반대 순서입니다.)
result2 += decipher.final('utf8'); // 암호화할문장 (여기도 base64대신 utf8)


const { users } = require('../../models');

module.exports = {
  post: async (req, res) => {
    // sKey와 aKey의 타당성을 확인하기 위해서 테스트로 해당 key들을 이용한 API
    let salt = randomSaltGenerator(16);
    let password = await saltHashPassword(req.body.password, salt);

    users.findOrCreate({
      where: {
        username: req.body.username
      },
      defaults: {
        username: req.body.username,
        password: password, // hashing
        sKey: req.body.sKey, // encryption  
        aKey: req.body.aKey, // encryption
        salt: salt
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