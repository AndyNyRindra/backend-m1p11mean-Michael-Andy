const db = require("../models");
const dateUtils = require("../utils/date.utils");
const TaskPayment = db.taskPayment;

exports.getTurnOverPerDay = (req, res) => {
    const employeeId = req.params.id;
    const start = req.query.start;
    const utcStart = dateUtils.toLocale(new Date(start));
    const utcStartPlusOne = dateUtils.toLocale(new Date(start));
    console.log(start);
    utcStartPlusOne.setDate(utcStartPlusOne.getDate() + 1);
    const date = new Date();

    TaskPayment.find({
        date: {
            $gte: utcStart,
            $lt: utcStartPlusOne
        }
    }).exec((err, payments) => {
        if (err) {
            console.log(err);
            res.status(500).send({ message: err });
            return;
        }
        let turnOver = 0;
        payments.forEach(payment => {
            turnOver += payment.amount;
        });
        res.status(200).send({ data: turnOver });
    });

}
