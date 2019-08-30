const express = require('express');
const router = new express.Router();
const Cluster = require('../../../db/models/warehouse/clusterModel');
const VS = require('../../../db/models/warehouse/virtualServerModel');

router.post('/create', async (req, res) => {
    const vs = new VS(req.body);

    vs
        .save()
        .then(result => {
            return Cluster
                .findByIdAndUpdate(vs.parent, {
                    $push: {
                        children: vs._id
                    }
                })
                .exec();
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
    res.status(200).send(vs);
})

router.get('/', async (request, response, next) => {
    const clusters = await Cluster
        .find({})
        .populate('children');

    const result = await Promise.all(clusters.map(async cluster => {
        const totalProcessingPower = cluster.totalProcessingPower();
        let totalUsedProcessingPower = 0;

        await Promise.all(cluster.children.map(async vs => {
            const vsClockSpeed = await vs.getClockSpeedAndStorage();
            totalUsedProcessingPower += (vs.cores * vsClockSpeed.clockSpeed);
        }))

        return {
            ...cluster._doc,
            totalProcessingPower,
            totalUsedProcessingPower
        };
    }));

    response.status(200).send(result);
});

module.exports = router;