const { default: mongoose } = require("mongoose");
const postModel = require("../models/post_model");
const fs=require("fs")
const path=require("path");
const Papa = require("papaparse");
const xlsx = require('xlsx');
const { updateAnalytics } = require("./helping_functions");
const userModel = require("../models/user_model");



const getposts = async (req, res) => {
  const { page ,user_id,sort,published} = req.query;

  try {
    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;

    const filter = {};
    if (user_id) {
      filter.likes = { $in: user_id };
      filter.ispublished = true; // Ensure only published posts are fetched if user_id is provided
    } else if (published) {
      filter.ispublished = true;
    }

    // Fetch posts based on filter, sort, and pagination
    const posts = await postModel
      .find(filter, {
        title: 1,
        file: 1,
        likes: 1,
        creator_img: 1,
        creator: 1,
        createdAt: 1,
        name: 1,
      })
      .sort({ _id: Number(sort) })
      .limit(LIMIT)
      .skip(startIndex);

    // Count total based on the filter
    const total = await postModel.countDocuments(filter);


    res
      .status(200)
      .json({
        data: posts,
        currentPage: Number(page),
        numberofPages: Math.ceil(total / LIMIT),
        startIndex: startIndex,
      });

  } catch (err) {
    res.status(404).json({ error: err });
  }
};
const getpost = async (req, res) => {
  const { id: _id } = req.params;
  try {
    const post = await postModel.findById(_id);

    res.status(200).json({post:post})
  } catch (err) {
    res.status(409).json({ error: err });
  }
};

const createpost = async (req, res) => {
  if(!req.isAdmin){
    return res.status(401).json({message:"Unauthorized access"})
  }
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  // Return the file paths or any necessary data to the client
  const filePaths = files.map(file => `/uploads/${file.filename}`);
  console.log(filePaths,":::::")
let newposts=  filePaths.map((itm)=>({...req.body,file:itm}))
let inserted=await postModel.insertMany(newposts);
  try {
    // await newposts.save();
    res.status(201).json(inserted);
  } catch (err) {
    res.status(409).json({ error: err });
  }
};
const updatepost = async (req, res) => {

  if(!req.isAdmin){
    return res.status(401).json({message:"Unauthorized access"})
  }
  const { id: _id } = req.params;
  const post = req.body;


  try {
    let updatedpost;
    if(req.file){
    
      const postfile=await postModel.findById(_id,{file:1})
      updatedpost = await postModel.findByIdAndUpdate(
        _id,
        { ...post, _id,file:`/uploads/${req.file.filename}` },
        { new: true }
      );
      const filePath = path.join(__dirname,'../uploads',postfile.file.split('/')[2] );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }
    else{
       updatedpost = await postModel.findByIdAndUpdate(
        _id,
        { ...post, _id },
        { new: true }
      );

    }

    res.status(200).json(updatedpost);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
const deletepost = async (req, res) => {
  if(!req.isAdmin){
    return res.status(401).json({message:"Unauthorized access"})
  }
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  try {
   const postfile=await postModel.findById(_id,{file:1})

   const filePath = path.join(__dirname,'../uploads',postfile.file.split('/')[2] );

fs.unlink(filePath, (err) => {
  if (err) {
    console.error('Error deleting file:', err);
  } else {
    console.log('File deleted successfully');
  }
});
    const deletedpost = await postModel.findByIdAndDelete(_id);
    res.status(200).json(deletedpost);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
const likepost = async (req, res) => {
  const { id: _id } = req.params;
  if (!req.userID) {
    return res.json({ message: "Unauthenticated" });
  }
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  try {

    const post = await postModel.findById(_id);
    const index = post.likes.findIndex((id) => id === String(req.userID));
    let updatedpost =null;
    if (index === -1) {
 
      post.likes.push(req.userID);
      updatedpost=   await postModel.findByIdAndUpdate(_id, post, {
         new: true,
       });
       await updateAnalytics(_id,'like',req.userID)
       
       
      } else {
        
        post.likes = post.likes.filter((id) => id !== String(req.userID));
        updatedpost=   await postModel.findByIdAndUpdate(_id, post, {
          new: true,
        });
        
        await updateAnalytics(_id,'unlike',req.userID)

    }
    
    res.status(200).json(updatedpost);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
const getsearchposts = async (req, res) => {
  console.log("Query params:", req.query);
  let { searchQuery, category, published } = req.query;
  // Process category to split and trim if provided
  category = category!='null' ? category.split("-").map((itm) => itm.trim()) : null;
  console.log(category,"LLLLL")

  try {
    // Initialize the filter object
    const filter = {};

    // Add search filter if searchQuery is provided
    if (searchQuery) {
      filter.title = new RegExp(searchQuery, "i");
      console.log("Adding title search:", filter.title);
    }

    // Add published status filter if provided
    console.log(published,"JLKJKJK")
    if (published) {
      filter.ispublished = published === 'true';
      console.log("Adding published filter:", filter.ispublished);
    }

    // Add category filter if category is provided
    if (category) {
      filter.category = { $in: category };
      console.log("Adding category filter:", filter.category);
    }

    // Log final filter for debugging
    console.log("Final filter object:", filter);

    // Fetch posts based on the filter
    const posts = await postModel.find(filter);

    // console.log("Filtered posts:", posts);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(400).json({ error: err });
  }
};

  const create_comment=async (req,res)=>{
    
  const {comment}=req.body;
 const {post_id}=req.params;

 try{
    const post =await postModel.findById(post_id);

    post.comment.unshift(comment);
    const updated_post=await postModel.findByIdAndUpdate(post_id,post,{new:true})
    res.status(200).json(updated_post);
 }catch(err){
   res.status(400).json({ error: err });

 }

}

   const csvUpload=async(req,res)=>{
    if(!req.isAdmin){
      return res.status(401).json({message:"Unauthorized access"})
    }
    try{
     
      if(!req.file){
        return res.status(400).json({message:"csv/xls file failed to upload "});
      }
    
      const {recentcsv}=await userModel.findById({_id:req.userID},{recentcsv:1})
        
        if(recentcsv){
          const filePath = path.join(__dirname,'../tmpcsv',recentcsv );
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('File deleted successfully');
            }
          });
        }     
      
      const filePaths = `${req.file.filename}`
     await    userModel.updateOne({_id:req.userID},{recentcsv:filePaths},{ new: true })
      // console.log(req.file,")))))(((((")
      return res.status(200).json({message:" message uploaded successfully "});
       
    }catch(err){
      console.log(err)
      res.status(400).json({ error: err });
    } 
   }

 const bulkUpload=async (req, res) => {
  if(!req.isAdmin){
    return res.status(401).json({message:"Unauthorized access"})
  }
  try {
   let recentcsv=req.recentcsv;
   console.log(recentcsv,")))")
    const images = req.files || req.file || []; // Get the images
  console.log(images,"9098980")
    let filePath=path.join(__dirname,'../tmpcsv',recentcsv );
  let parsedData;
          if (recentcsv.endsWith('.csv')) {
            // Read and parse CSV file
            const csvData = fs.readFileSync(filePath, 'utf8');
            parsedData = Papa.parse(csvData, { header: true }).data;
          } else if (recentcsv.endsWith('.xlsx')) {
            // Read and parse XLSX file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            parsedData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
          } else {
            res.status(500).json({ error: 'Unsupported file format' });
          }
            // console.log(parsedData,"lkjlklk")

  //   // Loop through CSV rows and create posts
  let posts=[]
    for (let i = 0; i < images.length; i++) {
      const dataEntry = parsedData[i];
      const image = images[i] || null;

//  console.log(image,88888)
//       // Add each post to the database
        posts.push({
        ...dataEntry,
        creator:req.userID,
        category:dataEntry?.category.split(","),
        ispublished:dataEntry?.ispublished=='TRUE'||'true'||true?true:false,
        file: `/uploads/${image?.filename}`, // Use the image path
      });
     
    }
      
   await postModel.insertMany(posts);
   
    if(recentcsv){
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
    }     
    res.status(200).json({ message: "Bulk upload completed successfully." });
  } catch (error) {
    console.log(error,"???")
    res.status(500).json({ error: "Bulk upload failed." });
  }
};
module.exports = {
  getpost,
  getposts,
  createpost,
  updatepost,
  deletepost,
  likepost,
  getsearchposts,
  create_comment,
  bulkUpload,
  csvUpload
};


