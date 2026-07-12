const mongoose = require("mongoose");

const donationschema = new mongoose.Schema({
    donor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    donationtype:{
        type:String,
        enum:['raw','cooked'],
        required:true
    },
    foodcategory:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    quantityUnit:{
        type:String,
        enum:["kg","plate","serving","packets"],
        required:true
    },
    pickupLocation:{
        type:String,
        required:true
    },
    availableTill: {
        type: Date,
        required: true
    },

    cookedAt: Date,
    expiryDate: Date,

    vegType: {
        type: String,
        enum: ['veg', 'nonveg', 'mixed']
    },

    status: {
        type: String,
        enum: ['pending', 'available', 'accepted', 'rejected', 'assigned', 'pickedup', 'delivered'],
        default: 'pending'
    },

    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    deliveryPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    rejectionReason: {
        type: String,
        default: ''
    }

}, { timestamps: true }
);

module.exports = mongoose.model("Donation",donationschema)