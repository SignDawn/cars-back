var express = require('express');
var router = express.Router();

import {
    getPostById,
    getPosts,
    collectPost,
    createPost,
    isHisPost,
    delPost
} from '../presenter/post';

// 查询
router.get('/query', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.query);
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    const theme = req.query.theme;
    page = !page ? 1 : page; // 为空就设置默认值1
    pageSize = !pageSize ? 10 : pageSize; // 为空就设置10
    // 2. 查询
    // 模糊查询
    const {
        total,
        table
    } = await getPosts(theme, page, pageSize);
    res.json({
        code: 'ok',
        total,
        table
    });
})

// 查询单个
router.get('/one', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.query);
    const pid = req.query.pid;
    const post = await getPostById(pid);
    res.json({
        code: 'ok',
        data: post
    });
})

// 收藏帖子
router.post('/collection', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.query);
    const pid = req.query.pid;
    // 2. 获取 session 当前登录人
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 收藏对应 id 汽车
    await collectPost(user._id, pid);
    // 4. 重新配置 session
    const newUser = await getUserInfoById(user._id);
    req.session.user = newUser;
    res.json({
        code: 'ok',
        message: '收藏成功'
    })
});


// 发帖子
router.post('/create', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.body);
    const theme = req.body.theme;
    const content = req.body.content;
    // 2. 获取 session 当前登录人
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 内容判空
    if (!theme || !content) {
        return res.json({
            code: 'error',
            message: '主题和内容不可为空',
        });
    }
    // 4. 创建帖子
    await createPost(user._id, theme, content);
    res.json({
        code: 'ok',
        message: '发布成功'
    });
});

// 删帖
router.delete('/delete', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.query);
    const pid = req.query.pid;
    // 2. 获取 session 当前登录人
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 校验该帖子是不是这个人的
    if (!(await isHisPost(user._id, pid))) {
        // 不是它的
        return res.json({
            code: 'error',
            message: '不是你的帖子，你凭什么删？',
        });
    }
    // 4. 删帖
    await delPost(pid);
    res.json({
        code: 'ok',
        message: '删除成功'
    });
});

module.exports = router;