const Donation = require('../Models/donations');
const Delivery = require('../Models/delivery');
const { createDonationStatusNotifications } = require('../utils/notifications');

const parseDateInput = (value) => {
    if (!value) return value;

    if (typeof value === 'string') {
        const trimmedValue = value.trim();
        const datetimeMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
        if (datetimeMatch) {
            const [, year, month, day, hour, minute] = datetimeMatch;
            return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
        }

        const dateMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (dateMatch) {
            const [, year, month, day] = dateMatch;
            return new Date(Number(year), Number(month) - 1, Number(day));
        }
    }

    return new Date(value);
};

const isDonationExpired = (availableTill, now = new Date()) => {
    if (!availableTill) return false;

    const expiryDate = new Date(availableTill);
    if (Number.isNaN(expiryDate.getTime())) return false;

    const currentDay = new Date(now);
    currentDay.setHours(0, 0, 0, 0);

    const expiryDay = new Date(expiryDate);
    expiryDay.setHours(0, 0, 0, 0);

    return expiryDay < currentDay;
};

const autoRejectExpiredDonations = async () => {
    const now = new Date();
    const candidates = await Donation.find({
        status: { $in: ['pending', 'available', 'rejected'] },
        $or: [
            { acceptedBy: null },
            { acceptedBy: { $exists: false } },
        ],
    });

    for (const donation of candidates) {
        const shouldReject = isDonationExpired(donation.availableTill, now);

        if (shouldReject && donation.status !== 'rejected') {
            donation.status = 'rejected';
            donation.rejectionReason = 'Expired before NGO acceptance';
            await donation.save();
        } else if (!shouldReject && donation.status === 'rejected' && donation.rejectionReason === 'Expired before NGO acceptance') {
            donation.status = 'available';
            donation.rejectionReason = '';
            await donation.save();
        }
    }
};

exports.addDonation = async (req, res) => {
    try {
        const donation = req.body;
        const user = req.user;
        const finalDonation = {
            ...donation,
            donor: user.id,
            status: 'available',
            availableTill: parseDateInput(donation.availableTill),
            expiryDate: parseDateInput(donation.expiryDate),
        };

        const response = await Donation.create(finalDonation);
        await createDonationStatusNotifications(response._id, response.status, user.id);

        res.status(201).json({
            message: 'donation added successfully',
            donation: response,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.getMyDonations = async (req, res) => {
    try {
        await autoRejectExpiredDonations();
        const donations = await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 });
        res.json({ donations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch user donations' });
    }
};

exports.getAllDonations = async (req, res) => {
    try {
        await autoRejectExpiredDonations();
        const now = new Date();
        const donations = await Donation.find({
            status: { $in: ['available', 'pending'] },
            $or: [
                { acceptedBy: null },
                { acceptedBy: { $exists: false } },
            ],
        }).sort({ createdAt: -1 });

        const visibleDonations = donations.filter((donation) => !isDonationExpired(donation.availableTill, now));
        res.json({ donations: visibleDonations });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Unable to fetch donations' });
    }
};

exports.getRequestedDonations = async (req, res) => {
    try {
        if (req.user.role !== 'ngos') {
            return res.status(403).json({ message: 'Only NGOs can view requested donations' });
        }

        const donations = await Donation.find({
            acceptedBy: req.user.id,
            status: 'accepted',
        })
            .populate({ path: 'donor', select: 'name email phone address role' })
            .sort({ updatedAt: -1 });

        res.json({ donations });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Unable to fetch requested donations' });
    }
};

exports.acceptDonation = async (req, res) => {
    try {
        if (req.user.role !== 'ngos') {
            return res.status(403).json({ message: 'Only NGOs can accept donations' });
        }

        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        if (donation.status !== 'pending' && donation.status !== 'available') {
            return res.status(400).json({ message: `Donation is already ${donation.status}` });
        }

        if (isDonationExpired(donation.availableTill)) {
            donation.status = 'rejected';
            donation.rejectionReason = 'Expired before NGO acceptance';
            await donation.save();
            return res.status(400).json({ message: 'This donation has expired and cannot be accepted.' });
        }

        donation.status = 'accepted';
        donation.acceptedBy = req.user.id;
        await donation.save();
        await createDonationStatusNotifications(donation._id, donation.status, req.user.id);

        const updatedDonation = await Donation.findById(donation._id)
            .populate({ path: 'donor', select: 'name email phone address role' })
            .populate({ path: 'acceptedBy', select: 'name email phone address role' });

        res.json({
            message: 'Donation accepted successfully',
            donation: updatedDonation,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Unable to accept donation' });
    }
};

exports.getAssignedDeliveries = async (req, res) => {
    try {
        if (req.user.role !== 'delivery') {
            return res.status(403).json({ message: 'Only delivery partners can view assigned deliveries' });
        }

        const deliveries = await Delivery.find({ deliveryPerson: req.user.id })
            .populate({
                path: 'donation',
                select: 'title status donationtype foodcategory quantity quantityUnit pickupLocation availableTill donor acceptedBy deliveryPartner',
                populate: [
                    { path: 'donor', select: 'name email phone address role' },
                    { path: 'acceptedBy', select: 'name email phone address role' },
                    { path: 'deliveryPartner', select: 'name email phone address role' },
                ],
            })
            .populate({ path: 'deliveryPerson', select: 'name email phone address role' })
            .populate({ path: 'assignedby', select: 'name email phone address role' })
            .sort({ updatedAt: -1 });

        res.json({ deliveries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch assigned deliveries' });
    }
};

exports.updateDeliveryStatus = async (req, res) => {
    try {
        if (req.user.role !== 'delivery') {
            return res.status(403).json({ message: 'Only delivery partners can update delivery status' });
        }

        const { status } = req.body;
        const allowedStatuses = ['pickedup', 'delivered'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid delivery status' });
        }

        const delivery = await Delivery.findOne({ _id: req.params.deliveryId, deliveryPerson: req.user.id });
        if (!delivery) {
            return res.status(404).json({ message: 'Delivery assignment not found' });
        }

        if (status === 'pickedup' && delivery.status !== 'assigned') {
            return res.status(400).json({ message: 'Delivery must be assigned before pickup' });
        }

        if (status === 'delivered' && delivery.status !== 'pickedup') {
            return res.status(400).json({ message: 'Delivery must be picked up before it can be delivered' });
        }

        delivery.status = status;
        await delivery.save();

        const donation = await Donation.findById(delivery.donation);
        if (donation) {
            donation.status = status === 'delivered' ? 'delivered' : 'pickedup';
            await donation.save();
        }

        await createDonationStatusNotifications(donation?._id, donation?.status, req.user.id);

        const updatedDelivery = await Delivery.findById(delivery._id)
            .populate({
                path: 'donation',
                select: 'title status donationtype foodcategory quantity quantityUnit pickupLocation availableTill donor acceptedBy deliveryPartner',
                populate: [
                    { path: 'donor', select: 'name email phone address role' },
                    { path: 'acceptedBy', select: 'name email phone address role' },
                    { path: 'deliveryPartner', select: 'name email phone address role' },
                ],
            })
            .populate({ path: 'deliveryPerson', select: 'name email phone address role' })
            .populate({ path: 'assignedby', select: 'name email phone address role' });

        res.json({ delivery: updatedDelivery, donation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to update delivery status' });
    }
};

exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id)
            .populate({ path: 'donor', select: 'name email phone address role' })
            .populate({ path: 'acceptedBy', select: 'name email phone address role' });

        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }

        let delivery = null;
        if (donation.status === 'delivered') {
            delivery = await Delivery.findOne({ donation: donation._id })
                .populate({ path: 'deliveryPerson', select: 'name phone email' })
                .populate({ path: 'assignedby', select: 'name email phone' });
        }

        res.json({ donation: { ...donation.toObject(), delivery } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to fetch donation' });
    }
};
