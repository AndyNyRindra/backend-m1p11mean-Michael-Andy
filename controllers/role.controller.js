const db = require("../models");
const Role = db.role;

exports.findall = (req, res) =>{
    Role.find((err, data) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(data);
    });
}