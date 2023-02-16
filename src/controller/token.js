const pool = require("../database/index");
const registerValidation = require('../validation/registerValidation')
const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken')
const handleJWT = require("../utils/handleJWT")


const tokenController = {
    token: async (req, res) => {
        const refreshToken = req.body.refreshtoken;
        if (refreshToken == null) return res.status(400).send({ success: false, message: "Refresh Token is required/not allowed to be empty" })
        try {
            const sql = "SELECT * FROM refreshtoken WHERE token = ? "
            const [rows, fields] = await pool.query(sql, [refreshToken])
            //console.log({token:refreshToken,response:rows})
            if(rows.length<1) return res.status(400).send({success:false,message:"Refresh token not found"})
            
            jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,async (err,user)=>{
                if(err) res.status(400).send({success:false,message:"Invalid Refresh Token"});
                //generating new access token
                const userDetails = {
                    username:user.username,
                    firstname:user.firstname,
                    lastname:user.lastname,
                    role:user.role
                };
                  //generate token 
                const accessToken = await handleJWT.generateJWT(userDetails);
                const refreshToken = await handleJWT.refreshJWT(userDetails);
                const sql = "UPDATE `refreshtoken`  SET `user_type` = ? , `token` = ? ,date_created=now() WHERE `username` = ?  "
                const [rows, fields] = await pool.query(sql, [userDetails.role,refreshToken,userDetails.username])
               
                if(rows.changedRows>0){
                    // return {success:true,message:"Updated new token for user :" +username}
                    res.json({success:true,accessToken:accessToken,refreshToken:refreshToken})
                }else{
                    return res.status(400).send({success:false,message:"Unable to update refresh token"})
                }
            })


        } catch (err) {
            console.log(err)
        }





    }
}


module.exports = tokenController