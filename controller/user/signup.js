const {user} = require('../../models');

module.exports = {
    post: (req, res) => {
      user.findOrCreate({
        where: {
          username: req.body.username,
          password: req.body.password
        },
        defaults: {
          username: req.body.username,
          password: req.body.password
        }
      })
        .spread((user, created) => {
          if (created) {
            res.status(200).send(user.dataValues);
          } else {
            res.status(409).send('Already exists user')
          }
        })
    }
  };