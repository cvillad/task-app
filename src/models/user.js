const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        },
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes("password")){
                throw new Error('Password cannot contain "password"')
            }
        },
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,
        validate(value){
            if (value < 0){
                throw new Error('Age cannot be negative')
            }
        }
    }
});

userSchema.pre('save', async function (next) {      
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
