var express = require('express');
var logger = require('morgan');
var cors = require('cors');

/*importamos archivos de rutas */
var indexRouter = require('./routes/index');
var authRouter = require('./routes/authorization');
var profilesRouter = require('./routes/profiles');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var schoolsRouter = require('./routes/schools');
var branchOfficeRouter = require('./routes/branch-offices');

/*instanciamos express*/
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*definimos la ruta inicial y recurso a utilizar*/
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profiles', profilesRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/schools', schoolsRouter);
app.use('/branch-offices', branchOfficeRouter);

module.exports = app;