"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setNeedPerm = exports.Public = void 0;
const constant_1 = require("../constant");
const common_1 = require("@nestjs/common");
const Public = () => (0, common_1.SetMetadata)(constant_1.IS_PUBLIC_KEY, true);
exports.Public = Public;
const setNeedPerm = (perm) => {
    return (0, common_1.SetMetadata)(constant_1.NEED_PERMISSION_CODE, perm);
};
exports.setNeedPerm = setNeedPerm;
//# sourceMappingURL=index.decorator.js.map