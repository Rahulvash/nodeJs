const express =  require('express');
const app = express();
const  { adminAuth }= require('./middleware/adminAuth.js');
const { userAuth } = require('./middleware/userAuth.js');
const connectDB = require('./config/database.js');

const User = require('./models/user.js');

app.use(express.json()); // Middleware to parse JSON request bodies

connectDB().then(() => {
    console.log('MongoDB cluster connected successfully');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('MongoDB cluster connection error:', err);
});


app.post("/signup",async (req, res) => {
    // get the user data from the request body
   
    try {
        const user = new User(req.body); // create a new user instance with the userObject1 data
        // Check if any of the allowed fields are present in the request body
        
        await user.save(); // save the user instance to the database
        console.log('User saved successfully:', user);
        res.send('Signup successful');
    } catch (error) {
        console.log("Error saving user:", error);
        res.status(400).send(`Error saving user: ${error.message}`); // send a 400 Bad Request response if there was an error saving the user
    }
});


app.delete("/delete",async (req, res) => {
    const userID = req.body.userID; // get the user ID from the request body
    try{
        const deletedUser = await User.findByIdAndDelete(userID); // find the user by ID and delete it
        if (deletedUser) {
            res.send('User deleted successfully'); // send a success response if the user was deleted
        } else {
            res.status(404).send('User not found'); // send a 404 Not Found response if the user was not found
        }
    } catch (error) {
        console.log("Error deleting user:", error);
        res.status(500).send('Error deleting user'); // send a 500 Internal Server Error response if there was an error deleting the user
    }
})

// Updating user data with findOneAndUpdate
// app.patch("/update",async (req, res) => {
//     const emailId = req.body.emailId; // get the email ID from the request body
//     try{
//         const updatedUser = await User.findOneAndUpdate({email : emailId}, req.body, { new: true }); // find the user by email and update it with the new data
//         if(updatedUser){
//             res.send("Email: User updated successfully"); // send a success response if the user was updated
//         }
//         else{
//             res.status(404).send("Email: User not found"); // send a 404 Not Found response if the user was not found
//         }
//     }
//     catch (error) {
//         res.status(500).send('Email: Error updating user'); // send a 500 Internal Server Error response if there was an error updating the user
//         console.log("Error updating user:", error);
//     }

// })

app.patch("/update",async (req,res) =>{
    
    const data = req.body; // get the user data from the request body
    try{
        const changed_Allowed_Fields = ["firstName", "lastName", "password", "phoneNumber", "age"];

        const hasAllowedField = changed_Allowed_Fields.some(item => Object.keys(data).includes(item));
        if (!hasAllowedField) {
            throw new Error('Invalid fields in request body'); // throw an error if no allowed fields are present
        
        }
        const updatedUser = await User.findByIdAndUpdate(data.userID,data,{ lean: true, runValidators: true} ); // find the user by ID and update it with the new data
        console.log("Updated user:", updatedUser);
        
        if(updatedUser){
            res.send('User updated successfully'); // send a success response if the user was updated
        }
        else{
            res.status(404).send("User not found")
        }
    }
    catch (error) {
        res.status(500).send('Error updating user: ' + error.message); // send a 500 Internal Server Error response if there was an error updating the user
        console.log("Error updating user:", error);
    }
})



//

// sending all the users data
app.get("/feed",async (req, res) => {
    try {
        const data = await User.find({}); // find all users in the database
        res.send(data) // send the user data as a JSON response with a 200 OK status
    }
    catch (error) {
        console.log("Error fetching users:", error);
        res.status(500).send('Error fetching users'); // send a 500 Internal Server Error response if there was an error fetching the users
    }
    
})
