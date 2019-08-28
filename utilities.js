const to = function (promise) {
    return promise
        .then(data => [null, data])
        .catch(error => [error]);
};

const te = function (errorMessage, log) {
    if (log === true) {
        console.error(errorMessage);
    }
    throw new Error(errorMessage);
};

module.exports = { to, te };