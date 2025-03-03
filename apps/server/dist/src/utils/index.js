"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToJsonStr = exports.getCommonRes = void 0;
const enum_1 = require("../enum");
class CommonResponse {
}
const getCommonRes = (res) => {
    const defaultRes = {
        data: {},
        message: '请求成功',
        code: enum_1.ResCodeEnum.success,
        success: true,
    };
    return Object.assign(defaultRes, res);
};
exports.getCommonRes = getCommonRes;
const objToJsonStr = (obj, ignoreKeys) => {
    const newObj = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
        if (ignoreKeys.includes(key)) {
            newObj[key] = obj[key];
            continue;
        }
        try {
            newObj[key] = JSON.stringify(obj[key]);
        }
        catch (_e) {
            newObj[key] = "";
        }
    }
    return newObj;
};
exports.objToJsonStr = objToJsonStr;
//# sourceMappingURL=index.js.map