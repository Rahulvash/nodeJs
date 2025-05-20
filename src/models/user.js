const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        validate(){
            if(this.age < 18 || this.age > 50){
                throw new Error("Age must be at least 18");
            }
        }   
    },
    gender: {
        type: String,
        required: true,
        enum : ["Male", "Female", "Other"]
    },
    aboutMe: {
        type: String,
        default : "Hello, I am a new user"
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;

