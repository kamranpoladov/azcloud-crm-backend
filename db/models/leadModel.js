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

const Lead = mongoose.model('Lead', leadSchema);
module.exports = Lead;