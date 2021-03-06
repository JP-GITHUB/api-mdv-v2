const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

/*importamos archivos de rutas */
var indexRouter = require('./routes/index');
var authRouter = require('./routes/authorization');
var profilesRouter = require('./routes/profiles');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var schoolsRouter = require('./routes/schools');
var branchOfficeRouter = require('./routes/branch-offices');
var salesRouter = require('./routes/sales');
var purchasesRouter = require('./routes/purchases');
var paymentsRouter = require('./routes/payments');
var existancesRouter = require('./routes/existances');

/*instanciamos express*/
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(fileUpload());

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
app.use('/purchases', purchasesRouter);
app.use('/payments', paymentsRouter);
app.use('/existances', existancesRouter);

module.exports = app;