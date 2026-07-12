const mongoose = require('mongoose');
const deliverySchema = new mongoose.Schema({
    donation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation',
        required: true
    },
    deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type: String,
        enum: ['assigned', 'pickedup', 'delivered'],
        default: 'assigned'
    }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);