const jwt = require('jsonwebtoken');
const Employee = require('../../db/models/employeeModel');

const authorizeAndPass = (shouldPass) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const employee = await Employee.findOne({ _id: decoded._id, 'tokens.token': token });

            if (!employee) throw new Error('Please, authenticate');

            if (shouldPass) {
                req.app.locals.employee = employee;
                req.app.locals.token = token;
            }

            next();
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
};

module.exports = authorizeAndPass;