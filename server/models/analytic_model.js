const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'posts', // Reference to the posts collection
        required: true,
    },
    likes: {
        type: [{
            u_id:String,
            time:Date,
        }],
        default: [],
        _id: false, 
    },
    downloads: {
        type: [Date],
        default: [],
        _id: false, 
    }
    // timeFrame: {
    //     type: String,
    //     enum: ['weekly', 'monthly'], // To distinguish between time frames
    //     required: true,
    // },
  
},{ timestamps: true });

const analyticsModel = mongoose.model('analytics', analyticsSchema);

module.exports = analyticsModel;
