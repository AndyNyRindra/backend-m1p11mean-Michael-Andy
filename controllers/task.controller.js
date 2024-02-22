const db = require("../models");
const {findLoggedEmployee} = require("./employee.controller");
const SpecialService = db.specialService;
const Task = db.task;
const TaskPayment = db.taskPayment;


exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }
    const employee = req.employee;
    const start = new Date(req.body.start);
    const utcStart = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes(), start.getSeconds()));

    // Trouver les promotions actuelles pour les services
    const servicesPromotions = [];
    const currentDate = new Date();
    req.body.services.forEach(service => {
        console.log("Service:"+service);
        SpecialService.find({
            services: service,
            start: { $lte: start },
            end: { $gte: start }
        }).exec((err, specialServices) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err });
                return;
            }
            const promotion = specialServices.length > 0 ? specialServices[0].promotion : 0; // Si une promotion est trouvée, utilisez-la, sinon 0
            servicesPromotions.push({
                service: service,
                promotion: promotion
            });
            // Une fois que toutes les promotions ont été trouvées, créez la tâche
            if (servicesPromotions.length === req.body.services.length) {
                createTask();
            }
        });
    });

    const createTask = () => {
        console.log(servicesPromotions);
        const task = new Task({
            services: servicesPromotions,
            user: req.body.user,
            date: utcStart,
            employee: employee
        });

        task.save(task).then(data => {
            res.send(data);
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                message: err.message || "Erreur lors de la création de la tâche"
            });
        });
    };
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
        const query = Task.find({employee: employee}).populate('user').sort({date: 'desc'}).skip(size * (page - 1)).limit(size);
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

exports.findByID = (req, res) => {
    const id = req.params.id;
    Task.findById(id).populate('services.service').populate('user').exec((err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(task);
    });
}

exports.updateStatus = (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.status;

    // Récupérer la tâche à mettre à jour
    Task.findById(id, (err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!task) {
            res.status(404).send({ message: "Tâche non trouvée." });
            return;
        }

        // Vérifier si la tâche est annulée et si le nouveau statut est différent de -1 (annulé)
        if (task.status === -1 && newStatus !== -1) {
            res.status(400).send({ message: "La tâche annulée ne peut pas être modifiée." });
            return;
        }

        // Vérifier si le nouveau statut est inférieur à l'ancien statut
        if (newStatus < task.status) {
            res.status(400).send({ message: "Le statut ne peut pas être abaissé." });
            return;
        }

        // Mettre à jour le statut de la tâche
        task.status = newStatus;
        task.save((err, updatedTask) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            res.send(updatedTask);
        });
    });
};

exports.pay = (req, res) => {
    const id  = req.params.id;
    const totalPrice = req.body.totalPrice;

    // Find the task by ID
    Task.findById(id, (err, task) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!task) {
            res.status(404).send({ message: "Tâche non trouvée." });
            return;
        }

        task.paid = true;

        task.save((err, updatedTask) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            const payment = new TaskPayment({
                user: task.user,
                task: updatedTask._id,
                date: new Date(),
                amount: totalPrice
            });

            payment.save((err, payment) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.send({
                    task: updatedTask,
                    payment: payment
                });
            });
        });
    });
};
