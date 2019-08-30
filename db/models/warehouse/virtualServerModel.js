const mongoose = require('mongoose');
const Customer = require('../customerModel');
const Cluster = require('./clusterModel');

const vsSchema = new mongoose.Schema({
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
        enum: ['7.2k', '10k', 'ssd'],
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cluster'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
})

const Vs = mongoose.model('Vs', vsSchema);

module.exports = Vs;