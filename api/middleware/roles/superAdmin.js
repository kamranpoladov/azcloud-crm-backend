const jwt = require('jsonwebtoken');
const Employee = require('../../../db/models/employee');

const superAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employee = await Employee.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!employee || !employee.roles.includes('superAdmin')) throw new Error("No valid permission");

        next();
    } catch (err) {
        res.status(400).send({ err: err.message });
    }
}

module.exports = superAdmin;