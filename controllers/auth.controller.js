const config = require("../config/auth.config");
const db = require("../models");
// const User = db.user;
const User = require("../models/user");
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
            user.save((err) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.send({ message: "L'utilisateur a été crée!" });
            });
        });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email,
    })
        // .populate("roles", "-__v")
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (!user) {
                return res.status(404).send({ message: "Utilisateur non trouvée." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user?.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({ message: "Mot de passe invalide!" });
            }

            const token = jwt.sign({ id: user?.id },
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400, // 24 hours
                });


            req.session.token = token;

            res.status(200).send({
                id: user?._id,
                name: user?.name,
                email: user?.email,
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
