const db = require("../models");
const SpecialService = db.specialService;


exports.create = (req, res) => {
    const start = new Date(req.body.start);
    const utcStart = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds()));
    const end = new Date(req.body.end);
    const utcEnd = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), end.getHours(), end.getMinutes(), end.getSeconds()));
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