import Car from '../model/car';
import Comment from '../model/comment';
import Post from '../model/post';
import User from '../model/user';
import {
    getUserInfoById
} from './user';

/**
 * 发布评论
 * @param {String} pid 
 * @param {String} cid 
 * @param {String} uid 
 * @param {String} describe 
 * @param {String} answer_uid 
 */
export async function postComment(pid, cid, uid, describe, answer_uid) {
    const comment = new Comment({ // TODO: 时间可以不进行传递
        pid,
        cid,
        uid,
        describe,
        answer_uid
    });
    const ret = await comment.save();
    return ret.comment_time;
}

/**
 * 通知这个帖子的发帖人，有人评价它了
 * @param {String} pid 
 * @param {String} uid 
 * @param {String} describe 
 * @param {Date} comment_time 
 */
export async function noticePoster(pid, uid, describe, comment_time) {
    // 去查该帖子的发帖人
    const post = await Post.findById(pid);
    // 发帖人
    const poster = await getUserInfoById(post.uid);
    // 更新发帖人的 comment_message 
    const comment_message = poster.comment_message;
    comment_message.push({
        pid,
        uid,
        describe,
        comment_time,
        isLook: false, // 未查看
    });
    await User.findByIdAndUpdate(post.uid, {
        comment_message
    });
}

/**
 * 通知我需要答复的人
 * @param {String} pid 帖子 id
 * @param {String} cid 汽车 id 两个只有一个存在
 * @param {String} uid 
 * @param {String} describe 
 * @param {String} answer_uid 答复给谁
 * @param {String} comment_time 时间
 */
export async function noticeOther(pid, cid, uid, describe, answer_uid, comment_time) {
    const user = await getUserInfoById(answer_uid);
    const comment_message = user.comment_message;
    comment_message.push({
        pid,
        cid,
        uid,
        describe,
        comment_time,
        isLook: false, // 未查看
    });
    await User.findByIdAndUpdate(answer_uid, {
        comment_message
    });
}

/**
 * 对该汽车进行点赞
 * @param {String} cid 汽车 id
 * @param {String} uid 用户 id
 */
export async function likeCar(cid, uid) {
    const car = await Car.findOne({
        "specificCars.detailId": cid
    });
    const specificCar = car.specificCars.find(item => item.detailId === cid);
    specificCar.like_list.push(uid);
    await Car.findOneAndUpdate({
        "specificCars.detailId": cid
    }, {
        specificCar
    });
}
/**
 * 对该帖子进行点赞
 * @param {String} pid 帖子 Id
 * @param {String} uid 用户id
 */
export async function likePost(pid, uid) {
    const post = await Post.findById(pid);
    const like_list = post.like_list;
    like_list.push(uid);
    await Post.findByIdAndUpdate(pid, {
        like_list
    })
}
/**
 * 通知该帖子的发帖人，谁给他点赞了
 * @param {String} pid 帖子 Id
 * @param {String} uid 用户id
 */
export async function noticePosterLike(pid, uid) {
    const post = await Post.findById(pid);
    const poster = await getUserInfoById(post.uid);
    const like_message = poster.like_message;
    like_message.push({
        pid,
        uid,
        time: Date.now(),
        isLook: false
    });
    await User.findByIdAndUpdate(poster.uid, {
        like_message
    });
}

/**
 * 查询该汽车的评论
 * @param {String} cid 汽车 id
 * @param {String} pid 帖子 id
 * @param {Number} page 页码
 * @param {Number} pageSize 页数
 */
export async function getComment(cid, pid, page, pageSize) {
    let params;
    if (cid) {
        params = {
            cid
        }
    }
    if (pid) {
        params = {
            pid
        }
    }
    const total = await Comment.find(params).count(); // 先计算数量
    // 计算结果
    const table = await Comment.find(params)
        .skip((page - 1) * pageSize).limit(pageSize);
    table.forEach(async comment => {
        const commentUser = await getUserInfoById(comment.uid)
        comment.commentUser = commentUser; // 评论人基本信息
        if (comment.answer_uid) {
            // 存在回复人，查出回复人的详细信息
            const answerUser = await getUserInfoById(comment.answer_uid);
            comment.answerUser = answerUser;
        }
    });
    return {
        total,
        table,
    };
}