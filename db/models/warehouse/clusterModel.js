const mongoose = require('mongoose');

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
    RAM: {
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

module.exports = mongoose.Model('Cluster', clusterSchema);