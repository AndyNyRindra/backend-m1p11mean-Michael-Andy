const config = require("../config/auth.config");
const db = require("../models");
// const User = db.user;
const Employee = require("../models/employee");
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");



exports.signin = (req, res) => {
    Employee.findOne({
        email: req.body.email,
    })
        // .populate("roles", "-__v")
        .exec((err, employee) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!employee) {
                return res.status(404).send({ message: "Utilisateur non trouvée." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                employee?.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({ message: "Mot de passe invalide!" });
            }

            const token = jwt.sign({ id: employee?.id },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400, // 24 hours
                });


            req.session.token = token;

            res.status(200).send({
                id: employee?._id,
                name: employee?.name,
                email: employee?.email,
                role: employee?.role,
            });
        });
};

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).send({ message: "Vous êtes deconnecté!" });
    } catch (err) {
        this.next(err);
    }
};
