const wsModule = require("ws")
import axios from 'axios';              // Promise based HTTP client for the browser and node.js.

function App(_server) {

    const wss = new wsModule.Server({server: _server})

    wss.on('connection', async function(ws, req) {

        // fear and greedy value
        const fear_greedy = await axios("https://api.alternative.me/fng/")
        console.log(JSON.stringify(fear_greedy.data.data))

        let ip = req.connection.remoteAddress
        console.log(ip + " 유저 접속")
        
        // btc, eth, xrp 현재 시세
        const btcwss = new wsModule('wss://stream.binance.com:9443/stream?streams=btcusdt@kline_1m/@kline_1m')
        btcwss.on('message', (data: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing single-trade record
                ws.send("btc : " + trade.data.k.c)
            }
            
        });
        const ethwss = new wsModule('wss://stream.binance.com:9443/stream?streams=ethusdt@kline_1m/@kline_1m')
        ethwss.on('message', (data: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing single-trade record
                ws.send("eth : " + trade.data.k.c)
            }
            
        });
        const xrpwss = new wsModule('wss://stream.binance.com:9443/stream?streams=xrpusdt@kline_1m/@kline_1m')
        xrpwss.on('message', (data: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing single-trade record
                ws.send("xrp : " + trade.data.k.c)
            }
            
        });






        ws.on('error', function(error) {
            console.log("error !!")
        })
        ws.on('close', function() {
            console.log(ip + " 접속 종료.")
        })

    })

    

    
}
export default App