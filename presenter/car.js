import Car from '../model/car';
import User from '../model/user';

/**
 * 
 * @param {Number} carName 汽车名，模糊
 * @param {Number} page 页
 * @param {String} pageSize 页数
 */
export async function getCars(carName, page, pageSize) {
    let params;
    if (carName) {
        params = {
            carName: {
                $regex: carName
            }
        }
    }
    const total = await Car.find(params).count(); // 先计算数量
    // 计算结果
    const table = await Car.find(params)
        .skip((page - 1) * pageSize).limit(pageSize);
    // 对数据进行部分清空
    for (const car of table) {
        for (const specificCar of car.specificCars) {
            specificCar.images = undefined;
            specificCar.detailConfig = undefined;
        }
    }
    return {
        total,
        table
    };
}

/**
 * 获取汽车根据详细 id 
 * @param {String} detailId 
 */
export async function getCarByDetailId(detailId) {
    const car = await Car.findOne({
        "specificCars.detailId": detailId
    });
    return car.specificCars.find(item => item.detailId === detailId);
}

/**
 * 收藏汽车
 * @param {String} id 用户id
 * @param {String} detailId 汽车 id
 */
export async function collectCar(id, detailId) {
    const user = await User.findById(id);
    const collection_info = user.collection_info;
    collection_info.push({
        cid: detailId,
    });
    await User.findByIdAndUpdate(id, {
        collection_info
    });
}