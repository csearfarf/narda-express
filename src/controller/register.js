const pool = require("../database/index");
const registerValidation = require('../validation/registerValidation')
const bcrypt = require("bcryptjs")


const registerController = {
    adminregister:async(req,res)=>{
        const salt = await bcrypt.genSalt(10);

        try{
            const {error}  =  registerValidation.adminRegisterValidation(req.body)
            //console.log(error.details)
           
            if(error){
                const errorMessage = error.details.map( (item) => item.message); // extract/map only one column in joi validator
                return res.status(400).send({success:false,message:errorMessage})
            } 
          
            const sql = "SELECT * FROM ADMIN WHERE USERNAME = ? "
            const [rows,fields] = await pool.query(sql,[req.body.username])

            if(rows.length>0) return res.status(400).send({success:false,message:"Username is already taken, Please use other username"})

            const sqlI = "INSERT INTO `admin` ( `firstname`, `lastname`, `active`, `username`, `password`) VALUES ( ?, ?, '1', ?, ?)"

            // generate salt using req.password
            const hashedpassword=  await bcrypt.hash(req.body.password,salt);
            const [rowsI,fieldsI] = await pool.query(sqlI,[req.body.firstname,req.body.lastname,req.body.username,hashedpassword])
            //console.log(rowsI)
            if(rowsI.affectedRows>0){
                return res.status(200).send({success:true,message:"New Admin successfully created."})
            }


            
            res.json({data:rows})
        }catch(err){
            console.log(err)
        }
    }
}


module.exports = registerController