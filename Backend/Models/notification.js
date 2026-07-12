const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['donation_status', 'system'],
        default: 'donation_status',
    },
    status: {
        type: String,
        enum: ['pending', 'available', 'accepted', 'rejected', 'assigned', 'pickedup', 'delivered'],
    },
    read: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
