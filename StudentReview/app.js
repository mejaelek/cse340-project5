/* ─────────────────────────────────────────────
  EduPulse — CSE 340
  Main application entry point
───────────────────────────────────────────── */
require('dotenv').config()
const express = require('express')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const pool = require('./config/database')

/* ─── App instance ───────────────────────────── */
const app = express()
const PORT = process.env.PORT || 5500

/* ─────────────────────────────────────────────
   View engine — EJS
───────────────────────────────────────────── */
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

/* ─────────────────────────────────────────────
   Middleware
───────────────────────────────────────────── */

/* Static files */
app.use(express.static(path.join(__dirname, 'public')))

/* Parse request bodies */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Session */
app.use(session({
    secret: process.env.SESSION_SECRET || 'edupulse_secret',
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24   // 24 hours
    }
}))

/* Flash messages */
app.use(flash())

/* ─────────────────────────────────────────────
   Global template locals
   Available inside every EJS view automatically
───────────────────────────────────────────── */
app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.notice = req.flash('notice')
    res.locals.userId = req.session.userId || null
    res.locals.isAdmin = req.session.isAdmin || false
    res.locals.loggedIn = req.session.loggedIn || false
    res.locals.firstName = req.session.firstName || null
    res.locals.lastName = req.session.lastName || null
    res.locals.accountData = req.session.accountData || null
    next()
})

/* ─────────────────────────────────────────────
   Routes
───────────────────────────────────────────── */

/* Index / base routes */
const indexRouter = require('./routes/index')
app.use('/', indexRouter)

/* Account routes */
const accountRouter = require('./routes/accountRoute')
app.use('/account', accountRouter)

/* Feedback routes — W06 enhancement */
const feedbackRouter = require('./routes/feedbackRoutes')
app.use('/courses/:course_id/feedback', feedbackRouter)

/* ─────────────────────────────────────────────
   404 handler — no route matched
───────────────────────────────────────────── */
app.use((req, res, next) => {
    res.status(404).render('errors/404', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.'
    })
})

/* ─────────────────────────────────────────────
   Global error handler
───────────────────────────────────────────── */
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`)
    const status = err.status || 500
    res.status(status).render('errors/500', {
        title: 'Server Error',
        message: process.env.NODE_ENV === 'production'
            ? 'Something went wrong. Please try again later.'
            : err.message
    })
})

/* ─────────────────────────────────────────────
   Start server
───────────────────────────────────────────── */
app.listen(PORT, () => {
    console.log(`EduPulse running on http://localhost:${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})

module.exports = app