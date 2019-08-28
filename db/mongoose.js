const mongoose = require('mongoose');
const to = require('../utilities');

(async () => {
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

    if (error) throw new Error('Couldn\'t connect to MongoDB');
})();
