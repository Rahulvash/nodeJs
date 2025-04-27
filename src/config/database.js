const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://namasteDev:IW75lJfLlXmArYgS@namastedev.y9flkt1.mongodb.net/devTinder")
}
    
module.exports = connectDB;