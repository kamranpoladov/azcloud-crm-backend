const express = require('express');
const Employee = require('../../db/models/employee');
const router = new express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/employees/:id', async (req, res) => {
    const _id = req.params.id;
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).send()
    }

    try {
        const employee = await Employee.findById(_id);

        if (!employee) res.status(404).send();

        res.status(200).send(employee);
    } catch (err) {
        
    }
})

router.post('/employees/create', role(['superAdmin']), async (req, res) => {
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