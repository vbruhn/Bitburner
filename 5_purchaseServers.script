hackScripts = ["_singleHack.script", "_singleGrow.script", "_singleWeaken.script", "_serverScripts.script", "best_target.txt"];

serverCostMulti = 55000;
maxMoney = getServerMoneyAvailable('home') / 25;

// get servers with the minimum, predefined amount, but check if there is already
// a higher configured pserv
ramToBuy = 16;
//if (serverExists('pserv-0')) {
//    ramToBuy = Math.max(ramToBuy, getServerRam('pserv-0')[0]);
//}

// calculate max RAM for the buck
if (maxMoney > serverCostMulti * ramToBuy) {
    ramToBuy *= 2;

    while (maxMoney > serverCostMulti * ramToBuy) {
        ramToBuy *= 2;
    }
    ramToBuy /= 2;
}

//ramToBuy = 64;

print('Calculated: ' + ramToBuy + ' GB RAM for ' + serverCostMulti * ramToBuy + '$');

i = 0;
while (i < getPurchasedServerLimit()) {
    if (getServerMoneyAvailable("home") > getPurchasedServerCost(ramToBuy)) {
        if (!serverExists('pserv-' + i) || getServerRam('pserv-' + i)[0] < ramToBuy) {
            if (maxMoney > serverCostMulti * ramToBuy) {
                if (serverExists('pserv-' + i)) {
                    killall('pserv-' + i);
                    sleep(20 * 1000, false);
                    deleteServer('pserv-' + i);
                    sleep(5 * 1000, false);
                }

                if (!serverExists('pserv-' + i)) {
                    hostname = purchaseServer('pserv-' + i, ramToBuy);
                    if (hostname) {
                        for (j = 0; j < hackScripts.length; ++j) {
                            scp(hackScripts[j], hostname);
                        }
                        exec('_serverScripts.script', hostname);
                        ++i;
                    }
                }
            }
            sleep (500);
        } else {
            ++i;
            sleep (500);
        }
    }

    print('Bought player server #' + i + ' with ' + ramToBuy + ' GB RAM for $' + serverCostMulti * ramToBuy);
    //i = 0;
    sleep(6000);
}
