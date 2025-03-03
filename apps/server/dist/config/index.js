"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverConfig = exports.entitiesPaths = exports.envFilePathAll = exports.envFilePath = void 0;
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
const commonEnvFilePath = path.resolve('config', 'env/.env.common');
exports.envFilePath = path.resolve('config', `env/.env.${process.env.NODE_ENV || 'development'}`);
exports.envFilePathAll = [commonEnvFilePath, exports.envFilePath];
exports.entitiesPaths = [path.join(__dirname, '../', '/src/modules', '/**/*.entity{.ts,.js}')];
function getServerConfig() {
    function getEnv(path) {
        if (fs.existsSync(path)) {
            return dotenv.parse(fs.readFileSync(path));
        }
        return {};
    }
    const commonConfig = getEnv(commonEnvFilePath);
    const envConfig = getEnv(exports.envFilePath);
    const config = Object.assign(Object.assign({}, commonConfig), envConfig);
    return config;
}
exports.serverConfig = getServerConfig();
console.info('serverConfig', exports.serverConfig);
console.info('entitiesPaths', exports.entitiesPaths);
console.info('envFilePathAll', exports.envFilePathAll);
//# sourceMappingURL=index.js.map