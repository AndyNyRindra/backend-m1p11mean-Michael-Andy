const Employee = require("../models/employee");
var bcrypt = require("bcryptjs");


exports.create = (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        photo: req.body.photo,
        phone: req.body.phone
    });

    employee.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        user.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "L'employé a été crée!" });
        });
    });
};