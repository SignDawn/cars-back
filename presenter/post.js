import Post from '../model/post';
import {
    getUserInfoById
} from './user';

/**
 * 查询帖子，根据主题吗模糊查询
 * @param {String} theme 主题名
 * @param {Number} page 
 * @param {Number} pageSize 
 */
export async function getPosts(theme, page, pageSize) {
    let params;
    if (theme) {
        params = {
            theme: {
                $regex: theme
            }
        }
    }
    const total = await Post.find(params).count(); // 先计算数量
    // 计算结果
    const table = await Car.find(params)
        .skip((page - 1) * pageSize).limit(pageSize);
    // 1. 每个帖子发帖人的基本信息
    table.forEach(async item => {
        const poster = await getUserInfoById(item.uid);
        item.poster = poster;
        item.content = null; // 查询多条，减少返回具体内容
        // 根据点赞的人们的 id ，想要获取他们的名字
        item.like_list = item.like_list.map(async uid => {
            // TODO: 如此的查询效率可能较低，考虑更改
            const user = await getUserInfoById(uid);
            return {
                uid,
                username: user.username
            };
        });
    });
    return {
        total,
        table
    };
}
/**
 * 查询帖子具体内容
 * @param {String} pid 帖子主键 id
 */
export async function getPostById(pid) {
    const post = await Post.findById(pid);
    post.poster = await getUserInfoById(post.uid);
    post.like_list = post.like_list.map(async uid => {
        // TODO: 如此的查询效率可能较低，考虑更改
        const user = await getUserInfoById(uid);
        return {
            uid,
            username: user.username
        };
    });
    return post;
}

/**
 * 收藏帖子
 * @param {String} id 用户id
 * @param {String} pid 帖子 id
 */
export async function collectPost(id, pid) {
    const user = await User.findById(id);
    const collection_info = user.collection_info;
    collection_info.push({
        pid
    });
    await User.findByIdAndUpdate(id, {
        collection_info
    });
}

/**
 * 发帖子
 * @param {Stirng} uid 发帖人
 * @param {Stirng} theme 主题
 * @param {Stirng} content 内容
 */
export async function createPost(uid, theme, content) {
    const post = new Post({
        uid,
        theme,
        content,
        cre_time: Date.now()
    });
    await post.save();
}

/**
 * 判断该帖子是否是这个人的
 * @param {String} uid 用户 id
 * @param {String} pid 帖子 id
 * @returns {Promise<Boolean>}
 */
export async function isHisPost(uid, pid) {
    const post = await Post.findById(pid);
    // TODO: 可能需要类型转换
    return uid === post.uid;
}


/**
 * 删除帖子
 * @param {String} pid 帖子 id
 */
export async function delPost(pid) {
    await Post.findByIdAndRemove(pid);
}