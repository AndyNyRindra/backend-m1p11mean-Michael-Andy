const db = require("../models");
const {findLoggedEmployee} = require("./employee.controller");
const SpecialService = db.specialService;
const Task = db.task;


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
