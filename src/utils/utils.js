function roleDesignation(type){
    return (req,res,next)=>{
        if(type!==req.user.role) return res.status(401).send('Role fail : Access Denied');
        next();
    }
   
}

function giveSpecificRole(role){
    if(role=="1"){
        role="Office Admin";
    }else{
        role="Staff";
    }
    return role;
}



module.exports = {roleDesignation,giveSpecificRole}