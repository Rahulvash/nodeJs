const express =  require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middleware/userAuth.js');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
profileRouter.get("/profile/view", userAuth ,async (req, res) => {
    // const userID = req.query.userID; // get the user ID from the query parameters
    try {
        const user = req.user;
        // console.log("Profile.tsx : user:", user);
        
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

profileRouter.patch("/profile/edit", userAuth ,async (req, res) => {
    // const userID = req.query.userID; // get the user ID from the query parameters
    try {
        const user = req.user;
        const editRequestObject = req.body;
        // console.log("Profile.tsx : editRequestObject:", editRequestObject);
        // console.log("Profile.tsx : user before if:", user);
        if (user) {
            // Check if the request object contains any allowed fields
            const allowedFields = ["firstName", "lastName", "phoneNumber", "age"];
            const hasAllowedField = allowedFields.some(item => Object.keys(editRequestObject).includes(item));
            if (!hasAllowedField) {
                return res.status(400).send('Invalid fields in request body'); // send a 400 Bad Request response if no allowed fields are present
            }
            // Update the user with the new data
            
            // console.log("Profile.tsx : User data before update:", user);
            Object.keys(req.body).forEach(key => (user[key] = req.body[key]));

            await user.save(); // save the updated user data to the database
            // console.log("Profile.tsx : User data after update:", user);
            res.json({message : `${user.firstName} ${user.lastName}'s profile updated successfully`, data : user}); // send a success response with the user's name
        } else {
            res.status(404).send('User not found'); // send a 404 Not Found response if the user was not found
        }
    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).send('Error fetching user'); // send a 500 Internal Server Error response if there was an error fetching the user
    }
})

profileRouter.patch("/profile/password", userAuth ,async (req, res) => {
   
    try {
        const user = req.user;
        const bodyObject = req.body;
        if (user) {
            // Check if the request object contains any allowed fields
            const allowedFields = ["password"];
            const hasAllowedField = allowedFields.some(item => Object.keys(bodyObject).includes(item));
            if (!hasAllowedField) {
                return res.status(400).send('Invalid fields in request body'); // send a 400 Bad Request response if no allowed fields are present
            }
            const hassPassword = await bcrypt.hash(bodyObject.password, 10);   
            user.password = hassPassword;
            await user.save(); // save the updated user data to the database
            // console.log("Profile.tsx : User data after update:", user);
            res.json({message : `${user.firstName} ${user.lastName}'s profile password successfully updated`, data : user}); // send a success response with the user's name
        } else {
            res.status(404).send('User not found'); // send a 404 Not Found response if the user was not found
        }
    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).send('Error fetching user'); // send a 500 Internal Server Error response if there was an error fetching the user
    }
})

module.exports = profileRouter;