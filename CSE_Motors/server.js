require("dotenv").config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const app = express()
const staticRoutes = require("./routes/index")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")

const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

// View engine
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

// Static files
app.use(express.static("public"))

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/", staticRoutes)
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route before error handler
app.use(async (req, res, next) => {
    next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

// Express Error Handler - place after all other middleware
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    const message =
        err.status == 404
            ? err.message
            : "Oh no! There was a crash. Maybe try a different route?"
    res.render("errors/error", {
        title: err.status || "Server Error",
        nav,
        message,
    })
})

app.listen(port, () => {
    console.log(`App listening on ${host}:${port}`)
}) 