const mongoose = require('mongoose');

const clusterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    clockSpeed: {
        type: Number,
        required: true
    },
    cores: {
        type: Number,
        required: true
    },
    ram: {
        type: Number,
        required: true
    },
    storage: {
        type: String,
        enum: ['ssd', '10k', '7.2k'],
        required: true
    },
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VS'
    }]
});

clusterSchema.methods.totalProcessingPower = function () {
    return this.cores * this.clockSpeed;
};

clusterSchema.methods.getRemaining = function () {
    Array.prototype.sum = function (prop) {
        var total = 0
        for (var i = 0, _len = this.length; i < _len; i++) {
            total += this[i][prop]
        }
        return total
    }
    const childrenRam = this.children.sum('ram');
    const childrenCores = this.children.sum('cores');

    return {
        remainingRam: this.ram - childrenRam,
        remainingCores: this.cores - childrenCores
    }
}

module.exports = mongoose.model('Cluster', clusterSchema);
