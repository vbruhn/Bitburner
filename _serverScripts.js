export async function main(ns) {
    // Disable all logging:
    ns.disableLog('ALL');

    // Scripts that perform just one simple/single task ... once
    const weakenScript = "_singleWeaken.ns";
    const growScript = "_singleGrow.ns";
    const hackScript = "_singleHack.ns";

    // Data of the Server, this script is running on
    const serverName = ns.getHostname();

    // get the RAM-Load of each script
    const weakenMem = ns.getScriptRam(weakenScript, serverName);
    const growMem = ns.getScriptRam(growScript, serverName);
    const hackMem = ns.getScriptRam(hackScript, serverName);

    // Read the data of our client
    const clientData = ns.read("best_target.txt").split(",");
    const clientName = clientData[0];
    const clientMaxMoney = clientData[4];
    const clientMinSecurity = clientData[5];

    const money_target = Math.round(clientMaxMoney / 1000) * 800;

    // initialize Vars once
    var serverRam = ns.getServerRam(serverName);
    var availRAM = 0;
    var currentDollars = 0;
    var cD = "";
    var wD = "";
    var numThreads = 0;
    var waitTime = 0;
    var maxThreads = 0;
    var wantedMoney = 0;

    while (true) {
        // refresh memory-usage
        serverRam = ns.getServerRam(serverName);
        availRAM = serverRam[0] - serverRam[1]; // available RAM - used RAM

        //check the stats of our Client
        currentDollars = Math.round(ns.getServerMoneyAvailable(clientName));

        cD = currentDollars.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });

        wD = money_target.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });

        ns.print("Current Money: " + cD + " / " + wD);

        if (currentDollars < money_target) {
            // calculate the max number of threads for the growth-schript:
            // if the weaken-script is still running (for the sake of XP), then
            // use all of the left RAM ... else use only half of it.
            if (ns.scriptRunning(weakenScript, serverName)) {
                numThreads = Math.min(availRAM / growMem);
            } else {
                // delete the "/ 1.2" if you want to use all available RAM
                numThreads = Math.min(availRAM / 1.2 / growMem);
            }

            if (numThreads > 0) {
                waitTime = Math.round(ns.getGrowTime(clientName));
                ns.print("Grow() will last for approx. " + waitTime + " seconds.");

                if (!ns.scriptRunning(growScript, serverName)) {
                    await ns.run(growScript, numThreads, clientName);
                }

                // wait for the script to start
                while (!ns.scriptRunning(growScript, serverName)) { await ns.sleep(1000); }

                while (ns.scriptRunning(growScript, serverName)) {
                    await ns.sleep(1000);

                    // check if another script has reached the growAmount
                    currentDollars = Math.round(ns.getServerMoneyAvailable(clientName));
                    if (currentDollars > money_target) {
                        ns.print("Money reached goal!");
                        break;
                    }
                }
            }
        } else {
            // on low RAM-servers, you might want to change the divisor to 1.1 
            // or the like
            maxThreads = Math.min(availRAM / 2 / hackMem);

            // or steal a percentage
            wantedMoney = Math.round(money_target / 5);
            numThreads = ns.hackAnalyzeThreads(clientName, wantedMoney);


            if (maxThreads < numThreads) {
                numThreads = maxThreads;
            }
            numThreads = Math.round(numThreads);

            if (numThreads > 0) {
                waitTime = Math.round(ns.getHackTime(clientName));

                ns.print("Want $" + wantedMoney + " ...");
                ns.print("Hack(" + numThreads + " Threads) will last for approx. " + waitTime + " seconds.");

                await ns.run(hackScript, numThreads, clientName);

                // wait for the script to start
                while (!ns.scriptRunning(hackScript, serverName)) {
                    await ns.sleep(1000);
                }
                
                // wait for the script to finish and check if server's money is still enough
                while (ns.scriptRunning(hackScript, serverName)) {
                    currentDollars = Math.round(ns.getServerMoneyAvailable(clientName));
                    if (currentDollars < money_target) {
                        ns.kill(hackScript, clientName);
                        // could insert a break; command, but better to wait for
                        // the script to finish and to have more RAM for Growth
                    }
                    await ns.sleep(1000);
                }
            } else {
                ns.print("Waiting for other scripts to finish.");
            }
        }
        ns.print(" ");
        await ns.sleep(150);
    }
}
