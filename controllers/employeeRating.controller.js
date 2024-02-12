const db= require ('../models');

const EmployeeRating = db.employeeRating;
const Employee = db.employee;
const User = db.user;

exports.create = (req, res) => {
    const employeeRating = new EmployeeRating({
        employeeId: req.body.employeeId,
        rating: req.body.rating,
        comment: req.body.comment,
        date: req.body.date
    });

    employeeRating.save(employeeRating).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Erreur lors de la création de l'evaluation"
        });
    });
}

exports.findAll = (req, res) => {
    EmployeeRating.find().populate('employeeId').exec((err, data) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        res.send(data);
    });
}

exports.update = (req, res) => {
    const id = req.params.id;

    EmployeeRating.findByIdAndUpdate(id, req.body, { useFindAndModify: false }).then(data => {
        if (!data) {
            res.status(404).send({
                message: `Impossible de mettre à jour l'evaluation avec id=${id}.`
            });
        } else res.send({ message: "L'evaluation a été mise à jour avec succès." });
    }
    ).catch(err => {
        res.status(500).send({
            message: "Erreur lors de la mise à jour de l'evaluation avec id=" + id
        });
    });
}

// get list of employee rating by user id, get all employee, and rating if there is, if not then 0
exports.getRatingByUserId = (req, res) => {
    const userId = req.params.id;
    if (userId==='undefined') {
        Employee.find({}, (err, employees) => {
            if (err) {
                return res.status(500).send({ message: err });
            }
            const employeesWithZeroRating = employees.map(employee => ({ ...employee._doc, rating: 0 }));
            return res.status(200).send(employeesWithZeroRating);
        });
    }else {
        // find all employees
        Employee.find({}, (err, employees) => {
            if (err) {
                res.status(500).send({message: err});
                return;
            }

            // Find ratings for the user
            EmployeeRating.find({user: userId}, (err, ratings) => {
                if (err) {
                    res.status(500).send({message: err});
                    return;
                }

                // Create a map to store ratings by employee ID
                const ratingsMap = new Map();
                ratings.forEach(rating => {
                    ratingsMap.set(rating.employee.toString(), rating.rating);
                });

                // Loop through employees to add ratings (or 0 if not found)
                const employeesWithRatings = employees.map(employee => {
                    const employeeId = employee._id.toString();
                    const rating = ratingsMap.get(employeeId) || 0;
                    return {...employee._doc, rating}; // Add rating to employee document
                });

                // Return employees with ratings
                return res.status(200).send(employeesWithRatings);
            });
        });
    }
}

exports.insertOrUpdateRating = (req, res) => {
    const userId = req.body.userId;
    const employeeId = req.body.employeeId;
    const rating = req.body.rating;

    // Define the filter for finding/updating the rating
    const filter = { user: userId, employee: employeeId };

    // Define the update to be applied
    const update = { rating };

    // Set the `upsert` option to true to insert a new document if no match is found
    const options = { upsert: true, new: true };

    // Find and update (or insert) the rating
    EmployeeRating.findOneAndUpdate(filter, update, options, (err, data) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        // Send the updated/inserted rating as the response
        return res.status(200).send(data);
    });
};
