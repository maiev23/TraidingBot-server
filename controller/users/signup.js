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