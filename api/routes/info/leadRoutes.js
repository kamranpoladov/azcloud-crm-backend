const express = require('express');
const router = new express.Router();
const Lead = require('../../../db/models/leadModel');

const roles = require('../../middleware/roles');

router.get('/', async (req, res) => {
    try {
        let leads = await Lead.find({});
        res.status(200).send(leads);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/create', async (req, res) => {
    req.body.progress = 10;
    const lead = new Lead(req.body);

    try {
        await lead.save();
        res.status(200).send(lead);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// router.post('/edit', async (req, res) => {

// })

module.exports = router;