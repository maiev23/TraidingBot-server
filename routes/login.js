const express = require('express');
const router = express.Router();

const { userController } = require('../controller');

router.post('/', (req, res) => {
    // controller에다가 배분해주시고 findOrCreate 대신 login 기능에 쓰일만한 sequelize method를 찾아주세요 
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
          res.status(409).send('User already exists')
        }
      })
  });

module.exports = router;