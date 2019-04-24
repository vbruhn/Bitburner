hackScripts = ["_singleHack.script", "_singleGrow.script", "_singleWeaken.script", "_serverScripts.script", "best_target.txt", "_permaWeaken.script"];

serverCostMulti = 55000;
maxMoney = getServerMoneyAvailable('home') / 25;
maxRam = getPurchasedServerMaxRam('home');

// get servers with the minimum, predefined amount, but check if there is already
// a higher configured pserv
ramToBuy = 16;

// calculate max RAM for the buck
if (maxMoney > serverCostMulti * ramToBuy) {
    ramToBuy *= 2;

    while (maxMoney > serverCostMulti * ramToBuy) {
        ramToBuy *= 2;
    }
    ramToBuy /= 2;
}

if (ramToBuy > maxRam) {
    ramToBuy = maxRam;
}

//ramToBuy = 64;

print('Calculated: ' + ramToBuy + ' GB RAM for ' + serverCostMulti * ramToBuy + '$');

i = 0;
while (i < getPurchasedServerLimit()) {
    if (getServerMoneyAvailable("home") > getPurchasedServerCost(ramToBuy)) {
        if (!serverExists('pserv-' + i) || getServerRam('pserv-' + i)[0] < ramToBuy) {
            //if (maxMoney > serverCostMulti * ramToBuy) {
            if (serverExists('pserv-' + i)) {
                killall('pserv-' + i);
                sleep(8000);
                deleteServer('pserv-' + i);
                sleep(5000);
            }

            if (!serverExists('pserv-' + i)) {
                print("Line 49");
                hostname = purchaseServer('pserv-' + i, ramToBuy);
                if (hostname) {
                    for (j = 0; j < hackScripts.length; ++j) {
                        scp(hackScripts[j], hostname);
                    }
                    // run only the permaWeakenScript on pserv-0
                    if (i === 0) {
                        pmemory = getServerRam(hostname);
                        pavailableMem = pmemory[0] - pmemory[1];
                        pnumThreads = Math.round(pavailableMem / getScriptRam("_permaWeaken.script", hostname) - 1);
                        exec("_permaWeaken.script", hostname, pnumThreads);
                    } else {
                        exec('_serverScripts.script', hostname);
                    }
                    print('Bought player server #' + i + ' with ' + ramToBuy + ' GB RAM for $' + serverCostMulti * ramToBuy);
                    ++i;
                }
            }
            //}
            sleep(500);
        } else {
            ++i;
            sleep(500);
        }
    }
    sleep(6000);
}
