const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user");
db.service = require("./service");
db.employee = require("./employee");
db.typeDepense = require("./typeDepense");
db.role = require("./role");
db.employeeRating = require("./employeeRating");
db.serviceRating = require("./serviceRating");
db.specialService = require("./specialService");
db.typeDepensePayment = require("./typeDepensePayment");
db.depensePayment = require("./depensePayment");
db.employeeCheckIn = require("./employeeCheckIn");

// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
