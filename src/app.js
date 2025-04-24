const express =  require('express');
const app = express();
const  { adminAuth }= require('./middleware/adminAuth.js');
const { userAuth } = require('./middleware/userAuth.js');


app.use('/admin', adminAuth)

app.get("/admin/getAllData",(req,res,next) => {
    console.log("Admin getAllData Request 1st");
    next();
},(req,res) =>{
    console.log('Admin getAllData Request 2nd');
    res.send('Admin getAllData Request 2nd !!!!!!!!!!!');
})

app.get("/user/login",(req,res,next) => {
    console.log("/user/login is called 1st");
    res.send('/user/login is called 1st !!!!!!!!!!!');
})

app.get("/user/getAllData", userAuth, (req,res,next) => {
    console.log("Get user getAllData Request 1st");
    next();
}, (req, res) => {
    console.log('Get user getAllData Request 2nd');
    res.send('Get user getAllData Request 2nd !!!!!!!!!!!');
})


// app.post("/user",(req,res) => {
//     res.send('Post user Request! !!!!!!!!!!!');
// })

// app.delete("/user",(req,res) => {
//     res.send('Delete user Request! !!!!!!!!!!!');
// })

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});