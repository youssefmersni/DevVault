// routes/work.js
const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middlewares/auth');
const {
  newWorkGet,
  createWorkPost,
  toggleWorkCompletion,
  editWorkGet,
  updateWorkPut,
    deleteWork
} = require('../controllers/workController');

// @desc    Show page to add new work
// @route   GET /works/new
router.get('/new', ensureAuth, newWorkGet);

// @desc    Process add form
// @route   POST /works
router.post('/', ensureAuth, createWorkPost);

// @desc    Toggle work completion status
// @route   POST /works/:id/toggle
router.post('/:id/toggle', ensureAuth, toggleWorkCompletion);
// @desc    Show edit form
// @route   GET /works/:id/edit
router.get('/:id/edit', ensureAuth, editWorkGet);      // show edit form
// @desc    Update work item
// @route   PUT /works/:id
router.put('/:id', ensureAuth, updateWorkPut);   // update work
router.delete('/:id', ensureAuth, deleteWork);


module.exports = router;