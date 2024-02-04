const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const clientRouter = require('./routes/clientRoute')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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

  app.use('/', indexRouter);
  app.use('/clients', clientRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
