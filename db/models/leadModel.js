const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    stopDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }
});

leadSchema.methods.calculateTotalAmount = function () {
    // before warehouse is created
    return 1000;
};

leadSchema.methods.actions = function (employeeRole) {
    const leadStatus = this.status;

    return require('../../permissions.js')[employeeRole][leadStatus];
};

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;