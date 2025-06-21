const express =  require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const User = require('../models/user'); 
const { validateSignUp } = require('../utils/validatorSignUp.js');


authRouter.post("/login", async (req, res) => {
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

authRouter.post("/signup",async (req, res) => {
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

module.exports = authRouter;
