const controller = require("../controllers/serviceRating.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/api/serviceRatings",
        // [authJwt.verifyToken],
        controller.insertOrUpdateRating
    );

    app.get(
        "/api/serviceRatings/:id",
        // [authJwt.verifyToken],
        controller.getRatingByUserId
    );


}
