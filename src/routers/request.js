const express =  require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middleware/userAuth.js');
const User = require('../models/user.js');
const ConnectionModel = require('../models/connectionSchema.js')

requestRouter.post("/sendRequest/:status/:toUserId",userAuth , async (req,res) => {
    try{
        const user = req.user;
        const fromUserId = req.user._id;
        const {status , toUserId} = req.params;
        if(!user){
            res.status(404).send("user not found");  
        }
        const statusAllowedField = ["ignored","interested"];
        const allowedStatus = statusAllowedField.some((field) => field === status);
        const searchToUserID = await User.findById(toUserId);
        if(!allowedStatus){
            res.status(400).json({message : "Request Status is incorrect"});  
        }
        if(!searchToUserID){
            res.status(400).json({message : "User not existing"});  
        }

        console.log("fromUserId++",fromUserId);
        console.log("toUserId++"  ,toUserId);

        if (fromUserId.toString() === toUserId.toString()) {
            res.status(400).json({ message: "You aren't allowed to send a request to yourself" });
            console.log("IDs are equal");
        }

        const existingRequest = await ConnectionModel.findOne({
            $or : [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],
        });
        console.log("existingRequest++",existingRequest);
        

        if (existingRequest) {
            res.status(400).json({ message: "Request already sent" });
        }

        const connectionRequest = new ConnectionModel({
            fromUserId  : user._id,
            toUserId : toUserId,
            connectionType : status
        });

        await connectionRequest.save();
        
        res.json({message: "Request send"});
        
    }
    catch{
        console.log("Error while hitting sendRequest api");
        res.status(500).send('Error fetching user');
    }
    
})

module.exports = requestRouter