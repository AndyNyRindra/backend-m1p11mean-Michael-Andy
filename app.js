const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(session({
  secret: 'thisismysecretkey', // Replace with a strong and secure secret
  resave: false,
  saveUninitialized: false,
}));

require('./dotenv')
const connectionString = process.env.DB_URL

mongoose.set("strictQuery", false);
mongoose.connect(connectionString, {
  useNewUrlParser: true,
}
).then(() => {
  console.log("mongoDB is connected");
}

)
.catch((err) => console.log(err));
  app.set('view engine', 'ejs');
  app.use('/', indexRouter);

require("./routes/auth.routes")(app);
require("./routes/service.routes")(app);
require("./routes/employee.routes")(app);
require("./routes/typeDepense.routes")(app);
require("./routes/role.routes")(app);
require("./routes/employeeRating.routes")(app);
require("./routes/serviceRating.routes")(app);
require("./routes/authEmployee.routes")(app);
require("./routes/specialService.routes")(app);
require("./routes/typeDepensePayment.routes")(app);
require("./routes/depensePayment.routes")(app);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
