// middleware function for /admin route
const adminAuth = (req,res,next) => {
    let authToken = req.headers['authorization'];
    let validToken = '1234567890';
    if(!(authToken === validToken)){
        console.log('No Token Provided for adminAuth');
        return res.status(401).send('Unauthorized: No Token Provided');
    }
    next();
}

module.exports = { adminAuth };