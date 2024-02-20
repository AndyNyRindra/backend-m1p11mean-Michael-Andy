const db= require ('../models');
const dateUtils = require('../utils/date.utils');

const EmployeeCheckIn = db.employeeCheckIn;

exports.checkIn = (req, res) => {
    const employeeId = req.params.id;
    const date = new Date();
    const utcDate = dateUtils.toLocale(date);
    const checkIn = new EmployeeCheckIn({
        employee: employeeId,
        in: utcDate
    });

    checkIn.save((err, checkIn) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.status(200).send(checkIn);
    });
}
