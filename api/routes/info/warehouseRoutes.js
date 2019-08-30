const express = require('express');
const router = new express.Router();

const Cluster = require('../../../db/models/warehouse/clusterModel');

router.get('/', (request, response, next) => {
    const clusters = await Cluster
        .find({})
        .populate('children');

    const result = clusters.map(cluster => {
        const totalProcessingPower = cluster.totalProcessingPower;
        const totalUsedProcessingPower = cluster.children.reduce((accumulator, vs) => {
            const vsClockSpeed = vs.getClockSpeedAndStorage().clockSpeed;
            accumulator += vsClockSpeed * vs.cores;
        });

        return {
            ...cluster._doc,
            totalProcessingPower,
            totalUsedProcessingPower
        };
    });

    response.status(200).send(result);
});

module.exports = router;