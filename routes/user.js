//this file for user routes
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/auth');
const {
    registerGet,
    registerPost,
    loginGet,
    loginPost,
    logout,
    dashboardGet
} = require('../controllers/userController');

// Register Routes
router.get('/register', registerGet);
router.post('/register', registerPost);

// Login / Logout Routes
router.get('/login', loginGet);
router.post('/login', loginPost);
router.post('/logout', logout);

// Dashboard Route (Protected)
router.get('/dashboard', ensureAuth, dashboardGet);


module.exports = router;
