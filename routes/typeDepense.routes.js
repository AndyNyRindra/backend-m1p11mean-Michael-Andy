const controller = require("../controllers/typeDepense.controller");
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
        "/api/typeDepenses",
        employeeAuthJwt.isAdmin,
        controller.create
    );

    app.get("/api/typeDepenses",
        employeeAuthJwt.isAdmin,
        controller.findall
    );

    app.get("/api/typeDepenses/:id",
        employeeAuthJwt.isAdmin,
        controller.findone
    );

    app.put("/api/typeDepenses/:id",
        employeeAuthJwt.isAdmin,
        controller.update
    );

    app.delete("/api/typeDepenses/:id",
        employeeAuthJwt.isAdmin,
        controller.delete
    );
}
