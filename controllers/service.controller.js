const db = require("../models");
const Service = db.service;


exports.create = (req, res) => {
    const service = new Service({
        name: req.body.name,
        photos: req.body.photos,
        price: req.body.price,
        duration: req.body.duration,
        commission: req.body.commission
    });

    service.save((err, service) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        service.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "Le service a été crée!" });
        });
    });
};

exports.findById = (req, res) => {
    Service.findById(req.params.id, (err, service) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send(service);
    });
};


exports.findAll = (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    if (page) {
        // Avec pagination
        var limit = size ? size : 10;
        Service.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .exec((err, services) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.send(services);
            });
    } else {
        // Sans pagination
        Service.find({}, (err, services) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send(services);
        });
    }
};

exports.update = (req, res) => {
    Service.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            photos: req.body.photos,
            price: req.body.price,
            duration: req.body.duration,
            commission: req.body.commission
        },
        { new: true },
        (err, service) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "Le service a été mis à jour!" });
        }
    );
};

exports.delete = (req, res) => {
    Service.findByIdAndRemove(req.params.id, (err, service) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send({ message: "Le service a été supprimé!" });
    });
};