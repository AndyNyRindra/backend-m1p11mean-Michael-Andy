const db = require("../models");
const Employee = db.employee;
var bcrypt = require("bcryptjs");


exports.create = (req, res) => {
    const employee = new Employee({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        photo: req.body.photo,
        phone: req.body.phone,
        role: req.body.role
    });

    employee.save((err, employee) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        employee.save((err) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "L'employé a été crée!" });
        });
    });
};

exports.findById = (req, res) => {
    Employee.findById(req.params.id).populate('role').exec((err, employee) => {
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
    const keyWordFilter = req.query.keyWord;
    let conditions = {};

// Apply filters
    if (keyWordFilter) {
        conditions = {
            $or: [
                { 'name': { $regex: new RegExp(keyWordFilter, "i") } },
                { 'email': { $regex: new RegExp(keyWordFilter, "i") } },
                { 'phone': { $regex: new RegExp(keyWordFilter, "i") } }
            ]
        };
    }

    let query = Employee.find(conditions);

    Employee.find(conditions).countDocuments((err, count) => {
        if (err) {
            res.status(500).send({message: err});
            return;
        }

        const totalPages = Math.ceil(count / size);

        if (page) {
            // Avec pagination
            const limit = size ? size : 10;
            query
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('role')
                .exec((err, employees) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ count: count, data: employees, totalPages: totalPages });
                });
        } else {
            // Sans pagination
            query.populate('role').exec((err, employees) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.send({ count: count, data: employees, totalPages: totalPages });
            });
        }

    });

};

exports.update = (req, res) => {
    Employee.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
            phone: req.body.phone,
            role: req.body.role
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