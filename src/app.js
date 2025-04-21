const express =  require('express');
const app = express();


app.get("/",(req,res) => {
    res.send('I am on homepage!');
    console.log('Request received');
})

app.get("/about",(req,res) => {
    res.send('I am on about page! !!!!!!!!!!!');
})

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});