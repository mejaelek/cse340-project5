/* ─────────────────────────────────────────────
  EduPulse — Index / Base Routes
───────────────────────────────────────────── */
const express = require('express')
const router = express.Router()

/* ─── Home page ──────────────────────────────── */
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Welcome to EduPulse',
        message: 'Student Feedback & Rating System'
    })
})

/* ─── About page ─────────────────────────────── */
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About EduPulse'
    })
})

module.exports = router