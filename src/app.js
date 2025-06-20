const express =  require('express');
const app = express();
const  { adminAuth }= require('./middleware/adminAuth.js');
const { userAuth } = require('./middleware/userAuth.js');
const connectDB = require('./config/database.js');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');

const { validateSignUp } = require('./utils/validatorSignUp.js');

const User = require('./models/user.js');

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser())

connectDB().then(() => {
    console.log('MongoDB cluster connected successfully');
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    });
}).catch((err) => {
    console.error('MongoDB cluster connection error:', err);
});


app.post("/signup",userAuth,async (req, res) => {
    // get the user data from the request body
    // validate the user data using the validatorSignUp utility
    try{
        validateSignUp(req); // this function should validate the request body and throw an error if validation fails
    }
    catch (error) {
        console.log("Validation error:", error);
        return res.status(400).send(`From validatorSignUp.js: Validation error: ${error.message}`); // send a 400 Bad Request response if validation fails
    }

    const {password , age, firstName, lastName, userName, email, phoneNumber ,gender} = req.body; // destructure the request body to get the user data excluding the password
    const hassPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password:", hassPassword);
    

    try {
        console.log("Creating new user with data:");
        
        const user = new User({
            age,
            firstName,
            lastName,
            userName,
            email,
            password: hassPassword, // hash the password before saving it to the databas
            phoneNumber,
            userName,
            gender
        }); // create a new user instance with the userObject1 data
        // Check if any of the allowed fields are present in the request body
        
        await user.save(); // save the user instance to the database
        console.log('User saved successfully:', user);
        res.send('Signup successful');
    } catch (error) {
        console.log("Error saving user:", error);
        res.status(400).send(`Error saving user: ${error.message}`); // send a 400 Bad Request response if there was an error saving the user
    }
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

app.post("/login", async (req, res) => {
    const { email, password } = req.body; // get the email and password from the request body
    try{
        if(!email || !password) {
            throw new Error("Email is required"); // throw an error if email is not provided
        }
        const user = await User.findOne({email});
        if(!user) {
            throw new Error("Invalid Credentials"); // throw an error if user is not found
        }
        const isMatch =  bcrypt.compare(password, user.password);
        if(!isMatch) {
            throw new Error("Invalid Credentials"); // throw an error if password does not match
        }else{
            var token = jwt.sign({ _id: user._id }, "DevTinder@123", { expiresIn: '1d' }); // generate a token with the user ID and a secret key, set to expire in 1 day
            console.log("Token generated:", token)
            res.cookie('token', token, {
                secure: process.env.NODE_ENV === 'production', // set the cookie to be secure in production
                maxAge: 24 * 60 * 60 * 1000 // set the cookie to expire in 1 day
            });
            res.send('Login successful'); // send a success response if login is successful
        }
    }
    catch (error) {
            console.log("Error saving user:", error);
            res.status(400).send(`Error saving user: ${error.message}`); // send a 400 Bad Request response if there was an error saving the user
        }
})

app.get("/profile", userAuth ,async (req, res) => {
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
