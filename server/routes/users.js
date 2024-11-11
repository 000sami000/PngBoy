const express =require('express');
const router=express.Router();

const {signin,signup,getuser,updateuser,getgallery, addDownload, getDownload,deleteDownloads,downloadPostsInBulk, singleDownload,

    getTopPostsSevenDays,
    getTopPostsThirtyDays
}=require('../controllers/users');
const auth = require('../middleware/auth');
const upload=require('../config/multerconfig');

router.post('/signin',signin)
router.post('/signup',signup)
router.get('/',auth,getuser)
router.get('/usergallery',auth,getgallery)
router.post('/adddownload',auth,addDownload)
router.get('/download',auth,getDownload)
router.delete('/download:id',auth,deleteDownloads)
router.get('/downloadbulk',auth,downloadPostsInBulk)
router.get('/singledownload',auth,singleDownload)
router.get('/getTopPostsSevenDays',auth,getTopPostsSevenDays)
router.get('/getTopPostsThirtyDays',auth,getTopPostsThirtyDays)
router.patch('/',auth,upload.single('file'),updateuser)
module.exports=router;