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

vsSchema.methods.getClockSpeedAndStorage = async function () {
    const parent = await Cluster.findById(this.parent);
    return {
        clockSpeed: parent.clockSpeed,
        storage: parent.storage
    };
};

vsSchema.methods.feeAndVat = async function () {
    const basicPricePerCore = 15;
    const basicPricePerRam = 2;

    const vatPercentage = 0.18;

    const clockSpeed = (await this.getClockSpeedAndStorage()).clockSpeed;
    let performanceCategory;

    if (clockSpeed === 2.4) {
        performanceCategory = 1;
    } else if (clockSpeed === 3.2) {
        performanceCategory = 1.5;
    } else if (clockSpeed === 4) {
        performanceCategory = 2;
    }

    const fee = Math.round(Math.sqrt(basicPricePerCore * this.core + basicPricePerRam * this.ram) * performanceCategory * 100) / 100;
    const vat = Math.round(fee * vatPercentage * 100) / 100;
    const totalFee = fee + vat;

    return {
        fee,
        vat,
        totalFee
    };
}

const VS = mongoose.model('VS', vsSchema);
module.exports = VS;