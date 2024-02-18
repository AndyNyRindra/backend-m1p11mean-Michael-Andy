const controller = require("../controllers/employeeRating.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/employeeRatings",
        // [authJwt.verifyToken],
        controller.insertOrUpdateRating
    );

    app.get(
        "/api/employeeRatings/:id",
        // [authJwt.verifyToken],
        controller.getRatingByUserId
    );


}
