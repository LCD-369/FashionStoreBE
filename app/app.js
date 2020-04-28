var createError = require('http-errors');
var bodyParser = require('body-parser');
// var cors = require('cors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

// routers
var productRouter = require('./routes/product-route');
var authRouter = require('./routes/auth-route');
var paymentRouter = require('./routes/payment-route');
var couponRouter = require('./routes/coupon-route');
var orderRouter = require('./routes/order-route');

var app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(logger('dev'));
// app.use(express.static(path.join(__dirname, 'public')));

app.use(productRouter);
app.use(orderRouter);
app.use(paymentRouter);
app.use(authRouter);
app.use(couponRouter);

// app.use(cors());

//CORS
// app.use(function (req, res) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader('Access-Control-Allow-Headers', '*');
//   next();
// });


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
