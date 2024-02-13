const db = require("../models");
const SpecialService = db.specialService;


exports.create = (req, res) => {
    const specialService = new SpecialService({
        services: req.body.services,
        promotion: req.body.promotion,
        start: req.body.start,
        end: req.body.end
    });

    specialService.save(specialService).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de l'offre spéciale"
        });
    });
};