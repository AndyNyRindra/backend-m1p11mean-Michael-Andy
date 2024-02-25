const db= require ('../models');

const EmployeeRating = db.employeeRating;
const Employee = db.employee;
const User = db.user;



// get list of employee rating by user id, get all employee, and rating if there is, if not then 0
exports.getEmployeeRatings = async (userId) => {
    if (userId === 'undefined') {
        const employees = await Employee.find({});
        return employees.map(employee => ({ ...employee._doc, rating: 0 }));
    } else {
        const employees = await Employee.find({});
        const ratings = await EmployeeRating.find({ user: userId });
        const ratingsMap = new Map();
        ratings.forEach(rating => {
            ratingsMap.set(rating.employee.toString(), rating.rating);
        });
        return employees.map(employee => {
            const employeeId = employee._id.toString();
            const rating = ratingsMap.get(employeeId) || 0;
            return { ...employee._doc, rating };
        });
    }
};

exports.getRatingByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const employeesWithRatings = await this.getEmployeeRatings(userId);
        return res.status(200).send(employeesWithRatings);
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

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
