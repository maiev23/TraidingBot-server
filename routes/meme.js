const express = require('express');
const router = express.Router();

const { memeController } = require('../controller');

router.post('/meme', memeController.meme.post);
router.post('/mesu', memeController.mesu.post);
router.post('/medo', memeController.medo.post)

module.exports = router;