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

exports.findById = (req, res) => {
    Employee.findById(req.params.id, (err, employee) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send(employee);
    });
};


exports.findAll = (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    if (page && size) {
        // Avec pagination
        Employee.find()
            .skip((page - 1) * size)
            .limit(size)
            .exec((err, employees) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.send(employees);
            });
    } else {
        // Sans pagination
        Employee.find({}, (err, employees) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send(employees);
        });
    }
};

exports.update = (req, res) => {
    Employee.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
            phone: req.body.phone
        },
        { new: true },
        (err, employee) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "L'employé a été mis à jour!" });
        }
    );
};

exports.delete = (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, employee) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        res.send({ message: "L'employé a été supprimé!" });
    });
};