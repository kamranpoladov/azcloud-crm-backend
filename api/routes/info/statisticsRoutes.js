const express = require('express');
const router = new express.Router();
const Lead = require('../../../db/models/leadModel');

router.get('/customers', async (req, res) => {
    try {
    const customers = await Lead.find({});
    let potential = 0, notPotential = 0;
    customers.forEach(customer => {
        if (customer.status == '100%') notPotential++;

        else potential++;
    });
    res.status(200).send({ potential, notPotential });
    } catch(error) {
        res.status(500).send(error.message);
    }
})



module.exports = router;