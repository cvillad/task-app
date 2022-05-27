const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await  User.findById(_id);

        if (!user) {
            return res.status(400).send( { error: "User not found" } );
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => allowedUpdates.includes(update));

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid field to update' });
    }

    try {
        const user = await User.findById(_id);

        updates.forEach((field) => user[field] = req.body[field]);

        await user.save();

        if (!user) {
            return res.status(400).send( { error: "User not found" } );
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(_id);

        if (!user) {
            return res.status(400).send( { error: "User not found" } );
        }

        res.send(user);
    } catch (error) {
        res.status(400).send(error)
    }
});

module.exports = router;