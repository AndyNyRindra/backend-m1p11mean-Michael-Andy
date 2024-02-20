const db = require("../models");
const SpecialService = db.specialService;
const dateUtils = require('../utils/date.utils');

exports.create = (req, res) => {
    const start = new Date(req.body.start);
    const utcStart = dateUtils.toLocale(start);
    const end = new Date(req.body.end);
    const utcEnd = dateUtils.toLocale(end);
    const specialService = new SpecialService({
        services: req.body.services,
        promotion: req.body.promotion,
        start: utcStart,
        end: utcEnd
    });

    specialService.save(specialService).then(data => {
        console.log(specialService);
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de l'offre spéciale"
        });
    });
};


exports.findCurrents = (req, res) => {
    const currentDate = new Date();
        SpecialService.find({
            start: { $lte: currentDate },
            end: { $gte: currentDate }
        }).populate('services').exec((err, specialServices) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.send(specialServices);
        });

};