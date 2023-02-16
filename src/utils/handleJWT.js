const jwt = require('jsonwebtoken')
const util = require('util')
const pool = require("../database/index");


const handleJWT = {
    generateJWT: async function (user) {
        return new Promise((resolve, reject) => {
            jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    },
    refreshJWT: async function (user) {
        return new Promise((resolve, reject) => {
            jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3h' }, (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    },
    verifyJWT: async function (req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.status(401).send({success:false,message:"Access Denied"});
        }

        try {
            const user = await util.promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = user;
            // console.log(user)
            next();
        } catch (err) {
            return res.status(400).send({success:false,message:"Invalid Token"});
        }
    },
    updateRefreshToken: async function (username, role, refreshToken) {
        const sql = "SELECT * FROM refreshtoken WHERE username = ? AND user_type = ? "
        const [rows, fields] = await pool.query(sql, [username,role])
        if (rows.length < 1){  // if not existing insert new token for user :) 
            const sql = "INSERT INTO `refreshtoken` ( `username`, `token`, `user_type`,`date_created`) VALUES ( ?, ?, ? ,now())"
            const [rows, fields] = await pool.query(sql, [username,refreshToken,role])
            if(rows.affectedRows>0){
                return {success:true,message:"Added new token for user :" +username}
            }else{
                return {success:false,message:"Unable to save new token for user :" +username}
            }
        }else{ // if not lets update existing token of user
            const sql = "UPDATE `refreshtoken`  SET `user_type` = ? , `token` = ? ,date_created=now() WHERE `username` = ?  "
            const [rows, fields] = await pool.query(sql, [role,refreshToken,username])
           
            if(rows.changedRows>0){
                return {success:true,message:"Updated new token for user :" +username}
            }else{
                return {success:false,message:"Unable to update new token for user :" +username}
            }
        }
        
    },


}


module.exports = handleJWT