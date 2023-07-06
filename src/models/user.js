const bcrypt = require('bcryptjs/dist/bcrypt')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    },
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate (value) {
      if (value.toLowerCase().includes('password')) {
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
    validate (value) {
      if (value < 0) {
        throw new Error('Age cannot be negative')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, 'test-key')

  this.tokens = this.tokens.concat({ token })
  await this.save()

  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })

  if (!user) {
    throw new Error("User doesn't exists")
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    throw new Error('Credentials are wrong')
  }

  return user
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
