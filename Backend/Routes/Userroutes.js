const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/jwtauthmiddleware');
const { getProfile } = require('../Controllers/userController');

router.get('/profile', authMiddleware, getProfile);

module.exports = router;
