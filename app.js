var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ここから書き始める
var methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}));


let todos = []; // 最初は何も入れないため空白

// 一覧表示
app.get('/', (req, res) => {
  let notDoneTodos = todos.filter(todo => !todo.done);
  let doneTodos = todos.filter(todo => todo.done);
  res.render('index.ejs', { notDoneTodos: notDoneTodos, doneTodos: doneTodos } );
});

// 新規作成
app.post('/create', (req, res) => {
  let newTodo = {
    id: todos.length + 1,
    content: req.body.todoContent
  };
  todos.push(newTodo);
  res.redirect('/');
});

// 編集
app.get('/edit/:id', (req, res) => {
  for (let i in todos) {
    if (todos[i].id == req.params.id) {
      res.render('edit.ejs', { todo: todos[i] } );
    }
  }
});

// 更新
app.put('/update/:id', (req, res) => {
  for (let i in todos) {
    if (todos[i].id == req.params.id) {
      todos[i].content = req.body.todoContent;
    }
  }
  res.redirect('/');
});

// 完了
app.put('/complete/:id', (req, res) => {
  for (let i in todos) {
    if (todos[i].id == req.params.id) {
      todos[i].done = true;
    }
  }
  res.redirect('/');
});

// 削除
app.delete('/delete/:id', (req, res) => {
  for (let i in todos) {
    if (todos[i].id == req.params.id) {
      delete todos[i];
    }
  }
  res.redirect('/');
});


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
