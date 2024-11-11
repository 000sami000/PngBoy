const express =require('express')
const bodyParser =require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');
const morgan=require('morgan')
const path=require('path')
const dotenv=require('dotenv')
const app=express();
dotenv.config()
let post_routes=require("./routes/posts")
let user_routes=require("./routes/users")
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(bodyParser.json({limit:"30mb",extended:true}))
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'))
app.use('/posts',post_routes)
app.use('/users',user_routes)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT=process.env.PORT || 5000;
try{

    mongoose.connect(process.env.MONGODB_CONNECTION_URL_LOCAL);
    app.listen(PORT,()=>{
         console.log(`Server running on port ${PORT}`)
        })
    }
    catch(err){
    console.log(err)

}
