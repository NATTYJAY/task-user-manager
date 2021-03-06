if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[]
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id', // This is the name the local data is stored. This is the user ID
    foreignField: 'owner' // This is the name of the field (Task). 
})

/** Static function to find the credentials by the email and password */
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

/** Clean out response data, that we dont need */
userSchema.methods.getUserProfile = async function (){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id}, 'myKey')
    user.tokens = user.tokens.concat({
        token:token
    })
    await user.save()
    localStorage.setItem("myToken", token);
    return token;
}
// Before the user is save, hash the plain text password
userSchema.pre('save', async function(next){
    const user = this;
        if(user.isModified('password')){
            user.password = await bcrypt.hash(user.password, 8);
        }
    next();
})


const User = mongoose.model('User',userSchema)

module.exports = User