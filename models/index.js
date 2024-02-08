const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.service = require("./service");
db.employee = require("./employee");
db.typeDepense = require("./typeDepense");
db.role = require("./role");

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
