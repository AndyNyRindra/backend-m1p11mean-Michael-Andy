const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.employee.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/employee/signin", controller.signin);

    app.post("/api/auth/employee/signout", controller.signout);
};
