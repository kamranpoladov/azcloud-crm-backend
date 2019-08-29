const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        minlength: 6,
        trim: true
    },
    roles: [{
        role: {
            type: String
        }
    }],
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
});

employeeSchema.methods.toJSON = function() {
    let employee = this.toObject();

    delete employee.password;
    delete employee.tokens;

    return employee;
}

employeeSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: "30d"});

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
}

employeeSchema.statics.findByCredentials = async (email, password) => {
    const employee = await Employee.findOne({ email });

    if (!employee) throw new Error("Unable to sign in");

    const isMatch = employee.password == password;

    if (!isMatch) throw new Error("Unable to sign in");

    return employee;
}

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;