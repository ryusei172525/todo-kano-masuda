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
//mysql 設定
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'todo'
});




// 一覧表示
app.get('/', (req, res) => {
  connection.query(
    'SELECT * from list',
    (error, results) => {
      console.log(error);
      res.render('index.ejs', { lists: results });
    }
  );
});

// 新規作成
app.post('/create', (req, res) => {
  console.log(req.body.name);
  console.log(req.body.text);
  console.log(req.body.body);
  connection.query(
    'INSERT INTO list (name,text,color) VALUES (?,?,?)',
    [req.body.name, req.body.text, req.body.color],
    (error, results) => {
      console.log(error);
      res.redirect('/');
    }
  );
});

// 編集
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM list WHERE id=?',
    [req.params.id],
    (error, results) => {
      console.log('出力');
      console.log(results[0]);
      res.render('edit.ejs', {list: results[0] });
    }
  )
});

// 更新
app.put('/update/:id', (req, res) => {
  connection.query(
    'UPDATE list SET name=?,text = ? WHERE id= ?',
    [req.body.name, req.body.text,req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
});

// 完了
app.delete('/complete/:id', (req, res) => {
  connection.query(
    'DELETE FROM list WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/');
    }
  );
  
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
