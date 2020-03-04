const express = require('express');
const router = express.Router();

const { memeController } = require('../controller');

router.post('/info', memeController.info.post);
router.post('/buy', memeController.buy.post);
router.post('/sell', memeController.sell.post);
router.post('/list', memeController.list.post);
router.post('/cancle',memeController.cancle.post)

module.exports = router;