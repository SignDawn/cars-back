import mongoose from './index';

const ObjectId = mongoose.Schema.Types.ObjectId; // 特殊类型
const keyAndValueSchema = new mongoose.Schema({
    key: String,
    value: String,
});

const specificCarSchema = new mongoose.Schema({
    detailId: String, // 具体车 id
    carName: String, // 具体车名
    price: String, // 具体价格
    images: [String], // 图
    detailConfig: [
        keyAndValueSchema
    ],
    like_list: [ObjectId], // 点赞列表
})

const carSchema = new mongoose.Schema({
    carName: String,
    img: String,
    carTypeId: String,
    specificCars: [
        specificCarSchema
    ],
    infos: [keyAndValueSchema]
});

const Car = mongoose.model('Car', carSchema);

export default Car;