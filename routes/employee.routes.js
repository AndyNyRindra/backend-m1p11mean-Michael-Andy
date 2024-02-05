const controller = require("../controllers/employee.controller");
const {authJwt} = require("../middlewares/authJwt");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/employee",
        [authJwt.verifyToken],
        controller.create
    );
};
