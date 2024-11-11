let mongoose=require('mongoose')
const post_schema=new mongoose.Schema({
    title:{
        type:String
    },
    creator_img:{
        type:String
    },
    text:{
        type:String
    },
    name:{type:String},
    creator:{type:String},
    category:[String],
    file:String,
    likes:{
        type:[String],
        default:[]
    },
    ispublished:{
    type:Boolean,
     default:false
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    comment:{type:[String],default:[]}
},{ timestamps: true })
const postModel=mongoose.model('posts',post_schema);
module.exports=postModel;