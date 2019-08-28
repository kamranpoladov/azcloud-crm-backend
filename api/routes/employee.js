const express = require('express');
const Employee = require('../../db/models/employee');
const router = new express.Router();

const superAdmin = require('../middleware/roles/superAdmin');

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

module.exports = router;