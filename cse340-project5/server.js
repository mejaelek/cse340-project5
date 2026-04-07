/* ******************************************
 * server.js - Main application entry point
 * ******************************************/
require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const session = require("express-session")
const pool = require("./database/")
const cookieParser = require("cookie-parser")
const utilities = require("./utilities/")

/* ***********************
 * Middleware
 *************************/
// Session middleware
app.use(
    session({
        store: new (require("connect-pg-simple")(session))({
            createTableIfMissing: true,
            pool,
        }),
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        name: "sessionId",
    })
)

// Express Messages Middleware
app.use(require("connect-flash")())
app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res)
    next()
})

// Cookie Parser Middleware
app.use(cookieParser())

// JWT Token Check Middleware
app.use(utilities.checkJWTToken)

// Body Parsers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* ***********************
 * View Engine & Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Static Files
 *************************/
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
app.use("/account", require("./routes/accountRoute"))
app.use("/inv", require("./routes/inventoryRoute"))

// Index route
app.get("/", utilities.handleErrors(require("./controllers/baseController").buildHome))

/* ***********************
 * 404 Handler
 *************************/
app.use(async (req, res, next) => {
    next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    const message =
        err.status === 404
            ? err.message
            : "Oh no! There was a crash. Maybe try a different route?"
    res.render("errors/error", {
        title: err.status || "Server Error",
        message,
        nav,
    })
})

/* ***********************
 * Server Start
 *************************/
const port = process.env.PORT
const host = process.env.HOST || "localhost"

app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`)
}) 