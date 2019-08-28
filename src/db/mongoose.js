(async function() {
    const mongoose = require('mongoose');

    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
})()