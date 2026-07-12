const express = require('express');
const router = express.Router();
const User = require('../Models/users');
const authMiddleware = require('../Middlewares/jwtauthmiddleware');

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to fetch user profile' });
    }
});

module.exports = router;
