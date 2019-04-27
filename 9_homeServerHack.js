export async function main(ns) {
    // Disable all stupid logging:
    ns.disableLog('ALL');

    // Scripts that perform just one simple/single task ... 
    const weakenScript = "_singleWeaken.ns";
    const growScript = "_singleGrow.ns";
    const hackScript = "_singleHack.ns";

    // Data of the Server, the script is running on
    const serverName = ns.getHostname();

    // get the RAM-Load of each script
    const weakenMem = ns.getScriptRam(weakenScript, serverName);
    const growMem = ns.getScriptRam(growScript, serverName);
    const hackMem = ns.getScriptRam(hackScript, serverName);

    // Read the data of our client
    const clientData = ns.read("best_target.txt").split(",");
    const clientName = clientData[0];
    const clientMaxMoney = ns.getServerMaxMoney(clientName);
    const clientMinSecurity = ns.getServerMinSecurityLevel(clientName);

    const money_target = Math.round(clientMaxMoney / 10000) * 8000;
    const sec_target = (clientMinSecurity - 0) + 5; // -0 to convert string to number


    while (true) {
        var numThreads = 0;
        var waitTime = 0;
        //check the stats of our Client
        var currentSecLevel = Math.round(ns.getServerSecurityLevel(clientName));
        var currentDollars = Math.round(ns.getServerMoneyAvailable(clientName));

        var serverRam = ns.getServerRam(serverName);
        var availRAM = serverRam[0] - serverRam[1]; // available RAM - used RAM
        availRAM *= 0.8; // reduce the scripts' memory usage for other home-server scripts

        var cD = currentDollars.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });

        var wD = money_target.toLocaleString(
            undefined, // leave undefined to use the browser's locale,
            // or use a string like 'en-US' to override it.
            { minimumFractionDigits: 0 });

        ns.print("Current Sec-Lvl: " + currentSecLevel + " of max. " + sec_target);
        ns.print("Current Money: " + cD + " of at least " + wD);



        if (currentSecLevel > sec_target) {
            numThreads = (availRAM / 1.2 / weakenMem);

            if (numThreads > 0) {
                waitTime = Math.round(ns.getWeakenTime(clientName));
                ns.print("Weaken() will last for approx. " + waitTime + " seconds.");

                if (!ns.scriptRunning(weakenScript, serverName)) {
                    await ns.run(weakenScript, numThreads, clientName);
                }

                // wait for the script to start
                while (!ns.scriptRunning(weakenScript, serverName)) { await ns.sleep(1000); }
                
                while (ns.scriptRunning(weakenScript, serverName)) {
                    await ns.sleep(1000);

                    // check if another script has already lowered the secLevel
                    currentSecLevel = Math.round(ns.getServerSecurityLevel(clientName));
                    if (currentSecLevel <= sec_target) {
                        ns.print("secLevel reached goal by external script!");
                        break;
                    }
                }
            }
        } else if (currentDollars < money_target) {
            numThreads = (availRAM / 1.2 / growMem);

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
                        ns.print("Money reached goal by external script!");
                        break;
                    }
                }
            }
        } else { // hack the client
            // do not use up all the available RAM
            var maxThreads = Math.min(availRAM / hackMem);

            // but steal a certain percentage
            var wantedMoney = Math.round(currentDollars / 50000) * 10000;
            numThreads = ns.hackAnalyzeThreads(clientName, wantedMoney);

            // do not max out the RAM
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
                while (!ns.scriptRunning(hackScript, serverName)) { await ns.sleep(1000); }
                // wait for the script to end
                while (ns.scriptRunning(hackScript, serverName)) {
                    await ns.sleep(1000);
                }
            } else {
                ns.print("Waiting for free RAM ... :(");
            }
        }
        ns.print(" ");
        await ns.sleep(150);
    }
}
