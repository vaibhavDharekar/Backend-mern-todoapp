const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,"Adding Email is required"],
        unique: true,
    },
    password:{
        type: String,
        required: [true,"Adding password is required"]
    },
    firstName:{
        type: String,
        required: [true,"Adding first name is required"]
    },
    lastName:{
        type: String,
        required: [true,"Adding last name is required"]
    }
})
const User_ = mongoose.model('User_', userSchema);

module.exports = User_;