const db = require("../models");
const TypeDepense = db.typeDepense;

exports.findall = (req, res) =>{
    TypeDepense.find((err, data) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(data);
    });
}

exports.findone = (req, res) =>{
    TypeDepense.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Type de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la récupération du type de dépense avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }

    const typeDepense = new TypeDepense({
        name: req.body.name,
    });

    TypeDepense.create(typeDepense, (err, data) => {
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

    TypeDepense.update({_id: req.params.id}, req.body, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Type de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la mise à jour du type de dépense avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.delete = (req, res) => {
    TypeDepense.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Type de dépense avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la suppression du type de dépense avec l'id " + req.params.id });
            }
        } else res.send({ message: `Type de dépense supprimé avec succès!` });
    });
}
