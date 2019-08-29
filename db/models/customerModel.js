const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

const customerSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    companyLegalName: {
        type: String,
        required: true,
        trim: true
    },
    sector: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    billingAddress: {
        type: String,
        required: true,
        trim: true
    },
    legalAddress: {
        type: String,
        required: true,
        trim: true
    },
    acquisitionChannel: {
        type: String,
        required: true
    },
    contactPerson: {
        email: {
            type: String,
            required: true,
            trim: true
        },
        landlineNumber: {
            type: String,
            required: true,
            trim: true
        },
        cellNumber: {
            type: String,
            required: true,
            trim: true
        },
        photo: {
            type: Buffer
        }
    },
    salesOwner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Employee'
    },
    legalOwner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Employee'
    },
    technicalOwner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Employee'
    }
})

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;