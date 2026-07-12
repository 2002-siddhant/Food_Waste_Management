const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/jwtauthmiddleware');
const {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsRead,
} = require('../Controllers/notificationController');

router.get('/', authMiddleware, getNotifications);
router.get('/unread-count', authMiddleware, getUnreadCount);
router.patch('/:id/read', authMiddleware, markNotificationAsRead);
router.patch('/mark-all-read', authMiddleware, markAllNotificationsRead);

module.exports = router;
