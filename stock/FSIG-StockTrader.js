const fee = 100000;
const cashRelation = 0.95; // how much money to reinvest
var myStocks = ["FLCM", "CTYS", "FSIG", "APHE"
    ];

var stocks = [];
var totalMoney = 0;

function moveMoney(ns, stock, port) {
    let sellOnly = !port.empty();
    stock.price = ns.getStockPrice(stock.sym);
    let pos = ns.getStockPosition(stock.sym);
    stock.sharesLong = pos[0];
    stock.sharesShort = pos[2];
    stock.priceLong = pos[1];
    stock.priceShort = pos[3];

    if (stock.isRising) {
        ns.sellShort(stock.sym, stock.sharesShort);

        if (!sellOnly) {
            let newInvest = ns.getServerMoneyAvailable('home') * cashRelation - fee;
            let numShares = Math.floor(newInvest / stock.price);
            let maxShares = stock.maxShares - stock.sharesLong;
            if (numShares > maxShares) {
                numShares = maxShares;
            }

            ns.buyStock(stock.sym, numShares);
        }
    } else {
        ns.sellStock(stock.sym, stock.sharesLong);

        if (!sellOnly) {
            let newInvest = ns.getServerMoneyAvailable('home') * cashRelation - fee;
            let numShares = Math.floor(newInvest / stock.price);
            let maxShares = stock.maxShares - stock.sharesShort;
            if (numShares > maxShares) {
                numShares = maxShares;
            }

            ns.shortStock(stock.sym, numShares);
        }
    }
    pos = ns.getStockPosition(stock.sym);
    stock.sharesLong = pos[0];
    stock.sharesShort = pos[2];
    stock.priceLong = pos[1];
    stock.priceShort = pos[3];
}

function checkTrend(ns, port) {
    var txt = "";
    for (let i = 0; i < stocks.length; i++) {
        let stock = stocks[i];

        stock.wasRising = stock.isRising;
        stock.isRising = (ns.getStockForecast(stock.sym) > 0.5);

        if (stock.isRising != stock.wasRising) {
            ns.print(`<b>Swapping ${stock.sym}</b>`);
            moveMoney(ns, stock, port);
        }
    }
}

function initStocks(ns) {
    let cash = ns.getServerMoneyAvailable('home') / 
            myStocks.length * cashRelation - fee;

    for (let i = 0; i < myStocks.length; i++) {
        let pos = ns.getStockPosition(myStocks[i]);
        let trend = (ns.getStockForecast(myStocks[i]) > 0.5);

        let stock = {
            sym: myStocks[i],
            maxShares: ns.getStockMaxShares(myStocks[i]),
            price: ns.getStockPrice(myStocks[i]),
            wasRising: trend,
            isRising: trend,
            sharesLong: pos[0],
            sharesShort: pos[2],
            priceLong: pos[1],
            priceShort: pos[3]
        };

        stocks[i] = stock;

        let numShares = Math.floor(cash / stock.price);
        let maxShares = stock.maxShares - stock.sharesLong - stock.sharesShort;
        if (numShares > maxShares) numShares = maxShares;
        if (stock.isRising) {
            ns.buyStock(stock.sym, numShares);
            stock.sharesLong += numShares;
            stock.priceLong = (stock.priceLong + numShares * stock.price - fee) / 2;
        } else {
            ns.shortStock(stock.sym, numShares);
            stock.sharesShort += numShares;
            stock.priceShort = (stock.priceShort + numShares * stock.price - fee) / 2;
        }
    }
}

export async function main(ns) {
    // Using Port 4 to get a 'sellOnly-signal'
    const port = ns.getPortHandle(4);
    port.clear();

    ns.disableLog('sleep');

    //  I N I T
    const timeStart = ns.getTimeSinceLastAug();
    const timeElapsed = () =>
        Math.round((ns.getTimeSinceLastAug() - timeStart) / 1000);

    // the initStocks-Function initialzes the stocks and does initial purchases
    // for using all available stocks uncomment the following line
    //myStocks = ns.getStockSymbols();
    initStocks(ns);

    while (true) {
        checkTrend(ns, port);

        await ns.sleep(5 * 1000);
    }
}
