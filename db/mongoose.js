const mongoose = require('mongoose');
const { to, te } = require('../utilities');

(async function () {
    [error] = await to(
        mongoose.connect(
            process.env.MONGODB_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true
            }
        )
    );

    if (error) te('Couldn\'t connect to MongoDB');
})();
