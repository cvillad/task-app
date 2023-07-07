const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.send({
      success: true,
      data: { token }
    })
  } catch (error) {
    res.status(422).send({
      success: false,
      error: error.message
    })
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ success: true, data: { token } })
  } catch (error) {
    res.status(422).send({
      success: false,
      error: error.message
    })
  }
})

router.get('/users/me', auth, async (req, res) => {
  try {
    res.send({ success: true, data: req.user })
  } catch (error) {
    res.status(422).send({
      success: false,
      error: error.message
    })
  }
})

router.get('/users/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findById(_id)

    if (!user) {
      return res.status(422).send({ success: false, error: 'User not found' })
    }

    res.send({ success: true, data: { user } })
  } catch (error) {
    res.status(422).send({ success: false, error: error.message })
  }
})

router.patch('/users/:id', auth, async (req, res) => {
  const _id = req.params.id

  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValid = updates.every((update) => allowedUpdates.includes(update))

  if (!isValid) {
    return res.status(422).send({ error: 'Invalid field to update' })
  }

  try {
    const user = await User.findById(_id)

    updates.forEach((field) => user[field] = req.body[field])

    await user.save()

    if (!user) {
      return res.status(422).send({ success: true, error: 'User not found' })
    }

    res.send({ success: true, data: { user } })
  } catch (error) {
    res.status(422).send({
      success: false,
      error: error.message
    })
  }
})

router.delete('/users/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findByIdAndDelete(_id)

    if (!user) {
      return res.status(422).send({ success: false, error: 'User not found' })
    }

    res.send({ success: true })
  } catch (error) {
    res.status(422).send({
      success: false,
      error: error.message
    })
  }
})

module.exports = router
