const express = require("express")
const { SignupController, SigninController, VerifyController } = require("./../../controllers/auth.controller")
const { AuthenticationMiddleware } = require("./../../middlewares/auth.middleware")

const authRouter = express.Router()

authRouter.post("/signup", SignupController)

authRouter.post("/signin", SigninController)

authRouter.get("/verify", AuthenticationMiddleware, VerifyController)

module.exports = authRouter