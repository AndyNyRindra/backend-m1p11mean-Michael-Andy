const db = require("../models");
const {findLoggedEmployee} = require("./employee.controller");
const Task = db.task;


exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }
    const employee = req.employee;
    console.log(employee);
    const start = new Date(req.body.start);
    const utcStart = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds()));
    const task = new Task({
        services: req.body.services,
        user: req.body.user,
        date: utcStart,
        employee: employee
    });

    task.save(task).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de la tâche"
        });
    });
};


exports.findTaskPerEmployee = (req, res) => {
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const employee = req.employee;

    Task.find().countDocuments((err, count) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        const totalPages = Math.ceil(count / size);
        const query = Task.find({employee: employee}).populate('services').populate('user').sort({date: 'desc'}).skip(size * (page - 1)).limit(size);
        if (page && size) {
            query.exec((err, tasks) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ count: count, data: tasks, totalPages: totalPages }); // Return count and paginated results
            });
        } else {
            // If page and size are not provided, return all results
            query.exec((err, tasks) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                res.send({ count: count, data: tasks, totalPages: totalPages }); // Return count and all results
            });
        }
    });
}
