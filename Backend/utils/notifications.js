const Notification = require('../Models/notification');
const Donation = require('../Models/donations');
const User = require('../Models/users');

const uniqueIds = (ids) => {
    return [...new Set(ids.filter(Boolean).map((id) => id.toString()))];
};

const buildDonationStatusContent = (donation, status) => {
    const title = donation.title || 'Food donation';

    const content = {
        pending: {
            title: 'Donation submitted',
            message: `${title} is pending review.`,
        },
        available: {
            title: 'New donation available',
            message: `${title} is available for NGO acceptance.`,
        },
        accepted: {
            title: 'Donation accepted',
            message: `${title} has been accepted by an NGO.`,
        },
        rejected: {
            title: 'Donation rejected',
            message: `${title} was rejected.`,
        },
        assigned: {
            title: 'Delivery assigned',
            message: `A delivery partner has been assigned for ${title}.`,
        },
        pickedup: {
            title: 'Donation picked up',
            message: `${title} has been picked up by the delivery partner.`,
        },
        delivered: {
            title: 'Donation delivered',
            message: `${title} has been delivered successfully.`,
        },
    };

    return content[status] || {
        title: 'Donation status updated',
        message: `${title} status changed to ${status}.`,
    };
};

const getDonationStatusRecipients = async (donation, status) => {
    if (status === 'available') {
        const ngos = await User.find({ role: 'ngos' }).select('_id');
        return ngos.map((ngo) => ngo._id);
    }

    if (status === 'accepted') {
        return uniqueIds([donation.donor]);
    }

    if (status === 'assigned') {
        return uniqueIds([donation.donor, donation.acceptedBy, donation.deliveryPartner]);
    }

    if (status === 'pickedup' || status === 'delivered') {
        return uniqueIds([donation.donor, donation.acceptedBy]);
    }

    if (status === 'rejected') {
        return uniqueIds([donation.donor]);
    }

    return [];
};

const createDonationStatusNotifications = async (donationId, status, actorId = null) => {
    const donation = await Donation.findById(donationId);
    if (!donation) {
        return [];
    }

    const recipients = uniqueIds(await getDonationStatusRecipients(donation, status))
        .filter((recipientId) => recipientId !== actorId?.toString());

    if (recipients.length === 0) {
        return [];
    }

    const content = buildDonationStatusContent(donation, status);
    const notifications = recipients.map((recipient) => ({
        recipient,
        donation: donation._id,
        title: content.title,
        message: content.message,
        status,
        type: 'donation_status',
    }));

    return Notification.insertMany(notifications);
};

module.exports = {
    createDonationStatusNotifications,
};
