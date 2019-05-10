export async function main(ns) {

    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');
    ns.clearLog();

    const symbols = ns.getStockSymbols();
    // const symbols = ["ECP", "BLD", "OMTK", "FSIG", "FLCM", "CTYS"];
    var myStocks = [];
    const elapsedTime = () =>
        Math.round(ns.getTimeSinceLastAug() / 1000);
    var startingVal = 0;
    var startingCash = Math.round(ns.getServerMoneyAvailable('home'));
    const currentCash = () => Math.round(ns.getServerMoneyAvailable('home'));
    var currentVal = 0;

    function getPos() {
        currentVal = 0;
        for (let i = 0; i < symbols.length; i++) {
            let pos = ns.getStockPosition(symbols[i]);
            myStocks[i] = {
                symbol: symbols[i],
                shares: pos[0],
                avgPx: pos[1],
                sharesShort: pos[2],
                avgPxShort: pos[3],
                totalVal: function() {
                    return this.shares * this.avgPx +
                        this.sharesShort * this.avgPxShort;
                }
            };
            currentVal += myStocks[i].totalVal();
        }
    }

    function convertTime() {
        var s = elapsedTime();
        var pad = (n, z = 2) => ('00' + n).slice(-z);
        return pad(s / 3600 | 0) + ':' + pad((s % 3600) / 60 | 0) + ':' + pad((s % 60) | 0);
    }

    // initialize Values:
    getPos();

    while (true) {
        await ns.sleep(2000);
        ns.clearLog();
        getPos();
        var totalMoney = Math.round(currentVal + currentCash());
        var gainedMoneyFromScripts = ns.getScriptIncome()[0];
        var gainedMoneyFromActiveScripts = Math.floor(ns.getScriptIncome()[1]);
        //var cashPerSecond = Math.round(gainedMoney / elapsedTime());

        var tM = totalMoney.toLocaleString(undefined, { minimumFractionDigits: 0 });
        var gMfS = ns.nFormat(gainedMoneyFromScripts, "0,00a");
        var gMfaS = gainedMoneyFromActiveScripts.toLocaleString(undefined, { minimumFractionDigits: 0 });

        const rowStart = `<div class="row"><div class="col-6" style="text-align:right;color:#3D505D;">`; // ${rowStart}
        const newCol = `</div><div class="col-6"  style="text-align:left;color:#8DA0AD;">`; // ${newCol}
        const rowEnd = `</div></div>`; // ${rowEnd}
        
        var txt =   `<h1 style="text-align:center;color:#3D505D;">Observing: Cashflow</h1>` + 
                    `${rowStart}Current total:${newCol}$${tM},-${rowEnd}` +
                    `${rowStart}From Scripts (active):${newCol}$${gMfS} per Second${rowEnd}` +
                    `${rowStart}From Scripts (total):${newCol}$${gMfaS},- per Second${rowEnd}`;
                    
        ns.print(txt);
    }
}
