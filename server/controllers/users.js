const bcrypt =require("bcrypt")
const jwt= require("jsonwebtoken");
const userModel= require("../models/user_model");
const postModel = require("../models/post_model");
const analyticsModel = require("../models/analytic_model");
const fs=require("fs")
const path=require("path")
const archiver = require('archiver');
const { updateAnalytics, getPastDate } = require("./helping_functions");

 const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const ispasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!ispasswordCorrect) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id,isadmin:existingUser.isadmin },
     process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
     existingUser.password=null;
    res.status(200).json({ user_:existingUser, token_: token });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
const signup = async (req, res) => {
  const { FirstName, SecondName, email, password, confirmpassword } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password did't match" });
    }
    const hashedpassword = await bcrypt.hash(password, 12);
    const new_user = await userModel.create({
      email,
      password: hashedpassword,
      name: `${FirstName} ${SecondName}`,
    });
    const token = jwt.sign(
      { email: new_user.email, id: new_user._id,isadmin:new_user.isadmin  },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    new_user.password=null;
    res.status(200).json({ user_: new_user, token_: token });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
const getuser=async (req,res)=>{

      try{
        console.log(req.userID)
        let user= await userModel.findById(req.userID);
        console.log(user)
        user.password=null;
          res.status(200).json(user)   
      }catch(err){
        res.status(400).json({message:err})
      }
}
const updateuser=async (req,res)=>{
  let {userID}=req;
  const userdata = req.body;
 
  try{
    let user= await userModel.findById(userID);
    user.email=userdata.email;
    user.name=`${userdata.FirstName} ${userdata.SecondName}`;
    const oldImage = user.profile_img_;
 
    if (req.file) {
      user.profile_img_ = `/uploads/${req.file.filename}`;
      await postModel.updateMany(
        { creator: userID },
        { $set: { name: user.name, creator_img: user.profile_img_ || "" } }
      );
      if (oldImage) {
        const filePath = path.join(__dirname, '../uploads', oldImage.split('/')[2]);
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('Old profile image deleted successfully');
          }
        });
      }
    } else {
      await postModel.updateMany({ creator: userID }, { $set: { name: user.name } });
    }
    let user_updated= await userModel.findByIdAndUpdate(userID,user,{new:true});
    user_updated.password=null;
      res.status(200).json( user_updated)   
  }catch(err){
    console.log(err)
    res.status(400).json({message:err})
  }
}
const getgallery =async(req,res)=>{
  
  const { page } = req.query;
  const {userID}=req;
  try {
    const LIMIT = 4;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await postModel.countDocuments({});

    const posts = await postModel
      .find({creator:userID},{title:1,file:1,likes:1,creator_img:1,creator:1,createdAt:1,name:1})
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res .status(200)
      .json({
        data: posts,
        currentPage: Number(page),
        numberofPages: Math.ceil(total / LIMIT),
        startIndex: startIndex,
      });

  } catch (err) {
    res.status(404).json({ error: err });
  }

}


const addDownload=async (req,res)=>{
  try{
    console.log(req.body,"dtata")
       
    await userModel.findByIdAndUpdate(
     req.userID,
     {
      $addToSet: {
          downloads:req.body.id // Adds only if `downloadItem` is not already in the array
      }
    },
      { new: true } // Return the updated document
  );
        res.status(200).json({success:true})
   }catch(err){
     console.log(err)
     res.status(404).json({ error: err });
   }
}

const getDownload=async (req,res)=>{
  try {
    

    // Find the user by ID and get the downloads array
    const userdownloads = await userModel.findById(req.userID).select('downloads');
    if (!userdownloads) {
        return res.status(404).json({ message: "User not found" });
    }
    console.log(userdownloads,"uouoiuo")

    // Use the IDs in the downloads array to fetch the posts
    const downloadedPosts = await postModel.find({ _id: { $in: userdownloads.downloads } });
     console.log(downloadedPosts,"uouoiuo")
    res.status(200).json(downloadedPosts);
} catch (error) {
    console.error("Error fetching downloaded posts:", error.message);
    res.status(500).json({ message: "Internal server error" });
}
}

const deleteDownloads = async (req, res) => {
  try {
      const post_id = req.params.id;
    
      // Remove the specified item from the downloads array
      const updatedUser = await userModel.findByIdAndUpdate(
          req.userID,
          { $pull: { downloads: post_id } },
          { new: true, select: 'downloads' } // Return the updated document with only downloads array
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      // Fetch posts based on the updated downloads array
      const remainingPosts = await postModel.find({ _id: { $in: updatedUser.downloads } });

      res.status(200).json(remainingPosts);
  } catch (error) {
      console.error("Error deleting download item and fetching posts:", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
};



const downloadPostsInBulk = async (req, res) => {
  try {
  

      // Find the user and get the download IDs
      const user = await userModel.findById(req.userID).select('downloads');
      if (!user || user.downloads.length === 0) {
          return res.status(404).json({ message: "No downloads available for this user." });
      }

      // Fetch the posts based on IDs in the downloads array
      const posts = await postModel.find({ _id: { $in: user.downloads } });

      // Create a temporary ZIP file
      const zipPath = path.join(__dirname, 'downloads.zip');
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
          // Send the ZIP file to the client
          res.download(zipPath, 'downloaded_posts.zip', (err) => {
              if (err) {
                  console.error("Error sending ZIP file:", err);
                  res.status(500).json({ message: "Error sending ZIP file" });
              }

              // Delete the ZIP file after sending it
              fs.unlinkSync(zipPath);
          });
      });

      archive.on('error', (err) => {
          throw err;
      });

      // Pipe the archive data to the output file
      archive.pipe(output);

      // Add each post's content to the archive (adjust depending on post content type)
      // posts.forEach((post) => {
      //     archive.append(JSON.stringify(post, null, 2), { name: `${post._id}_metadata.json` });
      // });
      posts.forEach((post) => {
        // Add post metadata as JSON
        // archive.append(JSON.stringify(post, null, 2), { name: `${post._id}_metadata.json` });

        // Check if a file exists for the post and add it to the ZIP
        if (post.file) {
            const filePath = path.join(__dirname,'../', post.file); // Adjust this path if needed
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: `${post._id}_${path.basename(post.file)}` });
            } else {
                console.warn(`File not found for post ${post._id}: ${filePath}`);
            }
        }
    });
      // Finalize the archive
      archive.finalize();
  } catch (error) {
      console.error("Error during bulk download:", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
};

const singleDownload=async(req, res) => {
  const filename = req.query.q;
  const p_id = req.query.p_id;
  const filePath = path.join(__dirname,'../', 'uploads', filename);
  console.log(filePath,"jlkjkljklkljkl--",p_id)
  
  await updateAnalytics(p_id,'download');

  res.download(filePath, filename, (err) => {
      if (err) {
          console.error("Error downloading file:", err);
          res.status(404).send("File not found");
      }
  });

}


const getTopPostsSevenDays = async (req, res) => {
  if(!req.isAdmin){
  
    return res.status(401).json({ message: 'unAuthorized Access' });
  }

  try {
      // Define timeframes
      const sevenDaysAgo = getPastDate(7);
    

      // Step 1: Query Analytics model to get top liked and downloaded postIds in the past 7 and 30 days
      const [mostLikedPostIdsWeek,  mostDownloadedPostIdsWeek] = await Promise.all([
          // Most liked post IDs in the past 7 days
          analyticsModel.aggregate([
              { $unwind: "$likes" },
              { $match: { "likes.time": { $gte: sevenDaysAgo } } },
              { $group: { _id: "$postId", likeCount: { $sum: 1 } } },
              { $sort: { likeCount: -1 } },
              { $limit: 15 },
              { $project: { _id: 1 } }
          ]),
    
          // Most downloaded post IDs in the past 7 days
          analyticsModel.aggregate([
              { $unwind: "$downloads" },
              { $match: { "downloads": { $gte: sevenDaysAgo } } },
              { $group: { _id: "$postId", downloadCount: { $sum: 1 } } },
              { $sort: { downloadCount: -1 } },
              { $limit: 15 },
              { $project: { _id: 1 } }
          ]),
      

      ]);
     
      const totallikedPostsWeek = await analyticsModel.aggregate([
        { $unwind: "$likes" },
        { $match: { "likes.time": { $gte: sevenDaysAgo } } },
        { $group: { _id: "$postId", likeCount: { $sum: 1 } } },
    ]);



    // Aggregate download counts in the past 7 and 30 days
    const totaldownloadedPostsWeek = await analyticsModel.aggregate([
        { $unwind: "$downloads" },
        { $match: { "downloads": { $gte: sevenDaysAgo } } },
        { $group: { _id: "$postId", downloadCount: { $sum: 1 } } },
    ]);

 
      // Extract only the postId values from the aggregation results
      const mostLikedPostIdsWeekArray = mostLikedPostIdsWeek.map(item => item._id);
    
      const mostDownloadedPostIdsWeekArray = mostDownloadedPostIdsWeek.map(item => item._id);

      // Step 2: Retrieve the full post details from the Post model
      const [mostLikedPostsWeek, mostDownloadedPostsWeek,uploadedPostsWeek] = await Promise.all([
        postModel.find({ _id: { $in: mostLikedPostIdsWeekArray } }),
   
        postModel.find({ _id: { $in: mostDownloadedPostIdsWeekArray } }),
        postModel.find({ createdAt: { $gte: sevenDaysAgo } }),
      
      ]);
      // Send the result to the client
      res.status(200).json({
          mostLikedPostsWeek,
          mostDownloadedPostsWeek,uploadedPostsWeek,totallikedPostsWeek,totaldownloadedPostsWeek
      });
  } catch (error) {
      console.error("Error fetching top  posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
const getTopPostsThirtyDays = async (req, res) => {
  if(!req.isAdmin){
    
    return res.status(401).json({ message: 'unAuthorized Access' });
  }
  try {
      // Define timeframes

      const thirtyDaysAgo = getPastDate(30);

      // Step 1: Query Analytics model to get top liked and downloaded postIds in the past 7 and 30 days
      const [ mostLikedPostIdsMonth, mostDownloadedPostIdsMonth] = await Promise.all([
    
          // Most liked post IDs in the past 30 days
          analyticsModel.aggregate([
              { $unwind: "$likes" },
              { $match: { "likes.time": { $gte: thirtyDaysAgo } } },
              { $group: { _id: "$postId", likeCount: { $sum: 1 } } },
              { $sort: { likeCount: -1 } },
              { $limit: 15 },
              { $project: { _id: 1 } }
          ]),
    
          // Most downloaded post IDs in the past 30 days
          analyticsModel.aggregate([
              { $unwind: "$downloads" },
              { $match: { "downloads": { $gte: thirtyDaysAgo } } },
              { $group: { _id: "$postId", downloadCount: { $sum: 1 } } },
              { $sort: { downloadCount: -1 } },
              { $limit: 15 },
              { $project: { _id: 1 } }
          ])
      ]);
       
      const totaldownloadedPostsMonth = await analyticsModel.aggregate([
        { $unwind: "$downloads" },
        { $match: { "downloads": { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$postId", downloadCount: { $sum: 1 } } },
    ]);

    const totallikedPostsMonth = await analyticsModel.aggregate([
      { $unwind: "$likes" },
      { $match: { "likes.time": { $gte: thirtyDaysAgo } } },
      { $group: { _id: "$postId", likeCount: { $sum: 1 } } },
  ]);
      // Extract only the postId values from the aggregation results
    
      const mostLikedPostIdsMonthArray = mostLikedPostIdsMonth.map(item => item._id);
   
      const mostDownloadedPostIdsMonthArray = mostDownloadedPostIdsMonth.map(item => item._id);

      // Step 2: Retrieve the full post details from the Post model
      const [ mostLikedPostsMonth, mostDownloadedPostsMonth,uploadedPostsMonth] = await Promise.all([
        postModel.find({ _id: { $in: mostLikedPostIdsMonthArray } }),

        postModel.find({ _id: { $in: mostDownloadedPostIdsMonthArray } }),

        postModel.find({ createdAt: { $gte: thirtyDaysAgo } })
      ]);

      // Send the result to the client
      res.status(200).json({
          mostLikedPostsMonth,
          mostDownloadedPostsMonth,uploadedPostsMonth,totaldownloadedPostsMonth,totallikedPostsMonth
      });
  } catch (error) {
      console.error("Error fetching top posts:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports={signin,
  signup,
  getuser,
  updateuser,
  getgallery,
  addDownload,
  getDownload,
  deleteDownloads,
  downloadPostsInBulk,
  singleDownload,
  getTopPostsSevenDays,
  getTopPostsThirtyDays
}