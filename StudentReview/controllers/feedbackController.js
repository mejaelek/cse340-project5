const Feedback = require('../models/Feedback');

exports.index = async (req, res) => {
    try {
        const { course_id } = req.params;
        const [feedbackList, avg, distribution] = await Promise.all([
            Feedback.findByCourse(course_id),
            Feedback.averageRating(course_id),
            Feedback.ratingDistribution(course_id),
        ]);
        res.render('feedback/index', { feedbackList, avg, distribution, course_id });
    } catch (err) {
        console.error('[feedback.index]', err);
        res.status(500).render('error', { message: 'Could not load feedback.' });
    }
};

exports.newForm = async (req, res) => {
    const { course_id } = req.params;
    const student_id = req.session.userId;
    try {
        const submitted = await Feedback.alreadySubmitted(course_id, student_id);
        if (submitted) {
            return res.redirect(`/courses/${course_id}/feedback?notice=already_submitted`);
        }
        res.render('feedback/new', { course_id, errors: [], old: {} });
    } catch (err) {
        console.error('[feedback.newForm]', err);
        res.status(500).render('error', { message: 'Could not load form.' });
    }
};

exports.create = async (req, res) => {
    const { course_id } = req.params;
    const student_id = req.session.userId;
    const { rating, difficulty, enjoyed, improve, recommend } = req.body;
    const data = { rating: Number(rating), difficulty, enjoyed, improve, recommend };

    const errors = Feedback.validate(data);
    if (errors.length) {
        return res.status(422).render('feedback/new', { course_id, errors, old: req.body });
    }

    try {
        const duplicate = await Feedback.alreadySubmitted(course_id, student_id);
        if (duplicate) {
            return res.status(409).render('feedback/new', {
                course_id, errors: ['You have already submitted feedback for this course.'], old: req.body,
            });
        }
        await Feedback.create({ course_id, student_id, ...data });
        res.redirect(`/courses/${course_id}/feedback?notice=submitted`);
    } catch (err) {
        console.error('[feedback.create]', err);
        res.status(500).render('error', { message: 'Could not save feedback.' });
    }
};

exports.show = async (req, res) => {
    try {
        const item = await Feedback.findById(req.params.id);
        if (!item) return res.status(404).render('error', { message: 'Feedback not found.' });
        res.render('feedback/show', { item });
    } catch (err) {
        console.error('[feedback.show]', err);
        res.status(500).render('error', { message: 'Could not load feedback.' });
    }
};

exports.destroy = async (req, res) => {
    try {
        const item = await Feedback.findById(req.params.id);
        if (!item) return res.status(404).render('error', { message: 'Feedback not found.' });
        if (item.student_id !== req.session.userId && !req.session.isAdmin) {
            return res.status(403).render('error', { message: 'Not authorised.' });
        }
        await Feedback.delete(req.params.id);
        res.redirect('back');
    } catch (err) {
        console.error('[feedback.destroy]', err);
        res.status(500).render('error', { message: 'Could not delete feedback.' });
    }
};

exports.analytics = async (req, res) => {
    const { course_id } = req.params;
    try {
        const [avg, distribution] = await Promise.all([
            Feedback.averageRating(course_id),
            Feedback.ratingDistribution(course_id),
        ]);
        res.render('feedback/analytics', { course_id, avg, distribution });
    } catch (err) {
        console.error('[feedback.analytics]', err);
        res.status(500).render('error', { message: 'Could not load analytics.' });
    }
};
const recDistribution = await db.query(
    `SELECT recommend, COUNT(*) AS count FROM feedback WHERE course_id=$1 GROUP BY recommend`,
    [course_id]
).then(r => r.rows);

res.render('feedback/analytics', { course_id, avg, distribution, recDistribution });