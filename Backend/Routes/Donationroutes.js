const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/jwtauthmiddleware');
const {
    addDonation,
    getMyDonations,
    getAllDonations,
    getRequestedDonations,
    acceptDonation,
    getAssignedDeliveries,
    updateDeliveryStatus,
    getDonationById,
} = require('../Controllers/donationController');

router.post('/adddonation', authMiddleware, addDonation);
router.get('/mydonations', authMiddleware, getMyDonations);
router.get('/alldonations', authMiddleware, getAllDonations);
router.get('/requested', authMiddleware, getRequestedDonations);
router.patch('/:id/accept', authMiddleware, acceptDonation);
router.get('/delivery/assigned', authMiddleware, getAssignedDeliveries);
router.patch('/delivery/:deliveryId/status', authMiddleware, updateDeliveryStatus);
router.get('/:id', authMiddleware, getDonationById);

module.exports = router;
