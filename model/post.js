import mongoose from './index';

const ObjectId = mongoose.Schema.Types.ObjectId; // 特殊类型
const postSchema = new mongoose.Schema({
    uid: { // 帖子发布人
        type: ObjectId,
        required: true
    },
    theme: { // 主题
        type: String,
        required: true
    },
    content: { // 内容，富文本
        type: String,
        required: true
    },
    cre_time: { // 时间，默认当前时间
        type: Date,
        default: Date.now
    },
    like_list: [ObjectId], // 点赞的有哪些 id 角色
});

const Post = mongoose.model('Post', postSchema);

export default Post;