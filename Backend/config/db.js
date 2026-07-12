const mongoose = require('mongoose');

const connection = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/foodwastemgmt', {
            
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connection;