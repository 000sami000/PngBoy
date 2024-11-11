let mongoose=require('mongoose')
const user_schema=new mongoose.Schema({
    profile_img_:{type:String,default:""},    
name:{type:String,required:true},
email:{type:String,required:true},
password:{type:String,required:true},
username:{type:String,require:true},
isadmin:{type:Boolean,default:false},
downloads: {
        type: [String],
        validate: {
            validator: function (downloads) {
                return downloads.length <= 10;
            },
            message: 'You can only have a maximum of 10 downloads.'
        }
    },
    recentcsv:{type:String,default:''}
},{ timestamps: true })
const userModel=mongoose.model('user',user_schema);
module.exports=userModel;