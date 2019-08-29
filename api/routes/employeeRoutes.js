const express = require('express');
const Employee = require('../../db/models/employeeModel');
const router = new express.Router();
const ObjectId = require('mongoose').Types.ObjectId;

const authorizeAndPass = require('../middleware/authorization');
const roles = require('../middleware/roles');

router.get('/:id',
    async (req, res) => {
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
    });

router.post('/create',
    authorizeAndPass(false),
    roles(['superAdmin']),
    async (req, res) => {
        const employee = new Employee(req.body);

        try {
            await employee.save();
            res.status(200).send({ employee });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

router.post('/login',
    async (req, res) => {
        try {
            const employee = await Employee.findByCredentials(req.body.email, req.body.password);
            const token = await employee.generateAuthToken();
            res.status(200).send({ employee, token });
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

router.post('/logout',
    authorizeAndPass(true),
    async (req, res) => {
        try {
            req.app.locals.employee.tokens = req.app.locals.employee.tokens.filter(t => t.token !== req.app.locals.token);
            await req.app.locals.employee.save();

            res.status(200).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

router.post('/logoutAll',
    authorizeAndPass(true),
    async (req, res) => {
        try {
            req.app.locals.employee.tokens = [];
            await req.app.locals.employee.save();

            res.status(200).send();
        } catch (error) {
            res.status(500).send(error.message);
        }
    });

module.exports = router;