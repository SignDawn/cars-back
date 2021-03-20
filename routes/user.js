var express = require('express');
var router = express.Router();

// 注册
router.post('/register', function (req, res, next) {
    res.send('love');
});

module.exports = router;