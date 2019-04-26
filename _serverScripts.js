// Disable all stupid logging:
disableLog('ALL');

// Scripts that perform just one simple/single task ... once
weakenScript = "_singleWeaken.script";
growScript = "_singleGrow.script";
hackScript = "_singleHack.script";

// Data of the Server, this script is running on
serverName = getHostname();

// get the RAM-Load of each script
weakenMem = getScriptRam(weakenScript, serverName);
growMem = getScriptRam(growScript, serverName);
hackMem = getScriptRam(hackScript, serverName);

// Read the data of our client
clientData = read("best_target.txt").split(",");
clientName = clientData[0];
clientMaxMoney = clientData[4];
clientMinSecurity = clientData[5];

money_target = Math.round(clientMaxMoney / 1000) * 900;
sec_target = (clientMinSecurity - 0) + 5; //-0 to convert string to number


while (true) {
    // refresh memory-usage
    serverRam = getServerRam(serverName);
    availRAM = serverRam[0] - serverRam[1]; // available RAM - used RAM

    //check the stats of our Client
    currentSecLevel = Math.round(getServerSecurityLevel(clientName));
    currentDollars = Math.round(getServerMoneyAvailable(clientName));

    cD = currentDollars.toLocaleString(
        undefined, // leave undefined to use the browser's locale,
        // or use a string like 'en-US' to override it.
        { minimumFractionDigits: 0 });

    wD = money_target.toLocaleString(
        undefined, // leave undefined to use the browser's locale,
        // or use a string like 'en-US' to override it.
        { minimumFractionDigits: 0 });

    print("Current Sec-Lvl: " + currentSecLevel + " of max. " + sec_target);
    print("Current Money: " + cD + " / " + wD);

    if (currentSecLevel > sec_target) {
        // calculate the max number of threads for the weaken-schript:
        // if the grow-script is still running (for the sake of XP), then
        // use all of the left RAM ... else use only half of it.
        if (scriptRunning(growScript, serverName)) {
            numThreads = Math.min(availRAM / weakenMem);
        } else {
            // delete the "/ 2" if you want to use all available RAM
            numThreads = Math.min(availRAM / 2 / weakenMem);
        }

        if (numThreads > 0) {
            waitTime = Math.round(getWeakenTime(clientName));
            print("Weaken() will last for approx. " + waitTime + " seconds.");

            if (!scriptRunning(weakenScript, serverName)) {
                run(weakenScript, numThreads, clientName);
            }

            // wait for the script to start
            sleep(10000);
            while (scriptRunning(weakenScript, serverName)) {
                sleep(1000);

                // check if another script has already lowered the secLevel
                currentSecLevel = Math.round(getServerSecurityLevel(clientName));
                if (currentSecLevel <= sec_target) {
                    print("secLevel reached goal by external script!");
                    break;
                }
            }
        }

    } else if (currentDollars < money_target) {
        // calculate the max number of threads for the growth-schript:
        // if the weaken-script is still running (for the sake of XP), then
        // use all of the left RAM ... else use only half of it.
        if (scriptRunning(weakenScript, serverName)) {
            numThreads = Math.min(availRAM / growMem);
        } else {
            // delete the "/ 2" if you want to use all available RAM
            numThreads = Math.min(availRAM / 2 / growMem);
        }

        if (numThreads > 0) {
            waitTime = Math.round(getGrowTime(clientName));
            print("Grow() will last for approx. " + waitTime + " seconds.");

            if (!scriptRunning(growScript, serverName)) {
                run(growScript, numThreads, clientName);
            }

            // wait for the script to start
            sleep(10000);
            while (scriptRunning(growScript, serverName)) {
                sleep(1000);

                // check if another script has reached the growAmount
                currentDollars = Math.round(getServerMoneyAvailable(clientName));
                if (currentDollars > money_target) {
                    print("Money reached goal by external script!");
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
        numThreads = hackAnalyzeThreads(clientName, wantedMoney);


        if (maxThreads < numThreads) {
            numThreads = maxThreads;
        }
        numThreads = Math.round(numThreads);

        if (numThreads > 0) {
            waitTime = Math.round(getHackTime(clientName));

            print("Want $" + wantedMoney + " ...");
            print("Hack(" + numThreads + " Threads) will last for approx. " + waitTime + " seconds.");

            run(hackScript, numThreads, clientName);

            // wait for the script to start
            sleep(10000);
            while (scriptRunning(hackScript, serverName)) {
                // TODO: check if another script has already hacked the server
                sleep(1000);
            }
        } else {
            print("Waiting for other scripts to finish.");
        }
    }
    print(" ");
    sleep(1000);
}
