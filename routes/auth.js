const express = require('express');
const router = express.Router();
const handleLogin = require('../controllers/AuthController')

router.post('/', handleLogin)

module.exports = router;
