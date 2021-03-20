var express = require('express');
var router = express.Router();
import {
    isAgainUserName,
    registerUser,
    loginChecked,
    changeBaseInfo
} from '../presenter/user';

// 注册
router.post('/register', async function (req, res, next) {
    // 1. 获取参数
    console.log(req.body);
    const params = req.body;
    // 2. 查询昵称 username 与数据库中值是否重复
    if (await isAgainUserName(params.username)) {
        res.json({
            code: 'error',
            message: '昵称重复',
        })
        return;
    }
    // 3. 把该账号存入库中
    const user = await registerUser(params.username, params.password);
    if (!user.username) { // 说明是 error 对象
        res.json({
            code: 'error',
            message: '注册失败，请稍后重试',
        })
        return;
    }
    user.password = undefined; // 避免 session 与 返回数据中存储密码
    // 4. 注册成功，配置 session，意思说新注册的账号，第一次无需登陆
    req.session.user = user;
    res.json({
        code: 'ok',
        message: '注册成功',
        data: user, // 配置给前端，让其方便操作
    })
});

// 登陆
router.post('/login', async function (req, res, next) {
    // 1. 获取参数
    console.log(req.body);
    const params = req.body;
    // 2. 查询是否存在账号密码与库中相同的
    const user = await loginChecked(params.username, params.password);
    if (!user) {
        // 没找到对应的人
        return res.json({
            code: 'error',
            message: '账号或密码错误',
        });
    }
    // 3. 允许登陆，配置 session
    user.password = undefined;
    req.session.user = user;
    res.json({
        code: 'ok',
        message: '登陆成功',
        data: user, // 配置给前端，让其方便操作
    })
});


// 修改登陆信息
router.post('/info', async function (req, res, next) {
    // 1. 获取参数
    console.log(req.body);
    const params = req.body;
    // 2. 通过前端 cookie seesion，判断 是谁
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 更改对应 user 的基本信息
    const info = await changeBaseInfo(user._id, params);
    console.log(info);
    res.send('love')
});


module.exports = router;