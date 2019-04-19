// Disable all stupid logging:
disableLog('ALL');

// Scripts that perform just one simple/single task ... once
weakenScript = "_singleWeaken.script";
growScript = "_singleGrow.script";
hackScript = "_singleHack.script";

// Data of the Server, this script is running on
serverName = getHostname();
serverRam = getServerRam(serverName);

// get the RAM-Load of each script
weakenMem = getScriptRam(weakenScript, serverName);
growMem = getScriptRam(growScript, serverName);
hackMem = getScriptRam(hackScript, serverName);

// Read the data of our client
clientData = read("best_target.txt").split(",");
clientName = clientData[0];
clientMaxMoney = clientData[4];
clientMinSecurity = clientData[5];

money_target = 0.9 * clientMaxMoney;
sec_target = (clientMinSecurity - 0) + 5; //-0 to convert string to number

availRAM = serverRam[0] - serverRam[1]; // available RAM - used RAM

while (true) {
    //check the stats of our Client
    currentSecLevel = Math.round(getServerSecurityLevel(clientName));
    currentDollars = Math.round(getServerMoneyAvailable(clientName));
    
    print("Current Sec-Lvl: " + currentSecLevel + " / " + sec_target);
    print("Current Money: " + currentDollars + " / " + money_target);

    if (currentSecLevel > sec_target) {
        numThreads = (availRAM / 2 / weakenMem); // Will be rounded to nearest integer by run()-Function

        waitTime = Math.round(getWeakenTime(clientName));
        print("Weaken() will last for approx. " + waitTime + " seconds.");

        run(weakenScript, numThreads, clientName);

        // wait for the script to start
        sleep(10000);
        while (scriptRunning(weakenScript, serverName)) {
            sleep(1000);
        }
        
    } else if (currentDollars < money_target) {
        numThreads = (availRAM / 5 / growMem); // Will be rounded to nearest integer by run()-Function

        waitTime = Math.round(getGrowTime(clientName));
        print("Grow() will last for approx. " + waitTime + " seconds.");

        run(growScript, numThreads, clientName);

        // wait for the script to start
        sleep(10000);
        while (scriptRunning(growScript, serverName)) {
            sleep(1000);
        }
        
    } else {
        // use this to empty the client
        maxThreads = (availRAM / 2 / hackMem);

        // or steal a percentage
        wantedMoney = Math.round(money_target / 5);
        numThreads = hackAnalyzeThreads(clientName, wantedMoney);
        print("Want $" + wantedMoney + " ...");

        if (maxThreads > numThreads) {
            numThreads = maxThreads;
        }
        numThreads=Math.round(numThreads);

        waitTime = Math.round(getHackTime(clientName));
        print("Hack(" + numThreads + " Threads) will last for approx. " + waitTime + " seconds.");

        run(hackScript, numThreads, clientName);

        // wait for the script to start
        sleep(10000);
        while (scriptRunning(hackScript, serverName)) {
            sleep(1000);
        }
    }
    print (" ");
    sleep(1000);
}
