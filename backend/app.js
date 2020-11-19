var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var config=require('./config');
var logger = require('morgan');
var cors=require('cors');
const mongoose=require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var interviewsRouter = require('./routes/interviews');

var app = express();
var smtp=require('./smtp');

let mailOptions = {
  from: mailerConfig.auth.user,
  to: 'swapnilkusumwal@gmail.com',
  subject: 'Some Subject',
  html: `<body>` +
      `<p>Your interview has been scheduled</p>`
      
};
smtp.temp(mailOptions);
const url=config.mongoUrl;
const connect = mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false});

connect.then((db)=>{
  console.log("connected to server");
},(err)=>{console.log(err);})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());

app.use('/users', usersRouter);
app.use('/interviews', interviewsRouter);
app.use('/', indexRouter);

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
