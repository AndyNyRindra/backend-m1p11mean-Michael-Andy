const controller = require("../controllers/typeDepensePayment.controller");
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
        "/api/typeDepensePayments",
        employeeAuthJwt.isAdmin,
        controller.create
    );

    app.get("/api/typeDepensePayments",
        employeeAuthJwt.isAdmin,
        controller.findall
    );

    app.get("/api/typeDepensePayments/:id",
        employeeAuthJwt.isAdmin,
        controller.findone
    );

    app.put("/api/typeDepensePayments/:id",
        employeeAuthJwt.isAdmin,
        controller.update
    );

    app.delete("/api/typeDepensePayments/:id",
        employeeAuthJwt.isAdmin,
        controller.delete
    );
}
