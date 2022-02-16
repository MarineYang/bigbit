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
const ws_1 = __importDefault(require("ws"));
const axios_1 = __importDefault(require("axios")); // Promise based HTTP client for the browser and node.js.
function App(_server) {
    const wss = new ws_1.default.Server({ server: _server });
    wss.on('connection', function (ws, req) {
        return __awaiter(this, void 0, void 0, function* () {
            // fear and greedy value
            const fear_greedy = yield (0, axios_1.default)("https://api.alternative.me/fng/");
            console.log(JSON.stringify(fear_greedy.data.data));
            let ip = req.connection.remoteAddress;
            console.log(ip + " 유저 접속");
            let dollerTokrw;
            let krwTodoller;
            let currentKRW;
            let currentDoller;
            // btc, eth, xrp 현재 시세
            const btcwss = new ws_1.default('wss://stream.binance.com:9443/stream?streams=btcusdt@kline_1m/@kline_1m');
            btcwss.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    dollerTokrw = trade.data.k.c * 1196.90; /*현재 달러 */
                    currentDoller = trade.data.k.c;
                    ws.send("btc : " + trade.data.k.c);
                }
            });
            const ethwss = new ws_1.default('wss://stream.binance.com:9443/stream?streams=ethusdt@kline_1m/@kline_1m');
            ethwss.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    ws.send("eth : " + trade.data.k.c);
                }
            });
            const xrpwss = new ws_1.default('wss://stream.binance.com:9443/stream?streams=xrpusdt@kline_1m/@kline_1m');
            xrpwss.on('message', (data) => {
                if (data) {
                    const trade = JSON.parse(data); // parsing single-trade record
                    ws.send("xrp : " + trade.data.k.c);
                }
            });
            // upbit 현재 시세.
            const btc_krw = new ws_1.default('wss://api.upbit.com/websocket/v1');
            btc_krw.on('open', () => {
                req = `[{"ticket":"test"},{"type":"trade","codes":["KRW-BTC"]}]`;
                btc_krw.send(req);
            });
            btc_krw.on('message', (data) => {
                let str = data.toString('utf-8');
                let recvData = JSON.parse(str);
                if (recvData.c == "RISE") {
                    console.log("상승");
                }
                else if (recvData.c == "EVEN") {
                    console.log("보합");
                }
                else {
                    console.log("하락");
                }
                currentKRW = recvData.trade_price;
                krwTodoller = recvData.trade_price / 1197.53; /* 현재 달러 */
                let kimpga = (currentKRW / dollerTokrw - 1) * 100;
                console.log("kimpga :" + kimpga.toString().substring(0, 4) + "%");
                ws.send("btc-ktw : " + recvData.trade_price);
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