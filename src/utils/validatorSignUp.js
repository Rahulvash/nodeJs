const validator = require('validator');
 const validateSignUp = (req) => {
    const { firstName, lastName, email, password, age, phoneNumber, gender, userName } = req.body;
    if(!firstName || !lastName || !email || !password || !age || !phoneNumber || !gender || !userName) {
        throw new Error("All fields are required");
    }
    if(firstName.length < 3 || firstName.length > 20) {
        throw new Error("First name must be at least 3 characters long");
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid email format");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Weak password - must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
    }
    if(age < 18 || age > 50) {
        throw new Error("Age must be between 18 and 50");
    }
    if(!["Male", "Female", "Other"].includes(gender)) {
        throw new Error("Invalid gender");
    }
    if(validator.isMobilePhone(phoneNumber, ['en-IN'], { strictMode: false }) === false) {
        throw new Error("Invalid phone number format");
    }
}

module.exports = { validateSignUp };