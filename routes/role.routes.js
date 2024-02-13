const controller = require("../controllers/role.controller");
const { employeeAuthJwt } = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get(
        "/api/roles",
        employeeAuthJwt.isAdmin,
        controller.findall
    );
}
