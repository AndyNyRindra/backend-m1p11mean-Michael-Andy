const db = require("../models");
const TypeDepensePayment = db.typeDepensePayment;

exports.findall = (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const monthFilter = req.query.month;
    const yearFilter = req.query.year;
    console.log(req.query);

    let query = TypeDepensePayment.find();

    // Apply filters
    if (monthFilter) {
        query = query.where('month', monthFilter);
    }
    if (yearFilter) {
        query = query.where('year', yearFilter);
    }

    const countQuery = TypeDepensePayment.find(); // Create a separate count query

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
                .populate('typeDepense')
                .exec((err, typeDepensesPayment) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({ message: err });
                        return;
                    }
                    res.send({ count: count, data: typeDepensesPayment, totalPages: totalPages }); // Return count and paginated results
                });
        } else {
            // If page and size are not provided, return all results
            query.populate('typeDepense').exec((err, typeDepensesPayment) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ count: count, data: typeDepensesPayment, totalPages: totalPages }); // Return count and all results
            });
        }
    });
};

exports.findone = (req, res) =>{
    TypeDepensePayment.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Paiement du type de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la récupération du paiement du type de dépense avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }

    const typeDepensePayment = new TypeDepensePayment({
        month: req.body.month,
        year: req.body.year,
        typeDepense: req.body.typeDepense,
        value: req.body.value
    });

    TypeDepensePayment.create(typeDepensePayment, (err, data) => {
        if (err) {
            console.log(err);
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

    TypeDepensePayment.update({_id: req.params.id}, req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Paiement Type de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la mise à jour du paiement type de dépense avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.delete = (req, res) => {
    TypeDepensePayment.deleteOne({_id: req.params.id}, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Paiement Type de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la suppression du paiement type de dépense avec l'id " + req.params.id });
            }
        } else res.send({ message: `Paiement Type de dépense supprimé avec succès!` });
    });
}
