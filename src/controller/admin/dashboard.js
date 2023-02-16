const pool = require("../../database/index");
const authValidation = require('../../validation/authValidation')
const bcrypt = require("bcryptjs")
const handleJWT = require("../../utils/handleJWT")
const jwt = require('jsonwebtoken')
const util = require('util')


const dashboardController = {

    home: async (req, res) => {
        try {

            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            let name = "";
            let role = "";
            let username = "";
            try {
                const user = await util.promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
                console.log(user)
                role = user.role
                username = user.username
                name = user.lastname + ", " + user.firstname
                res.json({ user_role: role, username: username, message: "Welcome " + name })
            } catch (err) {
                return res.status(400).send({ success: false, message: "Invalid Tokens" });
            }
        } catch (err) {
            console.log(err)
        }
    }
}


module.exports = dashboardController