const analyticsModel = require("../models/analytic_model");
//helper functions

async function updateAnalytics(postId, action, u_id = null) {
    const update = {};

    if (action === "like") {
        if (!u_id) throw new Error("p_id is required for likes");

        // Add a like with the p_id and current timestamp
        update.$push = { likes: { u_id, time: new Date() } };
    } else if (action === "unlike") {
        if (!u_id) throw new Error("p_id is required for unlikes");

        // Remove the specific like matching the p_id
        update.$pull = { likes: { u_id } };
    } else if (action === "download") {
        update.$push = { downloads: new Date() }; // Add current timestamp to downloads array
    } else {
        throw new Error("Invalid action type");
    }

    // Upsert the analytics document for the post
    await analyticsModel.findOneAndUpdate(
        { postId },
        update,
        { upsert: true, new: true }
    );
}



// Helper function to get date for 7 and 30 days ago
function getPastDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}

// Controller to get the most liked and downloaded posts for a specific timeframe

  module.exports={updateAnalytics,getPastDate}