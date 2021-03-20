import User from '../model/user';

/**
 * 查看用户名是否重复
 * @param {String} username 
 * @returns {Promise<Boolean>}
 */
export async function isAgainUserName(username) {
    const data = await User.findOne({
        username
    });
    if (data) { // 不为空，说明已经存在该昵称了
        return true;
    }
    return false;
}

/**
 * 注册用户，库中插入一条
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<any>}
 */
export async function registerUser(username, password) {
    const user = new User({
        username,
        password
    });
    return await user.save(); // 保存
}
/**
 * 检查库中是否有该条数据
 * @param {string} username 
 * @param {string} password 
 */
export async function loginChecked(username, password) {
    const data = await User.findOne({
        username,
        password
    });
    return data; // 查到数据就允许登陆
}

/**
 * 修改个人信息
 * @param {String} id 用户主键
 * @param {Object} params 参数
 */
export async function changeBaseInfo(id, params) {
    let sex, avater, describe, location;
    if (params.sex) {
        sex = params.sex;
    }
    await User.findByIdAndUpdate(id, {
        av
    });
}