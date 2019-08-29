const express = require('express');
const router = new express.Router();
const fs = require('fs');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const Lead = require('../../../db/models/leadModel');
const Customer = require('../../../db/models/customerModel');
const authorizeAndPass = require('../../middleware/authorization');
const password = require('../../../config.json').password;

router.get('/',
    authorizeAndPass(true),
    async (req, res) => {
        try {
            const employeeRole = req.app.locals.employee.role;

            let leads = await Lead.find({});
            leads.forEach(lead => {
                lead.actions = lead.actions(employeeRole);
            });

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
        // let service = await Service.findById(lead.service);

        const html = `
            <h1>Hi, ${customer.companyLegalName}</h1>
            <h4>You can purchase <i>service name once warehouse created</i> only for ${lead.calculateTotalAmount()}</h4>
        `
        pdf.create(html, { format: 'Letter' }).toFile('./proposals/proposal.pdf', (err, result) => {
            if (err) res.status(500).send();
        })

        res.download('../../../proposals/proposal.pdf');

        fs.readFile('../../../proposals/proposal.pdf', async (error, buffer) => {
            let transporter = nodemailer.createTransport({
                // host: 'icloud.com',
                // port: 587,
                // secure: false,
                auth: {
                    user: 'kamranpoladov1803@icloud.com',
                    pass: password
                }
            });
            let info = await transporter.sendMail({
                from: 'kamranpoladov1803@icloud.com',
                to: '18kamranpoladov03@gmail.com',
                subject: 'Proposal', // Subject line
                html: '<b>View email attachment</b>', // html body
                attachments: [
                    {
                        filename: 'proposal.pdf',
                        content: buffer.toString('utf8')
                    }
                ]
            });
            res.status(200).send();
        })
    } catch (error) {
        res.status(500).send(err.message);
    }
});

module.exports = router;