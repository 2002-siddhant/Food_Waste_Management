const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/jwtauthmiddleware');
const User = require('../Models/users');
const Donation = require('../Models/donations');
const Delivery = require('../Models/delivery');
const { createDonationStatusNotifications } = require('../utils/notifications');

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Only admin can access this resource' });
    }
    next();
};

router.use(authMiddleware, adminOnly);

router.get('/dashboard', async (req, res) => {
    try {
        const [
            totalUsers,
            totalDonors,
            totalNgos,
            totalDeliveryPartners,
            totalAdmins,
            totalDonations,
            statusCounts,
            recentDonations,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'donor' }),
            User.countDocuments({ role: 'ngos' }),
            User.countDocuments({ role: 'delivery' }),
            User.countDocuments({ role: 'admin' }),
            Donation.countDocuments(),
            Donation.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
            Donation.find()
                .populate({ path: 'donor', select: 'name email phone role' })
                .populate({ path: 'acceptedBy', select: 'name email phone role' })
                .populate({ path: 'deliveryPartner', select: 'name email phone role' })
                .sort({ updatedAt: -1 })
                .limit(5),
        ]);

        const donationsByStatus = statusCounts.reduce((acc, item) => {
            acc[item._id || 'pending'] = item.count;
            return acc;
        }, {});

        res.json({
            stats: {
                totalUsers,
                totalDonors,
                totalNgos,
                totalDeliveryPartners,
                totalAdmins,
                totalDonations,
                donationsByStatus,
            },
            recentDonations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch admin dashboard' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ role: 1, name: 1 });

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch users' });
    }
});

router.get('/delivery-partners', async (req, res) => {
    try {
        const deliveryPartners = await User.find({ role: 'delivery' })
            .select('-password');

        const deliveryPartnerIds = deliveryPartners.map((partner) => partner._id);

        const assignmentCounts = await Donation.aggregate([
            { $match: { deliveryPartner: { $in: deliveryPartnerIds } } },
            { $group: { _id: '$deliveryPartner', activeDeliveries: { $sum: 1 } } },
        ]);

        const countMap = Object.fromEntries(
            assignmentCounts.map((item) => [item._id.toString(), item.activeDeliveries])
        );

        const sortedPartners = deliveryPartners
            .map((partner) => ({
                ...partner.toObject(),
                activeDeliveries: countMap[partner._id.toString()] || 0,
            }))
            .sort((a, b) => a.activeDeliveries - b.activeDeliveries || a.name.localeCompare(b.name));

        res.json({ deliveryPartners: sortedPartners });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch delivery partners' });
    }
});

router.get('/donations', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            const statuses = String(req.query.status)
                .split(',')
                .map((value) => value.trim())
                .filter(Boolean);

            filter.status = statuses.length > 1 ? { $in: statuses } : statuses[0];
        }

        const donations = await Donation.find(filter)
            .populate({ path: 'donor', select: 'name email phone address role' })
            .populate({ path: 'acceptedBy', select: 'name email phone address role' })
            .populate({ path: 'deliveryPartner', select: 'name email phone address role' })
            .sort({ createdAt: -1 });

        res.json({ donations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch donations' });
    }
});

router.get('/deliveries', async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const deliveries = await Delivery.find(filter)
            .populate({
                path: 'donation',
                select: 'title status donationtype foodcategory quantity quantityUnit pickupLocation availableTill donor acceptedBy',
                populate: [
                    { path: 'donor', select: 'name email phone address role' },
                    { path: 'acceptedBy', select: 'name email phone address role' },
                ],
            })
            .populate({ path: 'deliveryPerson', select: 'name email phone address role' })
            .populate({ path: 'assignedby', select: 'name email phone address role' })
            .sort({ updatedAt: -1 });

        res.json({ deliveries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch deliveries' });
    }
});

router.get('/reports', async (req, res) => {
    try {
        const [
            quantityByType,
            donationsByCategory,
            topDonors,
            topNgos,
            deliveryStatusCounts,
        ] = await Promise.all([
            Donation.aggregate([
                { $group: { _id: '$donationtype', totalQuantity: { $sum: '$quantity' }, count: { $sum: 1 } } },
            ]),
            Donation.aggregate([
                { $group: { _id: '$foodcategory', count: { $sum: 1 }, totalQuantity: { $sum: '$quantity' } } },
                { $sort: { count: -1 } },
            ]),
            Donation.aggregate([
                { $group: { _id: '$donor', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
                { $unwind: '$user' },
                { $project: { count: 1, name: '$user.name', email: '$user.email', phone: '$user.phone' } },
            ]),
            Donation.aggregate([
                { $match: { acceptedBy: { $ne: null } } },
                { $group: { _id: '$acceptedBy', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
                { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
                { $unwind: '$user' },
                { $project: { count: 1, name: '$user.name', email: '$user.email', phone: '$user.phone' } },
            ]),
            Delivery.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } },
            ]),
        ]);

        res.json({
            quantityByType,
            donationsByCategory,
            topDonors,
            topNgos,
            deliveryStatusCounts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch reports' });
    }
});

router.patch('/donations/:id/assign-delivery', async (req, res) => {
    try {
        const { deliveryPartnerId } = req.body;

        if (!deliveryPartnerId) {
            return res.status(400).json({ message: 'Delivery partner is required' });
        }

        const [donation, deliveryPartner] = await Promise.all([
            Donation.findById(req.params.id),
            User.findOne({ _id: deliveryPartnerId, role: 'delivery' }),
        ]);

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (!deliveryPartner) {
            return res.status(404).json({ message: 'Delivery partner not found' });
        }

        const isNgoAccepted = donation.status === 'accepted' && donation.acceptedBy;
        const isAlreadyAssigned = donation.status === 'assigned';

        if (!isNgoAccepted && !isAlreadyAssigned) {
            return res.status(400).json({ message: 'Only donations accepted by an NGO can be assigned for delivery' });
        }

        donation.status = 'assigned';
        donation.deliveryPartner = deliveryPartner._id;
        await donation.save();

        await Delivery.findOneAndUpdate(
            { donation: donation._id },
            {
                donation: donation._id,
                deliveryPerson: deliveryPartner._id,
                assignedby: req.user.id,
                status: 'assigned',
            },
            { upsert: true, returnDocument: 'after' }
        );

        await createDonationStatusNotifications(donation._id, donation.status, req.user.id);

        const updatedDonation = await Donation.findById(donation._id)
            .populate({ path: 'donor', select: 'name email phone address role' })
            .populate({ path: 'acceptedBy', select: 'name email phone address role' })
            .populate({ path: 'deliveryPartner', select: 'name email phone address role' });

        res.json({
            message: 'Delivery partner assigned successfully',
            donation: updatedDonation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to assign delivery partner' });
    }
});

router.patch('/donations/:id/reject', async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.status === 'delivered') {
            return res.status(400).json({ message: 'Delivered donation cannot be rejected' });
        }

        donation.status = 'rejected';
        donation.deliveryPartner = undefined;
        await donation.save();
        await Delivery.deleteOne({ donation: donation._id });
        await createDonationStatusNotifications(donation._id, donation.status, req.user.id);

        const updatedDonation = await Donation.findById(donation._id)
            .populate({ path: 'donor', select: 'name email phone address role' })
            .populate({ path: 'acceptedBy', select: 'name email phone address role' })
            .populate({ path: 'deliveryPartner', select: 'name email phone address role' });

        res.json({
            message: 'Donation rejected successfully',
            donation: updatedDonation,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to reject donation' });
    }
});

module.exports = router;
