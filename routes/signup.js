const express = require('express');
const router = express.Router();

const { userController } = require('../controller');

// POST /signup
router.post('/', userController.signup.post);

console.log(router);

module.exports = router;