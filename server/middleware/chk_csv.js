const userModel = require("../models/user_model");
const chk_csv = async (req, res, next) => {
    try{
        const {recentcsv}=await userModel.findById({_id:req.userID},{recentcsv:1})
           
        if(recentcsv){
            req.recentcsv=recentcsv;
            console.log(req.recentcsv,"::::")
         next();
        }else{
        return res.status(400).json({message:"failed to upload images because no csv file uploaded"})
        }
    }catch(err){
        console.log("middleware--error :",err)
    }
};

module.exports=chk_csv