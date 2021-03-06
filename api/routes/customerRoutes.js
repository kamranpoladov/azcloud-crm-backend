const express = require('express');
const Customer = require('../../db/models/customerModel');
const router = new express.Router();

const roles = require('../middleware/roles');

router.post('/create', roles(['superAdmin', 'salesTeam']), async (req, res) => {
    const customer = new Customer(req.body);
    try {
        await customer.save();
        res.status(200).send({ customer });
    } catch (error) {
        res.status(500).send(error.message);
    }
})

module.exports = router;