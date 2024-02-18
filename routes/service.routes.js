const controller = require("../controllers/service.controller");
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
        "/api/services",
        employeeAuthJwt.isAdmin,
        controller.create
    );

    app.get(
        "/api/services/:id",
        controller.findById
    );

    app.get(
        "/api/services",
        controller.findAll
    );

    app.put(
        "/api/services/:id",
        employeeAuthJwt.isAdmin,
        controller.update
    );

    app.delete(
        "/api/services/:id",
        employeeAuthJwt.isAdmin,
        controller.delete
    );
};
