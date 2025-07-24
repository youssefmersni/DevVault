// controllers/workController.js
const Work = require('../models/work');

// @desc    Show the form for creating a new work
// @route   GET /works/new
exports.newWorkGet = (req, res) => {
  res.render('works/new', { title: 'Add Work' });
};

// @desc    Create a new work item
// @route   POST /works
exports.createWorkPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    await Work.create({
      title,
      description,
      user: req.session.user.id, // associate with logged-in user
    });

    req.flash('success_msg', 'New work added successfully');
    res.redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to add work');
    res.redirect('/works/new');
  }
};

// @desc    Toggle completion status of a work item
// @route   POST /works/:id/toggle
exports.toggleWorkCompletion = async (req, res) => {
  try {
    const work = await Work.findOne({ _id: req.params.id, user: req.session.user.id });
    if (!work) {
      req.flash('error_msg', 'Work item not found');
      return res.redirect('/users/dashboard');
    }
    work.completed = !work.completed;
    await work.save();
    req.flash('success_msg', `Work marked as ${work.completed ? 'done' : 'not done'}`);
    res.redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong');
    res.redirect('/users/dashboard');
  }
};


exports.editWorkGet = async (req, res) => {
    try{
        const work = await Work.findById(req.params.id).lean();
        if (!work) {
            req.flash('error_msg', 'Work item not found.');
            return res.redirect('/users/dashboard');
        }
        if (work.user.toString() !== req.session.user.id) {
            req.flash('error_msg', 'Not authorized.');
            return res.redirect('/users/dashboard');
        }
       res.render('works/edit', { work });
    }catch(err){
        console.error(err);
        req.flash('error_msg', 'Failed to load edit form');
        res.redirect('/users/dashboard');
    }
};

exports.updateWorkPut = async (req, res) => {
    try {
        const work = await Work.findOneAndUpdate(
            { _id: req.params.id, user: req.session.user.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!work) {
            req.flash('error_msg', 'Work item not found or you are not authorized.');
            return res.redirect('/users/dashboard');
        }

        req.flash('success_msg', 'Work item updated successfully');
        res.redirect('/users/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to update work item');
        res.redirect(`/works/${req.params.id}/edit`);
    }
};

exports.deleteWork = async (req, res) => {
  try {
    const result = await Work.deleteOne({ _id: req.params.id, user: req.session.user.id });

    if (result.deletedCount === 0) {
      req.flash('error_msg', 'Work item not found or you are not authorized.');
      return res.redirect('/users/dashboard');
    }

    req.flash('success_msg', 'Work item deleted successfully');
    res.redirect('/users/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Failed to delete work item');
    res.redirect('/users/dashboard');
  }
};
