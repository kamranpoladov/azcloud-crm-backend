const express = require('express');
const router = new express.Router();
const fs = require('fs');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const Lead = require('../../../db/models/leadModel');
const Customer = require('../../../db/models/customerModel');
const VS = require('../../../db/models/warehouse/virtualServerModel');
const authorizeAndPass = require('../../middleware/authorization');
//const password = require('../../../config.json').password;
const roles = require('../../middleware/roles');

router.get('/',
    authorizeAndPass(true),
    async (req, res) => {
        try {
            const employeeRole = req.app.locals.employee.role;

            const leads = await Lead.find({});
            let vs, fee;

            const response = await Promise.all(leads.map(async (lead) => {
                const _actions = lead.actions(employeeRole);
                if (_actions.includes('fee')) {
                    vs = await VS.findById(lead.service);
                    fee = await vs.feeAndVat();
                }
				return {
					...lead._doc,
					actions: lead.actions(employeeRole),
                    companyName: await lead.getCompanyName(),
                    fee
				};
        }));

            res.status(200).send(response);
        } catch (error) {
            console.log(error)
            res.status(500).send(error.message);
        }
    });

router.post('/create', roles(['superuser', 'sales']), async (req, res) => {
    req.body.status = '10%';
    const lead = new Lead(req.body);

    try {
        await lead.save();
        res.status(200).send(lead);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/:id/edit', async (req, res) => {
    let updates = Object.keys(req.body);

    try {
        let lead = await Lead.findById(req.params.id);
        updates.forEach(update => lead[update] = req.body[update]);
        await lead.save();
        res.status(200).send(lead);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.get('/:id/proposal', async (req, res) => {
    try {
        let lead = await Lead.findById(req.params.id);
        let customer = await Customer.findById(lead.customer);
        let service = await VS.findById(lead.service);

        let _total  = await service.feeAndVat();
        let total = _total.totalFee;

        const html = `
            <h1>Hi, ${customer.companyLegalName}</h1>
            <h4>You can purchase <i>${service.cores} cores and ${service.ram} GB of RAM</i> only for ${total}</h4>
        `
        pdf.create(html, { format: 'Letter' }).toFile('./proposals/proposal.pdf', (err, result) => {
            if (err) res.status(500).send();
        });

        res.download('./proposals/proposal.pdf');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;