const router = require('express').Router();
// JWT
const jwt = require('jsonwebtoken');
// Models
const User = require('../models/User');
// Hash passwords
const bcrypt = require('bcryptjs');
// Validation
const { loginValidation, registerValidation } = require('../utils/validation');

// Endpoints
router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(...error.details);
    }

    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
        return res.status(409).send('User is already exist!');
    }

    // Hash passwords
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(...error.details);
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(409).send('User is not exist!');
    }

    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Invalid password!');
    }

    // Create and assign a token
    const token = jwt.sign(
        { _id: user._id },
        process.env.TOKEN_SECRET,
        { expiresIn: '1h' }
    );
    res.header('auth-token', token).send(token);
});

module.exports = router;