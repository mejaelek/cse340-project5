/* ===================================================
   server.js — Application Entry Point
   CSE 340 Assignment 4
   =================================================== */
require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const expressMessages = require("express-messages");
const path = require("path");

const utilities = require("./utilities");
const baseRouter = require("./routes/base");
const inventoryRouter = require("./routes/inventoryRoute");
const accountRouter = require("./routes/accountRoute");

const app = express();

/* ── View Engine ────────────────────────────────── */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ── Static Files ───────────────────────────────── */
app.use(express.static(path.join(__dirname, "public")));

/* ── Body Parsers ───────────────────────────────── */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Session & Flash ────────────────────────────── */
app.use(
    session({
        store: new (require("express-session").MemoryStore)(),
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: true,
        saveUninitialized: true,
        name: "sessionId",
    })
);
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = expressMessages(req, res);
    next();
});

/* ── Nav Builder Middleware ─────────────────────── */
app.use(async (req, res, next) => {
    try {
        res.locals.nav = await utilities.getNav();
    } catch (err) {
        next(err);
    }
    next();
});

/* ── Routes ─────────────────────────────────────── */
app.use("/", baseRouter);
app.use("/inv", inventoryRouter);
app.use("/account", accountRouter);

/* ── 404 Handler ────────────────────────────────── */
app.use(async (req, res, next) => {
    next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ── Error Handler ──────────────────────────────── */
app.use(async (err, req, res, next) => {
    let nav = res.locals.nav || await utilities.getNav().catch(() => "");
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    const status = err.status || 500;
    const message =
        status === 404
            ? err.message
            : "Oh no! There was a crash. Maybe try a different route?";
    res.status(status).render("errors/error", {
        title: status + " Error",
        nav,
        message,
    });
});

/* ── Start Server ───────────────────────────────── */
const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || "localhost";
app.listen(PORT, () => {
    console.log(`🚀  App running → http://${HOST}:${PORT}`);
});
