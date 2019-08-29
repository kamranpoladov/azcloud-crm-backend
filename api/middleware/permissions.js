const Employee = require('../../db/models/employeeModel');
const Lead = require('../../db/models/leadModel');

        'rejection': ['edit'],
/*(request, response, next) => {
    try {
        const leadId = request.params.leadId;
        const leadInfo = await Lead
            .findById(leadId)
            .select('status');
        if (!leadInfo) throw new Error('No lead found with given leadId');
        const leadStatus = leadInfo.status;

        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const employeeInfo = await Employee
            .findOne({ _id: decoded._id, 'tokens.token': token })
            .select('roles');
        if (!employeeInfo) throw new Error('Please, authenticate');
        const employeeRole = employeeInfo.role;
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}*/