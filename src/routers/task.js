const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const task = Task.findById(_id)

    if (!task) {
      return res.status(400).send({ error: 'Task not found' })
    }

    res.send(task)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValid = updates.every((update) => allowedUpdates.includes(update))

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid field to update' })
  }

  try {
    const task = await Task.findById(_id)

    updates.forEach((field) => task[field] = req.body[field])

    await task.save()

    if (!task) {
      return res.status(400).send({ error: 'Task not found' })
    }

    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const task = await Task.findByIdAndDelete(_id)

    if (!task) {
      return res.status(400).send({ error: 'Task not found' })
    }

    res.send(task)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = router
