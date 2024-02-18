const db = require("../models");
// const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
        User.findOne({
            email: req.body.email
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (user) {
                res.status(400).send({ message: "Utilisateur existe déja !" });
                return;
            }

            next();
        });
};


const verifySignUp = {
    checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
