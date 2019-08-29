const mongoose = require('mongoose');

(async () => {
    try {
        await mongoose.connect(
            process.env.MONGODB_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
                useCreateIndex: true
            }
        );
    } catch (err) {
        throw new Error(err.message);
    }
})();
