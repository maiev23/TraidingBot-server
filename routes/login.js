const express = require('express');
const router = express.Router();
const { userController } = require('../controller');

router.post('/', userController.login.post);

<<<<<<< HEAD
module.exports = router;
=======

module.exports = router;

>>>>>>> fd24bcc2a81afb9b7aba39e7dc14215ce3d176ef
