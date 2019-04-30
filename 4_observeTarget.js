export async function main(ns) {
    ns.disableLog('ALL');

    // Read the data of our client
    const clientData = ns.read("best_target.txt").split(",");
    const clientName = clientData[0];
    const clientMaxMoney = ns.getServerMaxMoney(clientName);
    const clientMinSecurity = ns.getServerMinSecurityLevel(clientName) + 5;
    const thisServer = ns.getHostname();
    const moneyStart = ns.getServerMoneyAvailable(thisServer);

    var a = 0,
        b = 0,
        c = 0,
        d = 0;
    var currentMoney = "",
        maxMoney = "",
        moneyGain = "",
        cashPerSec = "";
    var timeStart = Math.round(ns.getTimeSinceLastAug() / 1000);
    var timeNow = 0,
        moneyNow = 0;
    const port = ns.getPortHandle(1);
    var output = "";

    while (true) {
        timeNow = Math.round(ns.getTimeSinceLastAug() / 1000) - timeStart;

        a = Math.round(ns.getServerSecurityLevel(clientName));
        b = Math.round(ns.getServerMoneyAvailable(clientName));
        c = Math.round(ns.getServerMoneyAvailable(thisServer) - moneyStart);
        d = Math.round(c / timeNow * 100) / 100;

        currentMoney = b.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });
        maxMoney = clientMaxMoney.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });
        moneyGain = c.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });
        cashPerSec = d.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 2 });
            
        if (!port.empty()) {
            output = port.read();
            //port.clear();
        }
        const rowStart = `<div class="row"><div class="col-3" style="text-align:right;color:#3D505D;">`; // ${rowStart}
        const newCol = `</div><div class="col-9"  style="text-align:left;color:#8DA0AD;">`; // ${newCol}
        const rowEnd = `</div></div>`; // ${rowEnd}
        
        var txt =   `<h1 style="text-align:center;color:#3D505D;">Observing: ${clientName}</h1>` + 
                    `${rowStart}Home-Server's Task:${newCol}${output}${rowEnd}` +
                    `${rowStart}Security-Level:${newCol}${a} of wanted ${clientMinSecurity}${rowEnd}` +
                    `${rowStart}Available Money:${newCol}$${currentMoney} / ${maxMoney}${rowEnd}` + 
                    `${rowStart}Money-Delta:${newCol}$${moneyGain} in ${timeNow} seconds.${rowEnd}` +
                    `${rowStart}Money-Delta:${newCol}$${cashPerSec} per second.${rowEnd}`;
        ns.print(txt);

        await ns.sleep(1000);
        ns.clearLog();
    }
}
