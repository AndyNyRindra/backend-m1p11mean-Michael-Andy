const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Employee = db.employee;
const Role = db.role;

verifyEmployeeToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token,
        config.secret,
        (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                });
            }
            req.employeeId = decoded.id;
            next();
        });
};

isAdmin = (req, res, next) => {
    let employeeId = req.headers['employeeid'];
    Employee.findById(employeeId)
        .populate('role')
        .exec((err, employee) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!employee) {
            res.status(404).send({ message: "Employee not found!" });
            return;
        }

        if (employee.role.name === "Manager") {
            next();
            return;
        }

        res.status(403).send({ message: "Require Admin Role!" });
    });
};



const employeeAuthJwt = {
    verifyEmployeeToken,
    isAdmin,
};
module.exports = employeeAuthJwt;
