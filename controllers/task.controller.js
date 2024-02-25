const db = require("../models");
const Employee = db.employee;
const SpecialService = db.specialService;
const Service = db.service;
const Task = db.task;
const TaskPayment = db.taskPayment;
const dateUtils = require('../utils/date.utils');

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Le contenu ne peut pas être vide!" });
        return;
    }
    const employee = req.employee;
    const start = new Date(req.body.start);
    const utcStart = dateUtils.toLocale(start);

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
            user: req.headers['userid'] ? req.headers['userid'] : req.body.user ? req.body.user : null,
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


exports.makeAppointment = async (req, res) => {
    const employee = req.body.employee;
    const start = new Date(req.body.start);
    const end = new Date(req.body.end);
    const utcStart = dateUtils.toLocale(start);
    const utcEnd = dateUtils.toLocale(end);
    const services = req.body.services;
    let duration = 0;
    try {
        await Promise.all(services.map(async (service) => {
            const serviceData = await Service.findById(service).select('-photos');
            duration += serviceData.duration;
        }));
    } catch (err) {
        res.status(500).send({ message: err });
        return;
    }
    let availableSlots = [];
    let currentTime = new Date(utcStart.getTime());

    const getAvailableSlots = async (employee) => {
        // Find all tasks for the given employee between the start and end dates
        const tasks = await Task.find({
            employee: employee,
            date: {
                $gte: utcStart,
                $lt: utcEnd
            }
        }).sort({ date: 1 }); // sort by date in ascending order

        while (currentTime.getTime() + duration * 60000 <= utcEnd.getTime()) {
            // Check if the current time is within working hours and not on a weekend
            if (currentTime.getUTCHours() >= 8 && currentTime.getUTCHours() < 17 && currentTime.getDay() !== 0 && currentTime.getDay() !== 6) {
                let isAvailable = true;

                for (let i = 0; i < tasks.length; i++) {
                    const taskStart = tasks[i].date;
                    const services = tasks[i].services;
                    let taskDuration = 0;
                    try {
                        await Promise.all(services.map(async (service) => {
                            const serviceData = await Service.findById(service.service).select('-photos');
                            taskDuration += serviceData.duration;
                        }));
                    } catch (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    const taskEnd = new Date(taskStart.getTime() + taskDuration * 60000); // Convert duration from minutes to milliseconds

                    if ((currentTime.getTime() >= taskStart.getTime() && currentTime.getTime() < taskEnd.getTime()) ||
                        (currentTime.getTime() + duration * 60000 > taskStart.getTime() && currentTime.getTime() + duration * 60000 <= taskEnd.getTime())) {
                        isAvailable = false;
                        currentTime = new Date(taskEnd.getTime());
                        break;
                    }
                }

                if (isAvailable) {
                    const emp = await Employee.findById(employee).select('-photo -password');
                    availableSlots.push(
                        {
                            employee : emp,
                            date: new Date(currentTime.getTime())
                        }
                    );
                    currentTime.setMinutes(currentTime.getMinutes() + duration);
                } else {
                    currentTime.setMinutes(currentTime.getMinutes() + 1);
                }
            } else {
                // If the current time is outside of working hours or on a weekend, move to the next available slot
                if (currentTime.getUTCHours() >= 17 || currentTime.getDay() === 6) {
                    // If it's after 5pm or it's Saturday, move to 8am the next day
                    currentTime.setUTCHours(24 + 8);
                    currentTime.setMinutes(0);
                } else if (currentTime.getDay() === 0) {
                    // If it's Sunday, move to 8am the next day
                    currentTime.setUTCHours(24 + 8);
                    currentTime.setMinutes(0);
                } else {
                    // Otherwise, it's before 8am, so move to 8am
                    currentTime.setUTCHours(8);
                    currentTime.setMinutes(0);
                }
            }
        }
    }

    await getAvailableSlots(employee);

    res.send(availableSlots);
}

