"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wsModule = require("ws");
const axios_1 = __importDefault(require("axios")); // Promise based HTTP client for the browser and node.js.
function App(_server) {
    const wss = new wsModule.Server({ server: _server });
    wss.on('connection', function (ws, req) {
        return __awaiter(this, void 0, void 0, function* () {
            // fear and greedy value
            const fear_greedy = yield (0, axios_1.default)("https://api.alternative.me/fng/");
            console.log(JSON.stringify(fear_greedy.data.data));
            let ip = req.connection.remoteAddress;
            console.log(ip + " 유저 접속");
            // btc, eth, xrp 현재 시세
            const btcwss = new wsModule('wss://stream.binance.com:9443/stream?streams=btcusdt@kline_1m/@kline_1m');
            btcwss.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    ws.send("btc : " + trade.data.k.c);
                }
            });
            const ethwss = new wsModule('wss://stream.binance.com:9443/stream?streams=ethusdt@kline_1m/@kline_1m');
            ethwss.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    ws.send("eth : " + trade.data.k.c);
                }
            });
            const xrpwss = new wsModule('wss://stream.binance.com:9443/stream?streams=xrpusdt@kline_1m/@kline_1m');
            xrpwss.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    ws.send("xrp : " + trade.data.k.c);
                }
            });
            ws.on('error', function (error) {
                console.log("error !!");
            });
            ws.on('close', function () {
                console.log(ip + " 접속 종료.");
            });
        });
    });
}
exports.default = App;
//# sourceMappingURL=index.js.map