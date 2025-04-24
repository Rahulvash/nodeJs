const userAuth = (req, res, next) => {
    let authToken = req.headers['authorization'];
    let validToken = 'abcd';
    if (!(authToken === validToken)) {
        console.log('No Token Provided for userAuth');
        return res.status(401).send('Unauthorized: No Token Provided');
    }
    next();
}

module.exports = { userAuth };
// Compare this snippet from src/app.js: