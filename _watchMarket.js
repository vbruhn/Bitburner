const rowStart = `<div class="row"><div class="col-2" style="text-align:right;color:#8DA0AD;">`; // ${rowStart}
const newCol = `</div><div class="col-2"  style="text-align:left;color:#ADC0CD;">`; // ${newCol}
const rowEnd = `</div><div class="col-6"></div></div>`; // ${rowEnd}
const mySymbols = ["FSIG", "CTYS" //, "ECP", "APHE", "JGN"
];
var stocks = [];
var counter = 0;

var logTxt = "";

function checkTrend(ns) {
    if (stocks[0].price != Math.round(ns.getStockPrice(stocks[0].sym))) {
        ++counter;

        for (let i = 0; i < stocks.length; i++) {
            let stock = stocks[i];
            let price = Math.round(ns.getStockPrice(stock.sym));
            stock.price = price;
            if (price > stock.priceMax) {
                stock.priceMax = price;
            }
            if (price < stock.priceMin) {
                stock.priceMin = price;
            }
            stock.oldRising = stock.newRising;

            stock.sma10.push(price);
            stock.sma10sum += price;
            if (stock.sma10.length > 10) {
                stock.sma10sum -= stock.sma10.shift();
            }
            stock.sma20.push(price);
            stock.sma20sum += price;
            if (stock.sma20.length > 20) {
                stock.sma20sum -= stock.sma20.shift();
            }
            stock.sma40.push(price);
            stock.sma40sum += price;
            if (stock.sma40.length > 40) {
                stock.sma40sum -= stock.sma40.shift();
            }

            // if (counter > 77) ...
            stock.avg10 = Math.round(stock.sma10sum / 10);
            stock.avg20 = Math.round(stock.sma20sum / 20);
            stock.avg40 = Math.round(stock.sma40sum / 40);

            stock.newRising = (stock.avg10 > stock.avg20);
        }
    }
}

function initStocks(ns) {
    for (let i = 0; i < mySymbols.length; i++) {
        let price = Math.round(ns.getStockPrice(mySymbols[i]));
        let stock = {
            sym: mySymbols[i],
            price: price,
            priceStart: price,
            priceMax: price,
            priceMin: price,
            sma10: [],
            sma20: [],
            sma40: [],
            sma10sum: 0,
            sma20sum: 0,
            sma40sum: 0,
            avg10: 0,
            avg20: 0,
            avg40: 0,
            oldRising: false,
            newRising: true
        };

        stocks[i] = stock;
    }
}

export async function main(ns) {
    ns.disableLog('ALL');

    //  I N I T
    const timeStart = ns.getTimeSinceLastAug();
    const timeElapsed = () =>
        Math.round((ns.getTimeSinceLastAug() - timeStart) / 1000);

    // the initStocks-Function initialzes the stocks and does initial purchases
    initStocks(ns);

    while (true) {
        checkTrend(ns);

        
        logTxt = `<div style="background-color:black;"><h1 style="text-align:center;color:#ADC0CD;">Observing Stocks, Tick: ${counter}</h1>`;
        
        logTxt += `${rowStart}Symbols:${newCol}${stocks[0].sym}${newCol}${stocks[1].sym}${rowEnd}` +
                  `<div style="background-color:#111111;">${rowStart}Price:${newCol}${ns.nFormat(stocks[0].price, "$0.000a")}` + 
                  `${newCol}${ns.nFormat(stocks[1].price, "$0.000a")}${rowEnd}</div>` + 
                  `${rowStart}Lowest:${newCol}${ns.nFormat(stocks[0].priceMin, "$0.000a")}` + 
                  `${newCol}${ns.nFormat(stocks[1].priceMin, "$0.000a")}${rowEnd}`;
        logTxt += `${rowStart}Highest:${newCol}${ns.nFormat(stocks[0].priceMax, "$0.000a")}
        ${newCol}${ns.nFormat(stocks[1].priceMax, "$0.000a")}${rowEnd}`;
        logTxt += `${rowStart}SMA-10:${newCol}${ns.nFormat(stocks[0].avg10, "$0.000a")}
        ${newCol}${ns.nFormat(stocks[1].avg10, "$0.000a")}${rowEnd}`;
        logTxt += `<div style="background-color:#111111;">${rowStart}SMA-20:${newCol}${ns.nFormat(stocks[0].avg20, "$0.000a")}
        ${newCol}${ns.nFormat(stocks[1].avg20, "$0.000a")}${rowEnd}</div>`;
        logTxt += `${rowStart}SMA-40:${newCol}${ns.nFormat(stocks[0].avg40, "$0.000a")}
        ${newCol}${ns.nFormat(stocks[1].avg40, "$0.000a")}${rowEnd}`;
        logTxt += `${rowStart}oldRising:${newCol}${stocks[0].oldRising}${newCol}${stocks[1].oldRising}${rowEnd}`;
        logTxt += `${rowStart}newRising:${newCol}${stocks[0].newRising}${newCol}${stocks[1].newRising}${rowEnd}</div>`;

        ns.clearLog();
        ns.print(logTxt);

        await ns.sleep(5 * 100);
    }
}
