import mongoose from './index';

const ObjectId = mongoose.Schema.Types.ObjectId; // 特殊类型
const likeSchema = new mongoose.Schema({ // 点赞信息，只允许汽车、评论被点赞，但点赞汽车不会通知到个人
    pid: ObjectId,
    uid: ObjectId,
    time: {
        type: Date,
        default: Date.now,
    },
    isLook: Boolean, // 是否已经查看过了
});

const commentSchema = new mongoose.Schema({
    // 评论信息
    // 1. 评论汽车不会有人收到通知
    // 2. 评论帖子，有人会收到通知
    // 3. 评论评论，即回复某人时，且该评论在汽车下，这样就会用到 cid
    pid: ObjectId,
    cid: String,
    uid: ObjectId,
    describe: String,
    comment_time: {
        type: Date,
        default: Date.now,
    },
    isLook: Boolean, // 是否已经查看过了
});

const collectionSchema = new mongoose.Schema({
    pid: ObjectId,
    cid: String,
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    reg_time: {
        type: Date,
        default: Date.now
    },
    sex: {
        type: String,
        default: '男',
        enum: ['男', '女']
    },
    avater: String, // 头像
    describe: String,
    location: {
        country: String,
        province: String,
        city: String,
    },
    like_message: [ // 点赞信息
        likeSchema
    ],
    comment_message: [ // 评论信息
        commentSchema,
    ],
    collection_info: [ // 收藏信息
        collectionSchema,
    ]

});

const User = mongoose.model('User', userSchema);

module.exports = User;