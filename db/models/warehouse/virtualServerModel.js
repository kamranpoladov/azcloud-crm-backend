const mongoose = require('mongoose');
const Customer = require('../customerModel');
const Cluster = require('./clusterModel');

const vsSchema = new mongoose.Schema({
    cores: {
        type: Number,
        required: true
    },
    ram: {
        type: Number,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Cluster'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    }
});

vsSchema.methods.getClockSpeedAndStorage = async function() {
    const parent = await Cluster.findById(this.parent);
    return {
        clockSpeed: parent.clockSpeed,
        storage: parent.storage
    }
}

vsSchema.methods.getClockSpeedAndStorage = async function () {
    const parent = await Cluster.findById(this.parent);
    return {
        clockSpeed: parent.clockSpeed,
        storage: parent.storage
    };
};

const VS = mongoose.model('VS', vsSchema);
module.exports = VS;