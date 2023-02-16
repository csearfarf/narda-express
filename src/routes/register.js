const router = require('express').Router();
const registerController = require('../controller/register')

router.post("/admin",registerController.adminregister)

module.exports = router