/* ─────────────────────────────────────────────
  EduPulse — Account Controller
───────────────────────────────────────────── */
const pool = require('../config/database')
const bcrypt = require('bcryptjs')

/* ─── Login view ─────────────────────────────── */
exports.loginView = (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/account/dashboard')
    }
    res.render('account/login', {
        title: 'Login | EduPulse',
        errors: [],
        old: {}
    })
}

/* ─── Login process ──────────────────────────── */
exports.loginProcess = async (req, res) => {
    const { email, password } = req.body
    const errors = []

    if (!email || !email.includes('@')) errors.push('A valid email is required.')
    if (!password || password.length < 6) errors.push('Password must be at least 6 characters.')

    if (errors.length) {
        return res.status(422).render('account/login', {
            title: 'Login | EduPulse',
            errors,
            old: { email }
        })
    }

    try {
        const { rows } = await pool.query(
            'SELECT * FROM account WHERE account_email = $1',
            [email.trim().toLowerCase()]
        )

        if (!rows.length) {
            return res.status(401).render('account/login', {
                title: 'Login | EduPulse',
                errors: ['Invalid email or password.'],
                old: { email }
            })
        }

        const account = rows[0]
        const match = await bcrypt.compare(password, account.account_password)

        if (!match) {
            return res.status(401).render('account/login', {
                title: 'Login | EduPulse',
                errors: ['Invalid email or password.'],
                old: { email }
            })
        }

        /* Set session */
        req.session.loggedIn = true
        req.session.userId = account.account_id
        req.session.firstName = account.account_firstname
        req.session.isAdmin = account.account_type === 'Admin'

        req.flash('success', `Welcome back, ${account.account_firstname}!`)
        res.redirect('/account/dashboard')

    } catch (err) {
        console.error('[accountController.loginProcess]', err)
        res.status(500).render('errors/500', {
            title: 'Server Error',
            message: 'Login failed. Please try again.'
        })
    }
}

/* ─── Logout ─────────────────────────────────── */
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('[accountController.logout]', err)
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
}

/* ─── Register view ──────────────────────────── */
exports.registerView = (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/account/dashboard')
    }
    res.render('account/register', {
        title: 'Register | EduPulse',
        errors: [],
        old: {}
    })
}

/* ─── Register process ───────────────────────── */
exports.registerProcess = async (req, res) => {
    const { firstname, lastname, email, password, confirm_password } = req.body
    const errors = []

    if (!firstname || firstname.trim().length < 2)
        errors.push('First name must be at least 2 characters.')
    if (!lastname || lastname.trim().length < 2)
        errors.push('Last name must be at least 2 characters.')
    if (!email || !email.includes('@'))
        errors.push('A valid email address is required.')
    if (!password || password.length < 6)
        errors.push('Password must be at least 6 characters.')
    if (password !== confirm_password)
        errors.push('Passwords do not match.')

    if (errors.length) {
        return res.status(422).render('account/register', {
            title: 'Register | EduPulse',
            errors,
            old: { firstname, lastname, email }
        })
    }

    try {
        /* Check for duplicate email */
        const existing = await pool.query(
            'SELECT account_id FROM account WHERE account_email = $1',
            [email.trim().toLowerCase()]
        )

        if (existing.rows.length) {
            return res.status(409).render('account/register', {
                title: 'Register | EduPulse',
                errors: ['An account with that email already exists.'],
                old: { firstname, lastname, email }
            })
        }

        /* Hash password */
        const hashedPassword = await bcrypt.hash(password, 10)

        /* Insert new account */
        await pool.query(
            `INSERT INTO account
         (account_firstname, account_lastname, account_email, account_password)
       VALUES ($1, $2, $3, $4)`,
            [
                firstname.trim(),
                lastname.trim(),
                email.trim().toLowerCase(),
                hashedPassword
            ]
        )

        req.flash('success', 'Account created! Please log in.')
        res.redirect('/account/login')

    } catch (err) {
        console.error('[accountController.registerProcess]', err)
        res.status(500).render('errors/500', {
            title: 'Server Error',
            message: 'Registration failed. Please try again.'
        })
    }
}

/* ─── Account dashboard ──────────────────────── */
exports.dashboard = async (req, res) => {
    if (!req.session.loggedIn) {
        req.flash('error', 'Please log in to view your dashboard.')
        return res.redirect('/account/login')
    }

    try {
        const { rows } = await pool.query(
            'SELECT * FROM account WHERE account_id = $1',
            [req.session.userId]
        )

        if (!rows.length) {
            return res.redirect('/account/login')
        }

        res.render('account/dashboard', {
            title: 'Dashboard | EduPulse',
            account: rows[0]
        })

    } catch (err) {
        console.error('[accountController.dashboard]', err)
        res.status(500).render('errors/500', {
            title: 'Server Error',
            message: 'Could not load dashboard.'
        })
    }
}