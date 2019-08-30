const mongoose = require('mongoose');
const VS = require('./virtualServerModel');

const clusterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clockSpeed: {
        type: Number,
        required: true
    },
    cores: {
        type: Number,
        required: true
    },
    ram: {
        type: Number,
        required: true
    },
    storage: {
        type: String,
        enum: ['ssd', '10k', '7.2k'],
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VS'
    }]
});

module.exports = mongoose.model('Cluster', clusterSchema);