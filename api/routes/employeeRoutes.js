const express = require('express');
const Employee = require('../../db/models/employeeModel');
const router = new express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const auth = require('../middleware/authorization');
const role = require('../middleware/role');

router.get('/employees/:id', async (req, res) => {
    const _id = req.params.id;
    if (!ObjectId.isValid(_id)) {
        return res.status(400).send()
    }

    try {
        const employee = await Employee.findById(_id);

        if (!employee) res.status(404).send();

        res.status(200).send(employee);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.post('/employees/create', role(['superAdmin']), async (req, res) => {
    const employee = new Employee(req.body);

    try {
        await employee.save();
        res.status(200).send({ employee });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/employees/login', async (req, res) => {
    try {
        const employee = await Employee.findByCredentials(req.body.email, req.body.password);
        const token = await employee.generateAuthToken();
        res.status(200).send({ employee, token });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/employees/logout', auth, async (req, res) => {
    try {
        req.employee.tokens = req.employee.tokens.filter(t => t.token !== req.token);
        await req.employee.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/employees/logoutAll', auth, async (req, res) => {
    try {
        req.employee.tokens = [];
        await req.employee.save();

        res.status(200).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;