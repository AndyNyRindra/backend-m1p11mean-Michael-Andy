const controller = require("../controllers/task.controller");
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
        "/api/tasks",
        employeeAuthJwt.findLoggedEmployee,
        controller.create
    );

    app.get(
        "/api/tasks/employee",
        employeeAuthJwt.findLoggedEmployee,
        controller.findTaskPerEmployee
    );

    app.get(
        "/api/tasks/:id",
        controller.findByID
    );



}
