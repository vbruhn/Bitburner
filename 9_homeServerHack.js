// Disable all stupid logging:
disableLog('ALL');

// Scripts that perform just one simple/single task ... 
weakenScript = "_singleWeaken.script";
growScript = "_singleGrow.script";
hackScript = "_singleHack.script";

// Data of the Server, the script is running on
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

money_target = Math.round(clientMaxMoney / 1000) * 800;
sec_target = (clientMinSecurity - 0) + 5; // -0 to convert string to number


while (true) {
    //check the stats of our Client
    currentSecLevel = Math.round(getServerSecurityLevel(clientName));
    currentDollars = Math.round(getServerMoneyAvailable(clientName));

    serverRam = getServerRam(serverName);
    availRAM = serverRam[0] - serverRam[1]; // available RAM - used RAM
    availRAM *= 0.8; // reduce the scripts' memory usage for other home-server scripts

    cD = currentDollars.toLocaleString(
        undefined, // leave undefined to use the browser's locale,
        // or use a string like 'en-US' to override it.
        { minimumFractionDigits: 0 });

    wD = money_target.toLocaleString(
        undefined, // leave undefined to use the browser's locale,
        // or use a string like 'en-US' to override it.
        { minimumFractionDigits: 0 });

    print("Current Sec-Lvl: " + currentSecLevel + " of max. " + sec_target);
    print("Current Money: " + cD + " of at least " + wD);



    if (currentSecLevel > sec_target) {
        numThreads = (availRAM / 1.5 / weakenMem);

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
        numThreads = (availRAM / 1.5 / growMem);

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
    } else { // hack the client
        // do not use up all the available RAM
        maxThreads = (availRAM / 1.5 / hackMem) + 1;

        // but steal a certain percentage
        wantedMoney = Math.round(currentDollars / 50000) * 10000;
        numThreads = hackAnalyzeThreads(clientName, wantedMoney);

        // do not max out the RAM
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
            // wait for the script to end
            while (scriptRunning(hackScript, serverName)) {
                sleep(1000);
            }
        } else {
            print("Waiting for free RAM ... :(");
        }
    }
    print(" ");
    sleep(1000);
}
