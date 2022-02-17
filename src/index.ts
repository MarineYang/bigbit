import WebSocket from 'ws';
import axios from 'axios';              // Promise based HTTP client for the browser and node.js.

function App(_server) {

    const wss = new WebSocket.Server({server: _server})

    wss.on('connection', async function(ws, req) {

        // fear and greedy value
        const fear_greedy = await axios("https://api.alternative.me/fng/")
        console.log(JSON.stringify(fear_greedy.data.data))

        let ip = req.connection.remoteAddress
        console.log(ip + " 유저 접속")
        
        let dollerTokrw;
        let krwTodoller;
        let currentKRW;
        let currentDoller;
        // btc, eth, xrp 현재 시세
        const btcwss = new WebSocket('wss://stream.binance.com:9443/stream?streams=btcusdt@kline_1m/@kline_1m')
        btcwss.on('message', (data: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing single-trade record
                dollerTokrw = trade.data.k.c * 1196.90 /*현재 달러 */
                currentDoller = trade.data.k.c
                ws.send("btc : " + trade.data.k.c)
            }
            
        });
        const ethwss = new WebSocket('wss://stream.binance.com:9443/stream?streams=ethusdt@kline_1m/@kline_1m')
        ethwss.on('message', (data: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing single-trade record
                ws.send("eth : " + trade.data.k.c)
            }
            
        });
        const xrpwss = new WebSocket('wss://stream.binance.com:9443/stream?streams=xrpusdt@kline_1m/@kline_1m')
        xrpwss.on('message', (data: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing single-trade record
                ws.send("xrp : " + trade.data.k.c)
            }
            
        });
        // upbit 현재 시세.
        const btc_krw = new WebSocket('wss://api.upbit.com/websocket/v1')
        btc_krw.on('open', () => {
            req = `[{"ticket":"test"},{"type":"trade","codes":["KRW-BTC"]}]`
            btc_krw.send(req)
        });
        btc_krw.on('message', (data) => {
            let str = data.toString('utf-8')
            let recvData = JSON.parse(str)
            
            // 전일 대비만 구할 수 있음
            // if (recvData.c == "RISE") {
            //     console.log("상승")
            // } else if (recvData.c == "EVEN") {
            //     console.log("보합")
            // } else {
            //     console.log("하락")
            // }
            currentKRW = recvData.trade_price
            krwTodoller = recvData.trade_price / 1197.53 /* 현재 달러 */
            
            let kimpga = (currentKRW / dollerTokrw - 1) * 100
            console.log("kimpga :" + kimpga.toString().substring(0,4) + "%")

            ws.send("btc-ktw : " + recvData.trade_price)
        })

        // https://fapi.coinglass.com/api/futures/longShortRate?symbol=BTC&timeType=2 각 거래소별 롱 / 숏 비율

        ws.on('error', function(error) {
            console.log("error !!")
        })
        ws.on('close', function() {
            console.log(ip + " 접속 종료.")
        })

    })

    

    
}
export default App