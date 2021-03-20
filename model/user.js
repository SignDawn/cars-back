const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const ObjectId = mongoose.Schema.Types.ObjectId; // 特殊类型
const likeSchema = new mongoose.Schema({
    pid: ObjectId,
    cid: String,
    uid: ObjectId,
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
        enum: ['男', '女']
    },
    avater: String, // 头像
    describe: String,
    location: {
        country: String,
        province: String,
        city: String,
    },
    like_message: [
        likeSchema
    ],

});

const User = mongoose.model('User', {

})