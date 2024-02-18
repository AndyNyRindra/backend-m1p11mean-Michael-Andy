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
    const ignorePhotos = req.query.ignorePhotos;
    const nameFilter = req.query.name;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const minDuration = req.query.minDuration;
    const maxDuration = req.query.maxDuration;
    const minCommission = req.query.minCommission;
    const maxCommission = req.query.maxCommission;
    let conditions = {};

// Apply filters
    if (nameFilter) {
        conditions.$or = [
            { 'name': { $regex: new RegExp(nameFilter, "i") } }
        ];
    }

    if (minPrice) {
        conditions.price = { $gte: minPrice };
    }

    if (maxPrice) {
        if (conditions.price) {
            conditions.price.$lte = maxPrice;
        } else {
            conditions.price = { $lte: maxPrice };
        }
    }

    if (minDuration) {
        conditions.duration = { $gte: minDuration };
    }

    if (maxDuration) {
        if (conditions.duration) {
            conditions.duration.$lte = maxDuration;
        } else {
            conditions.duration = { $lte: maxDuration };
        }
    }

    if (minCommission) {
        conditions.commission = { $gte: minCommission };
    }

    if (maxCommission) {
        if (conditions.commission) {
            conditions.commission.$lte = maxCommission;
        } else {
            conditions.commission = { $lte: maxCommission };
        }
    }


    let query = Service.find(conditions);
    let countQuery = Service.find(conditions);

    if (ignorePhotos === 'true') {
        query = query.select('-photos');
        countQuery = countQuery.select('-photos');
    }

    countQuery.countDocuments((err, count) => {

            if (err) {
                res.status(500).send({message: err});
                return;
            }

            const totalPages = Math.ceil(count / size);

            if (page) {
                // Avec pagination
                var limit = size ? size : 10;
                query
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .exec((err, services) => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ count: count, data: services, totalPages: totalPages });
                    });
            } else {
                // Sans pagination
                query.exec( (err, services) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ count: count, data: services, totalPages: totalPages });
                });
            }
    }
    );
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