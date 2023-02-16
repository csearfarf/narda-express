const pool = require("../database/index");
const authValidation = require('../validation/authValidation')
const bcrypt = require("bcryptjs")
const handleJWT = require("../utils/handleJWT")


const authController = {
    adminlogin: async (req, res) => {
     
        try {
   
            const {error}  =  authValidation.adminLoginValidation(req.body)
            if (error) {
                const errorMessage = error.details.map((item) => item.message); // extract/map only one column in joi validator
                return res.status(400).send({ success: false, message: errorMessage })
            }


            const sql = "SELECT * FROM admin WHERE USERNAME = ? "
            const [rows, fields] = await pool.query(sql, [req.body.username])

            if (rows.length < 1) return res.status(400).send({ success: false, message: "User not found" })
           
            //check student pass if correct
            const validPass = await bcrypt.compare(req.body.password, rows[0].password)
            if (!validPass) return res.status(400).send({ success: false, message: "Invalid Password !" });

            const userDetails = {
                username:rows[0].username,
                firstname:rows[0].firstname,
                lastname:rows[0].lastname,
                role:"Admin"
            }
            //generate token 
            const accessToken = await handleJWT.generateJWT(userDetails);
            const refreshToken = await handleJWT.refreshJWT(userDetails);

            // update in tbl the newlycreated token or updated token of user
            try{
               const tokenUpdated = await handleJWT.updateRefreshToken(userDetails.username,userDetails.role,refreshToken);
               //console.log(tokenUpdated)
               if(!tokenUpdated.success) return res.status(400).send({ success: false, message: tokenUpdated.message});

            } catch(err){
                console.log(err)
            }

            
            res.json({success:true,accessToken:accessToken,refreshToken:refreshToken})
        } catch (err) {
            console.log(err)
        }
    },
    userlogin: async (req, res) => {
        try {
            res.json({ message: "test" })
        } catch (err) {
            console.log(err)
        }
    }
}


module.exports = authController