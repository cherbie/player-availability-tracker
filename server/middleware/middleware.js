const cookieParser = require("cookie-parser")
const logger = require("morgan")
const path = require("path")
const express = require("express")
const createError = require("http-errors")

const apiRouter = require("../routes/api")
const indexRouter = require("../routes/index")

module.exports = app => {
  app.use(cookieParser())
  app.use(logger("dev"))
  app.use(express.json())
  app.use(express.static(`${__dirname}/../public`))

  app.use("/", indexRouter)
  app.use("/api", apiRouter)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    console.log(process.env.NODE_ENV)
    res.locals.message = err.message
    res.locals.error = process.env.NODE_ENV === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.json({
      msg: res.locals.message,
      stack: err.stack,
      env: process.env.NODE_ENV
    })
  })
}