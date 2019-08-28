const mongoose = require('mongoose');
const { to, te } = require('../utilities');

(async function () {
    [error] = await to(
        mongoose.connect(
            process.env.MONGO_CONNECTION_STRING,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true
            }
        )
    );

    if (error) te('Couldn\'t connect to MongoDB');
})();
