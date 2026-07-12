const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/jwtauthmiddleware');
const {
    getDashboard,
    getUsers,
    getDeliveryPartners,
    getDonations,
    getDeliveries,
    getReports,
    assignDelivery,
    rejectDonation,
} = require('../Controllers/adminController');

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can access this resource' });
    }
    next();
};

router.use(authMiddleware, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.get('/delivery-partners', getDeliveryPartners);
router.get('/donations', getDonations);
router.get('/deliveries', getDeliveries);
router.get('/reports', getReports);
router.patch('/donations/:id/assign-delivery', assignDelivery);
router.patch('/donations/:id/reject', rejectDonation);

module.exports = router;
