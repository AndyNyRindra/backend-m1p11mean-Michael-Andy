const db = require("../models");
const User = db.user;

exports.findall = (req, res) =>{
    User.findall((err, data) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(data);
    });
}

exports.findone = (req, res) =>{
    User.findone(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Utilisateur avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la récupération de l'utilisateur avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    User.create(user, (err, data) => {
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

    User.update(req.params.id, new User(req.body), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Utilisateur avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Erreur lors de la mise à jour de l'utilisateur avec l'id " + req.params.id });
            }
        } else res.send(data);
    });
}

exports.delete = (req, res) => {
    User.delete(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ message: `Utilisateur avec l'id ${req.params.id} non trouvé.` });
            } else {
                res.status(500).send({ message: "Impossible de supprimer l'utilisateur avec l'id " + req.params.id });
            }
        } else res.send({ message: `L'utilisateur a été supprimé!` });
    });
}

