const express = require('express');
const Employee = require('../../db/models/employee');
const router = new express.Router();

const superAdmin = require('../middleware/roles/superAdmin');
const auth = require('../middleware/auth');

router.post('/employees/create', superAdmin, async (req, res) => {
    const employee = new Employee(req.body);

    try {
        await employee.save();
        res.status(200).send({ employee });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/employees/login', async (req, res) => {
    try {
        const employee = await Employee.findByCredentials(req.body.email, req.body.password);
        const token = await employee.generateAuthToken();
        res.status(200).send({ employee, token });
    } catch (err) {
        console.log(err.message)
        res.status(400).send();
    }
});

router.post('/employees/logout', auth, async (req, res) => {
    try {
        req.employee.tokens = req.employee.tokens.filter(t => t.token !== req.token);
        await req.employee.save();

        res.status(200).send();
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/employees/logoutAll', auth, async (req, res) => {
    try {
        req.employee.tokens = [];
        await req.employee.save();

        res.status(200).send();
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;