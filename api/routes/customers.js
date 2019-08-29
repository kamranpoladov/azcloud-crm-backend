const express = require('express');
const Customer = require('../../db/models/customer');
const router = new express.Router();

const role = require('../middleware/role');

router.post('/customers/create', role(['superAdmin', 'salesTeam']), async (req, res) => {
    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(200).send({ customer });
    } catch (err) {
        res.status(500).send(err.message);
    }
})

module.exports = router;