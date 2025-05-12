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
    // const userObject1 = {
    //     firstName : "Ram Ram",
    //     lastName : "Ram Ram",
    //     userName : "ramSharma",
    //     email : "ram@ram.com",
    //     password : "ramRam",
    //     phoneNumber : "9999999999",
    //     age : 20,
    //     gender: "Male"
    // }

    // const userObject2 = {
    //     firstName : req.body.firstName,
    //     lastName : req.body.lastName,
    //     userName : req.body.userName,
    //     email : req.body.email,
    //     password : req.body.password,
    //     phoneNumber : req.body.phoneNumber,
    //     age : req.body.age,
    //     gender: req.body.gender
    // }
    
   
    try {
        const user = new User(req.body); // create a new user instance with the userObject1 data
        await user.save(); // save the user instance to the database
        console.log('User saved successfully:', user);
        res.send('Signup successful');
    } catch (error) {
        console.log("Error saving user:", error);
        res.status(400).send('Error saving user'); // send a 400 Bad Request response if there was an error saving the user
    }
});

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
