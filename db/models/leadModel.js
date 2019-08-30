const mongoose = require('mongoose');
const Customer = require('./customerModel');

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VS',
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
        enum: ['0%', '10%', '20%', '30%', '40%', '60%', '80%', '100%', 'rejection'],
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }
});

leadSchema.methods.actions = function (employeeRole) {
    const leadStatus = this.status;

    return require('../../api/permissions.js')[employeeRole][leadStatus];
};

leadSchema.methods.getCompanyName = async function() {
    const customer = await Customer.findById(this.customer);
    if (customer == null)
        console.log(this.customer);
    return customer.companyName;
}

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;