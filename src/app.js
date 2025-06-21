const express =  require('express');
const app = express();
const { userAuth } = require('./middleware/userAuth.js');
const connectDB = require('./config/database.js');
var cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth.js');
const profileRouter =  require('./routers/profile.js');
const requestRouter = require('./routers/request.js');

const User = require('./models/user.js');

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter)

connectDB().then(() => {
    console.log('MongoDB cluster connected successfully');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('MongoDB cluster connection error:', err);
});






app.delete("/delete",userAuth, async (req, res) => {
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


app.patch("/update",userAuth,async (req,res) =>{
    
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
});



// sending all the users data
app.get("/feed",userAuth,async (req, res) => {
    
    try {
        const data = await User.find({}); // find all users in the database
        res.send(data) // send the user data as a JSON response with a 200 OK status
    }
    catch (error) {
        console.log("Error fetching users:", error);
        res.status(500).send('Error fetching users'); // send a 500 Internal Server Error response if there was an error fetching the users
    }
    
});




