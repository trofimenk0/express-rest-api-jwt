const router = require('express').Router();
const auth = require('../utils/verifyToken');

router.get('/', auth, async (req, res) => {
    res.send('Private posts route');
});

module.exports = router;