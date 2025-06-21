const express =  require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middleware/userAuth.js');

requestRouter.post("/sendRequest",userAuth , (req,res) => {
    const user = req.user;
    try{
        if(user){
        res.send("sending request...");
    }
        else{
            res.status(404).send("user not found");       
        }
    }
    catch{
        console.log("Error while hitting sendRequest api");
        res.status(500).send('Error fetching user');
    }
    
})

module.exports = requestRouter