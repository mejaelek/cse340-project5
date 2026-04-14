const express = require('express');
const router = express.Router({ mergeParams: true });
const ctrl = require('../controllers/feedbackController');
const auth = require('../middleware/auth');   // your existing auth middleware

router.get('/', ctrl.index);
router.get('/new', auth, ctrl.newForm);
router.post('/', auth, ctrl.create);
router.get('/:id', ctrl.show);
router.post('/:id/delete', auth, ctrl.destroy);
router.get('/analytics', ctrl.analytics);

module.exports = router; 