require('dotenv').config();
require('./db/mongoose');

const express = require('express');
const app = express();
const cors = require('cors');

const employeeRouter = require('./api/routes/employeeRoutes');
const customerRouter = require('./api/routes/customerRoutes');
const statisticsRouter = require('./api/routes/info/statisticsRoutes');
const leadRouter = require('./api/routes/info/leadRoutes');
const warehouseRouter = require('./api/routes/info/warehouseRoutes');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        return response
            .status(200)
            .json();
    }

    next();
});

app.use('/employees', employeeRouter);
app.use('/customers', customerRouter);
app.use('/info/statistics', statisticsRouter);
app.use('/info/leads', leadRouter);
app.use('/info/warehouse', warehouseRouter);

app.use((request, response, next) => {
    const error = new Error('Path not found');
    error.status = 404;

    next(error);
});

app.use((error, request, response, next) => {
    response
        .status(error.status || 500)
        .json({
            error: {
                message: error.message
            }
        });
});

app.listen(port, () => {
    console.log(`Da`);
});