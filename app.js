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
var salesRouter = require('./routes/sales');
var paymentsRouter = require('./routes/payments');
var existancesRouter = require('./routes/existances');

/*instanciamos express*/
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static('uploads'));

/*definimos la ruta inicial y recurso a utilizar*/
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profiles', profilesRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/schools', schoolsRouter);
app.use('/branch-offices', branchOfficeRouter);
app.use('/sales', salesRouter);
app.use('/payments', paymentsRouter);
app.use('/existances', existancesRouter);

module.exports = app;