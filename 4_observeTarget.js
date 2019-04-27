export async function main(ns) {
    ns.disableLog('ALL');

    // Read the data of our client
    const clientData = ns.read("best_target.txt").split(",");
    const clientName = clientData[0];
    const clientMaxMoney = ns.getServerMaxMoney(clientName);
    const clientMinSecurity = ns.getServerMinSecurityLevel(clientName) + 5;

    var a = 0;
    var b = 0;
    var currentMoney = "";
    var maxMoney = "";
    var timeStart = Math.round(ns.getTimeSinceLastAug() / 1000);
    var timeNow = 0;

    while (true) {
        timeNow = Math.round(ns.getTimeSinceLastAug() / 1000) - timeStart;
        ns.print("Observing: " + clientName + " for " + timeNow + " seconds.");
        
        a = Math.round(ns.getServerSecurityLevel(clientName));
        b = Math.round(ns.getServerMoneyAvailable(clientName));

        currentMoney = b.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 2 });
        maxMoney = clientMaxMoney.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 2 });

        ns.print(" ");
        ns.print("Security-Level: " + a + " of wanted " + clientMinSecurity);
        ns.print("Available Money: $" + currentMoney + " / $" + maxMoney);

        await ns.sleep(5000);
        ns.clearLog();
    }
}
