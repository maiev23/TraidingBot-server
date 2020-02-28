const express = require('express');
const router = express.Router();

const { userController } = require('../controller');

// POST /signup
router.post('/', userController.signup.post);


module.exports = router;

/*

router.get('/r1', function(req, res){
	res.send('Hello /p1/r1');		
});

*/