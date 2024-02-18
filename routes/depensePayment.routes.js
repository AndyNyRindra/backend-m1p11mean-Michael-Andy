const controller = require("../controllers/depensePayment.controller");
const { employeeAuthJwt } = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/depensePayments",
        employeeAuthJwt.isAdmin,
        controller.create
    );

    app.get("/api/depensePayments",
        employeeAuthJwt.isAdmin,
        controller.findall
    );

    app.get("/api/depensePayments/:id",
        employeeAuthJwt.isAdmin,
        controller.findone
    );

    app.put("/api/depensePayments/:id",
        employeeAuthJwt.isAdmin,
        controller.update
    );

    app.delete("/api/depensePayments/:id",
        employeeAuthJwt.isAdmin,
        controller.delete
    );
}
