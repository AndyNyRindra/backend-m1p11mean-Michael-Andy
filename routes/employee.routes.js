const controller = require("../controllers/employee.controller");
const {employeeAuthJwt} = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/employees",
        employeeAuthJwt.isAdmin,
        controller.create
    );

    app.get(
        "/api/employees/:id",
        controller.findById
    );

    app.get(
        "/api/employees",
        controller.findAll
    );

    app.put(
        "/api/employees/updatePassword",
        controller.updatePassword
    );

    app.put(
        "/api/employees/:id",
        employeeAuthJwt.isAdmin,
        controller.update
    );

    app.delete(
        "/api/employees/:id",
        employeeAuthJwt.isAdmin,
        controller.delete
    );

    app.get(
        "/api/employees/connected",
        controller.findLoggedEmployee
    )
};
