const controller = require("../controllers/employee.controller");
const {authJwt} = require("../middlewares");

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
        [authJwt.verifyToken],
        controller.create
    );

    app.get(
        "/api/employees/:id",
        // [authJwt.verifyToken],
        controller.findById
    );

    app.get(
        "/api/employees",
        // [authJwt.verifyToken],
        controller.findAll
    );

    app.put(
        "/api/employees/:id",
        [authJwt.verifyToken],
        controller.update
    );

    app.delete(
        "/api/employees/:id",
        [authJwt.verifyToken],
        controller.delete
    );
};
