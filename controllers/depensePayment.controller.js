const db = require("../models");
const DepensePayment = db.depensePayment;

exports.findall = (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const nameFilter = req.query.name;


    let query = DepensePayment.find();

    // Apply filters
    if (nameFilter) {
        query = query.where('name', { $regex: new RegExp(nameFilter, "i") });
    }


    const countQuery = DepensePayment.find(); // Create a separate count query

    // Count the total number of documents
    countQuery.countDocuments((err, count) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err });
            return;
        }

        const totalPages = Math.ceil(count / size);

        // Apply pagination if page and size are provided
        if ((page !== undefined && size !== undefined) && (!isNaN(page) && !isNaN(size))) {
            const limit = size;
            const skip = (page - 1) * limit;

            query.skip(skip)
                .limit(limit)
                .exec((err, depensesPayment) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ count: count, data: depensesPayment, totalPages: totalPages }); // Return count and paginated results
                });
        } else {
            // If page and size are not provided, return all results
            query.exec((err, depensesPayment) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ count: count, data: depensesPayment, totalPages: totalPages }); // Return count and all results
            });
        }
    });
};

exports.findone = (req, res) =>{
    DepensePayment.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Paiement du dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la récupération du paiement de dépense avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }

    const depensePayment = new DepensePayment({
        date: req.body.date,
        name: req.body.name,
        value: req.body.value
    });

    DepensePayment.create(depensePayment, (err, data) => {
        if (err) {
            res.status(500).send({ message: err });
        } else {
            res.send(data);
        }
    });
}

exports.update = (req, res) => {
    if (!req.body) {
            res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
            return;
    }

    DepensePayment.update({_id: req.params.id}, req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Paiement de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la mise à jour du paiement de dépense avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.delete = (req, res) => {
    DepensePayment.deleteOne({_id: req.params.id}, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Paiement dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la suppression du paiement dépense avec l'id " + req.params.id });
            }
        } else res.send({ message: `Paiement dépense supprimé avec succès!` });
    });
}
