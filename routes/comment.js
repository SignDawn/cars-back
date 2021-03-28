var express = require('express');
var router = express.Router();
import {
    postComment,
    noticePoster,
    noticeOther,
    likeCar,
    likePost,
    noticePosterLike,
    getComment
} from '../presenter/comment';

// 评论
router.post('/create', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.body);
    const body = req.body;
    // 2. 获取 session 当前登录人
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 要评论的是汽车还是帖子
    if (!body.cid && !body.pid) {
        // 两个都不存在
        return res.json({
            code: 'error',
            message: '你要评价什么？',
        });
    }
    if (body.cid && body.pid) {
        // 都存在
        return res.json({
            code: 'error',
            message: '你要评价什么？',
        });
    }
    // 两者只存在其一
    const comment_time = await postComment(body.pid, body.cid, user._id, body.describe, body.answer_uid);
    // 后续操作
    // 1. 若是帖子，通知发帖人，他的帖子被评论了
    if (body.pid) {
        await noticePoster(body.pid, user._id, body.describe, comment_time);
    }
    // 2. 若是汽车，不需要通知别人
    // 3. 若是评论，即 answer_uid 不为空，还需通知这个人
    if (body.answer_uid) {
        await noticeOther(body.pid, body.cid, user._id, body.describe, body.answer_uid, comment_time);
    }
    res.json({
        code: 'ok',
        message: '评论成功',
    });
});

// 点赞
router.post('/like', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.body);
    const body = req.body;
    // 2. 获取 session 当前登录人
    const user = req.session.user;
    if (!user) {
        return res.json({
            code: 'error',
            message: '请先登陆',
        });
    }
    // 3. 要点赞的是汽车还是帖子
    if (!body.cid && !body.pid) {
        // 两个都不存在
        return res.json({
            code: 'error',
            message: '你要点赞什么？',
        });
    }
    if (body.cid && body.pid) {
        // 都存在
        return res.json({
            code: 'error',
            message: '你要点赞什么？',
        });
    }
    // 判断类型
    // 1. 是对车子进行点赞
    if (body.cid) { // 这里不需要时间
        await likeCar(body.cid, user._id);
        // 不需要通知
    }
    // 2. 对帖子进行点赞
    if (body.pid) {
        await likePost(body.pid, user._id);
        // 点赞后需要通知发帖人，有人点赞了
        await noticePosterLike(body.pid, user._id);
    }
    res.json({
        code: 'ok',
        message: '点赞成功',
    });
})

// 获取评论内容
router.get('/query', async function (req, res, next) {
    // 1. 拿到参数
    console.log(req.query);
    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    const pid = req.query.pid;
    const cid = req.query.cid;
    page = !page ? 1 : page; // 为空就设置默认值1
    pageSize = !pageSize ? 10 : pageSize; // 为空就设置10
    // 2. 要查询的是汽车还是帖子
    if (!pid && !cid) {
        // 两个都不存在
        return res.json({
            code: 'error',
            message: '你要点赞什么？',
        });
    }
    if (cid && pid) {
        // 都存在
        return res.json({
            code: 'error',
            message: '你要点赞什么？',
        });
    }
    // 3. 查询
    const {
        total,
        table
    } = await getComment(cid, pid, page, pageSize);
    res.json({
        code: 'ok',
        total,
        table
    });
});


module.exports = router;