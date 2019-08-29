const express = require('express');
const router = new express.Router();
const fs = require('fs');
const pdf = require('html-pdf');
const nodemailer = require('nodemailer');
const Lead = require('../../../db/models/leadModel');
const Customer = require('../../../db/models/customerModel');

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

        fs.readFile('../../../proposals/proposal.pdf', async (error, buffer) => {
            let testAccount = await nodemailer.createTestAccount();
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass // generated ethereal password
                }
            });
            console.log(testAccount.user)
            let info = await transporter.sendMail({
                from: testAccount.user, // sender address
                to: '18kamranpoladov03@gmail.com', // list of receivers
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