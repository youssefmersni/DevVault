// controllers/userController.js
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const Work = require('../models/work');

// @desc    Show the register page
// @route   GET /users/register
exports.registerGet = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.registerPost = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error_msg', 'Email is already registered');
      return res.redirect('/users/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // async version

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    console.error(err.message);
    req.flash('error_msg', 'Server error');
    res.redirect('/users/register');
  }
};

// @desc    Show the login page
// @route   GET /users/login
exports.loginGet = (req, res) => {
  // This assumes you have a 'login.ejs' file in your 'views' directory
  res.render('login', { title: 'Login' });
};

// @desc    Authenticate user & handle login
// @route   POST /users/login
exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/users/login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        req.flash('error_msg', 'Invalid email or password');
        return res.redirect('/users/login');
    }

    // Save user in session
    req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email
    };

    req.flash('success_msg', 'You are now logged in');
    res.redirect('/users/dashboard'); // Redirect to a dashboard or home page after login
  } catch (err) {
    console.error(err.message);
    req.flash('error_msg', 'Server error');
    res.redirect('/users/login');
  }
};

// @desc    Logout user
// @route   GET /users/logout
exports.logout = (req, res) => {
  req.flash('success_msg', 'You are logged out');
  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.redirect('/users/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/users/login');
  });
};




// @desc    Show the user dashboard
// @route   GET /users/dashboard
exports.dashboardGet = async (req, res) => {
  try {
    const works = await Work.find({ user: req.session.user.id }).sort({ createdAt: -1 }).lean();
    res.render('dashboard', {
      title: 'Dashboard',
      user: req.session.user,
      works
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
