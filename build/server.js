"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const index_1 = __importDefault(require("./index"));
try {
    const server = (0, http_1.createServer)(express_1.default);
    const app = new index_1.default(server);
    server.listen(9090, function () {
        console.log('Socket IO server listening on port 3000');
    });
}
catch (error) {
    console.log(error);
}
//# sourceMappingURL=server.js.map