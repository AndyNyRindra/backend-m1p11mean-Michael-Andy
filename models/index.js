const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.employee = require("./employee");
db.typeDepense = require("./typeDepense");
// db.role = require("./role.model");

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
