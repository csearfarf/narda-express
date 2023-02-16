const router = require('express').Router();
const authController = require('../controller/auth')
const tokenController = require('../controller/token')

router.post("/admin",authController.adminlogin)
router.post("/token",tokenController.token)
// router.get("/user",authController.userlogin)

module.exports = router