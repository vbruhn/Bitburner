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
        c = 0;
    var currentMoney = "",
        maxMoney = "",
        moneyGain = "";
    var timeStart = Math.round(ns.getTimeSinceLastAug() / 1000);
    var timeNow = 0,
        moneyNow = 0;
    var port = ns.getPortHandle(1);
    var output = "";

    while (true) {
        timeNow = Math.round(ns.getTimeSinceLastAug() / 1000) - timeStart;
        ns.print("Observing: " + clientName);

        a = Math.round(ns.getServerSecurityLevel(clientName));
        b = Math.round(ns.getServerMoneyAvailable(clientName));
        c = Math.round(ns.getServerMoneyAvailable(thisServer) - moneyStart);

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
            
        if (!port.empty()) {
            output = port.read();
            port.clear();
        }

        ns.print(" ");
        ns.print("Home-Server's Task: " + output);
        ns.print("Security-Level: " + a + " of wanted " + clientMinSecurity);
        ns.print("Available Money: $" + currentMoney + " / $" + maxMoney);
        ns.print("Money-Delta: $" + moneyGain + " in " + timeNow + " seconds.");

        await ns.sleep(1000);
        ns.clearLog();
    }
}
