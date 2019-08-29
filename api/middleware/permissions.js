const Employee = require('../../db/models/employeeModel');
const Lead = require('../../db/models/leadModel');

const permissions = {
    'superuser': {
        'customerRegistration': 'w',
        '0%': ['edit'],
        '10%': ['edit', 'fee'],
        '20%': ['edit', 'fee'],
        '30%': ['edit', 'fee'],
        '40%': ['edit', 'fee', 'pdf'],
        '60%': ['edit'],
        '80%': ['edit'],
        '100%': ['edit'],
        'rejection': ['edit'],
        'warehouse': 'w'
    },
    'technical': {
        '0%': [],
        '10%': [],
        '20%': [],
        '30%': [],
        '40%': [],
        '60%': [],
        '80%': [],
        '100%': [],
        'rejection': [],
        'warehouse': 'r'
    },
    'sales': {
        'customerRegistration': 'w',
        '0%': ['edit'],
        '10%': ['edit', 'fee'],
        '20%': ['edit', 'fee'],
        '30%': ['edit', 'fee'],
        '40%': ['edit', 'fee', 'pdf'],
        '60%': ['edit'],
        '80%': ['edit'],
        '100%': ['edit'],
        'rejection': ['edit'],
        'warehouse': 'w'
    }
}

const permits = () => {
    return permissions[employeeRole][leadStatus];
};

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