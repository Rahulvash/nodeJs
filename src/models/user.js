const mongoose = require('mongoose');
const validator = require('validator');
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
        unique: true,
        validate(email){
            if(!validator.isEmail(email)){
                throw new Error("Invalid email format");
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(password) {
            if (!validator.isStrongPassword(password)) {
                throw new Error("Weak password - must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
            }
        }
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

