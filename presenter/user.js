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
    await User.findByIdAndUpdate(id, params);
}

/**
 * 通过 id 查询个人信息
 * @param {String} id 
 * @returns {Promise<any>}
 */
export async function getUserInfoById(id) {
    const user = await User.findById(id);
    user.password = undefined;
    return user;
}

/**
 * 通过 id 修改密码
 * @param {String} id 用户 id
 * @param {String} password 密码
 */
export async function changePassword(id, password) {
    await User.findByIdAndUpdate(id, {
        password
    });
}
/**
 * 判断当前 id 的密码是不是该值
 * @param {String} id 用户 id
 * @param {String} password 原密码
 * @returns {Boolean}
 */
export async function checkedPassword(id, password) {
    const user = await User.findById(id);
    return user.password === password;
}