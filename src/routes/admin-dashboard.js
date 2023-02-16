const router = require('express').Router();
const dashboardController = require('../controller/admin/dashboard')
const handleJWT = require('../utils/handleJWT');
const utils = require("../utils/utils");
const ROLE = "Admin";

// Since this routes is for only admin, lets check the bearer token in Authorization Header :) 

router.get("/home",handleJWT.verifyJWT,utils.roleDesignation(ROLE),dashboardController.home)
// router.get("/user",authController.userlogin)

module.exports = router