const controller = require("../controllers/employeCheckIn.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/employeeCheckIn/:id",
        controller.checkIn
    );

    app.put(
        "/api/employeeCheckOut/:id",
        controller.checkOut
    );

    app.get(
        "/api/employeeCheckIn/:id",
        controller.getCheckInByEmployeeIdBetweenTwoDates
    );
}
