const jwt = require('jsonwebtoken'); // import the jsonwebtoken library
const User = require('../models/user'); // import the User model

const cookieParser = require('cookie-parser'); // import the cookie-parser middleware

const userAuth = async (req, res, next) => {
    const { token } = req.cookies; // get the token from the cookies
    if (!token) {
        return res.status(401).send('Unauthorized'); // send a 401 Unauthorized response if the token is not present
    }
    try{
        var decoded = await jwt.verify(token, 'DevTinder@123');
        console.log("Decoded token:", decoded);
        const user = await User.findById(decoded._id); // find the user by ID
        console.log("User found:", user);
        
        if (!user) {
            return res.status(404).send('User not found'); // send a 404 Not Found response if the user is not found
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).send('Unauthorized');
    }
    
};

module.exports = { userAuth };
// Compare this snippet from src/app.js: