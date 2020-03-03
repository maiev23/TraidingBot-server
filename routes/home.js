const express = require('express');
const router = express.Router();

const { homeController } = require('../controller');

// POST /signup
router.post('/', homeController.signup.post);

// 비밀번호를 잊으셨습니까?

// 이미 아이디가 존재하고 있는지 확인하시겠습니까?


module.exports = router;
