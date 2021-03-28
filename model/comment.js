import mongoose from './index';

const ObjectId = mongoose.Schema.Types.ObjectId; // 特殊类型
const commentSchema = new mongoose.Schema({
    pid: ObjectId,
    cid: String, // 汽车 id
    uid: {
        type: ObjectId,
        required: true
    },
    describe: {
        type: String,
        required: true
    },
    comment_time: {
        type: Date,
        default: Date.now
    },
    answer_uid: ObjectId, // 该评论的回复人，非必填
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;