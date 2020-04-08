const express = require('express');
const router = express.Router();

const { memeController } = require('../controller');

router.post('/', memeController.meme.post);

module.exports = router;