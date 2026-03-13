/* ******************************************
* Server.js - CSE Motors Main Entry Point
*******************************************/
require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const app = express();
const port = process.env.PORT || 5500;

/* ***********************
 * View Engine & Layouts
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Routes
 *************************/
const indexRouter = require("./routes/static");
app.use("/", indexRouter);

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
    console.log(`CSE Motors app listening at http://localhost:${port}`);
});