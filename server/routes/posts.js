const express =require('express');
const router=express.Router();
const {getpost,getsearchposts,getposts,createpost,updatepost,deletepost,likepost,create_comment,bulkUpload,csvUpload}=require('../controllers/posts')
const auth=require('../middleware/auth')
const upload=require('../config/multerconfig');
const csvupload=require('../config/csvupload');
const chk_csv = require('../middleware/chk_csv');
router.get('/',getposts);
router.get('/search',getsearchposts);
router.post('/',auth,upload.array('file', 10),createpost);
router.patch('/:id',auth,upload.single('file'),updatepost);
router.delete('/:id',auth,deletepost);
router.patch('/:id/likepost',auth,likepost);
router.get('/:id',getpost);
router.post(`/:post_id/comment`,auth,create_comment)
router.post(`/bulkupload`,auth,chk_csv,upload.array('file', 20),bulkUpload)
router.post(`/csvupload`,auth,csvupload.single('file'),csvUpload)
module.exports=router;