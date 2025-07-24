const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db.js');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const userRoutes = require('./routes/user');
const workRoutes = require('./routes/work.js');

const methodOverride = require('method-override');

const app = express();

// Connect to MongoDB-test
connectDB();
// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, 
  }),
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = {
    success_msg: req.flash('success_msg'),
    error_msg: req.flash('error_msg'),
  };
  res.locals.user = req.session.user || null;
  next();
})
// Mount user routes
app.use('/users', userRoutes);
app.use('/works', workRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});