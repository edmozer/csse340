/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const reviewRoute = require("./routes/reviewRoute")
const { handle404, errorHandler } = require("./middleware/errorHandler")
const utilities = require("./utilities")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

// Static assets (skip DB/session work)
app.use(static)

/* ***********************
 * Middleware
 *************************/
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1)
}

const sessionSecret = process.env.SESSION_SECRET
if (process.env.NODE_ENV === "production" && !sessionSecret) {
  throw new Error("Missing SESSION_SECRET in production environment")
}

app.use(
  session({
    name: "cse340.sid",
    secret: sessionSecret || "dev-only-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
)

app.use(flash())

// Check JWT token and make account data available to views
app.use(utilities.checkJWTToken)

// Make flash messages + nav available to all views
app.use(async (req, res, next) => {
  try {
    res.locals.notice = req.flash("notice")
    res.locals.nav = await utilities.getNav()
    next()
  } catch (err) {
    next(err)
  }
})

/* ***********************
 * Routes
 *************************/

/* ***********************
 * Index route
 *************************/
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})

/* ***********************
 * Inventory routes
 *************************/
app.use("/inv", inventoryRoute)

/* ***********************
 * Account routes
 *************************/
app.use("/account", accountRoute)

/* ***********************
 * Review routes
 *************************/
app.use("/review", reviewRoute)

/* ***********************
 * Error Handling
 *************************/
app.use(handle404)
app.use(errorHandler)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
