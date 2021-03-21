var express = require('express');
var router = express.Router();

import {
    getCars,
    getCarByDetailId,
    collectCar
} from '../presenter/car.js';
import {
    getUserInfoById
} from '../presenter/user.js';

// 查询
router.get('/query', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.query);
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    const carName = req.query.carName;
    page = !page ? 1 : page; // 为空就设置默认值1
    pageSize = !pageSize ? 10 : pageSize; // 为空就设置10
    // 2. 查询
    // 模糊查询
    const {
        total,
        table
    } = await getCars(carName, page, pageSize);
    res.json({
        code: 'ok',
        total,
        table
    });
});

// 查询单个
router.get('/one', async function (req, res, next) {
    // 1. 获取参数
    const detailId = req.query.detailId;
    // 2. 查询
    const detailCar = await getCarByDetailId(detailId);
    res.json({
        code: 'ok',
        data: detailCar
    });
});

// 收藏汽车
router.post('/collection', async function (req, res, next) {
    // 1. 获取参数
    const detailId = req.query.detailId;
    // 2. 获取 session 当前登录人
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 收藏对应 id 汽车
    await collectCar(user._id, detailId);
    // 4. 重新配置 session
    const newUser = await getUserInfoById(user._id);
    req.session.user = newUser;
    res.json({
        code: 'ok',
        message: '收藏成功'
    })
});

module.exports = router;