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
    } catch (error) {
        throw new Error(error.message);
    }
})();
