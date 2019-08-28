const to = function (promise) {
    return promise
        .then(data => {
            return [null, data];
        }).catch(err =>
            [pe(err)]
        );
};

const te = function (errorMessage, log) {
    if (log === true) {
        console.error(errorMessage);
    }
    throw new Error(errorMessage);
};

module.exports = { to, te };