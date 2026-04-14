/* ─────────────────────────────────────────────
  EduPulse — Account / Auth Routes
───────────────────────────────────────────── */
const express = require('express')
const router = express.Router()
const accountController = require('../controllers/accountController')

/* ─── Login ──────────────────────────────────── */
router.get('/login', accountController.loginView)
router.post('/login', accountController.loginProcess)

/* ─── Logout ─────────────────────────────────── */
router.get('/logout', accountController.logout)

/* ─── Register ───────────────────────────────── */
router.get('/register', accountController.registerView)
router.post('/register', accountController.registerProcess)

/* ─── Account dashboard (protected) ─────────── */
router.get('/dashboard', accountController.dashboard)

module.exports = router