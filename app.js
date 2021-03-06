var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // session 配置

const userRouter = require('./routes/user'); // 用户 router
const carRouter = require('./routes/car'); // 汽车 router
const postRouter = require('./routes/post'); // 帖子 router
const commentRouter = require('./routes/comment'); // 帖子 router

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
// session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'cars_back',
  name: 'sessionId'
}))
// --------
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const baseUrl = '/api';
app.use(baseUrl + '/user', userRouter);
app.use(baseUrl + '/car', carRouter);
app.use(baseUrl + '/post', postRouter);
app.use(baseUrl + '/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;