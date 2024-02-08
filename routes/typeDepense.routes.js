const controller = require("../controllers/typeDepense.controller");

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
        controller.create
    );

    app.get("/api/typeDepenses", controller.findall);

    app.get("/api/typeDepenses/:id", controller.findone);

    app.put("/api/typeDepenses/:id", controller.update);

    app.delete("/api/typeDepenses/:id", controller.delete);
}
