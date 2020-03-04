const crypto = require('crypto');

// Hashing

let randomStringGenerator = function (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};

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
}

let encryptPassword = function (key, iv, password) {
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv); // 열쇠는 항상 256 bits (32-characters), AES의 iv는 항상 16-characters
  let result = cipher.update(password, 'utf8', 'base64');
  result += cipher.final('base64');
  return result;
}

let decryptPassword = function (key, iv, encryptedPassword) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let result = decipher.update(encryptedPassword, 'base64', 'utf8')
  result += decipher.final('utf8');
  return result;
}

const { users } = require('../../models');

module.exports = {
  post: async (req, res) => {
    // 비밀번호 단방향 암호화
    let salt = randomStringGenerator(16);
    let password = await saltHashPassword(req.body.password, salt);

    // sKey, aKey 양방향 암호화
    let key = randomStringGenerator(32);
    let iv = randomStringGenerator(16);
    let sKey = encryptPassword(key, iv, req.body.sKey);
    let aKey = encryptPassword(key, iv, req.body.aKey);

    users.findOrCreate({
      where: {
        username: req.body.username
      },
      defaults: {
        username: req.body.username,
        password: password, // hashing
        sKey: sKey, // encryption  
        aKey: aKey, // encryption
        salt: salt,
        key: key,
        iv: iv
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