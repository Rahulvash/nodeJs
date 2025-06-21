const express =  require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/userAuth.js');
profileRouter.get("/profile", userAuth ,async (req, res) => {
    // const userID = req.query.userID; // get the user ID from the query parameters
    try {
        const user = req.user;
        if (user) {
            res.send(user); // send the user data as a JSON response with a 200 OK status
        } else {
            res.status(404).send('User not found'); // send a 404 Not Found response if the user was not found
        }
    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).send('Error fetching user'); // send a 500 Internal Server Error response if there was an error fetching the user
    }
})

module.exports = profileRouter;