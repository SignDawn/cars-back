/**
 * 该文件用来连接数据库
 */

const mongoose = require('mongoose');
const databaseName = 'CarHome'; // 数据库名字
mongoose.connect(`mongodb://localhost/${databaseName}`);

export default mongoose;