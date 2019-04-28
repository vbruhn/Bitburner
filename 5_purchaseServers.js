export async function main(ns) {
    const hackScripts = ["_singleHack.ns", "_singleGrow.ns", "_singleWeaken.ns",
        "_serverScripts.ns", "best_target.txt"
    ];

    const serverCostMulti = 55000;
    const maxMoney = ns.getServerMoneyAvailable('home') / 25;
    const maxRam = ns.getPurchasedServerMaxRam('home');

    // get servers with the minimum, predefined amount, but check if there is already
    // a higher configured pserv
    var pServer = "";
    var ramToBuy = 16;

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

    ns.print('Calculated: ' + ramToBuy + ' GB RAM for ' + serverCostMulti * ramToBuy + '$');

    const maxNumServers = ns.getPurchasedServerLimit();
    const serverCost = ns.getPurchasedServerCost(ramToBuy);

    var i = 0;
    while (i < maxNumServers) {
        if (ns.getServerMoneyAvailable("home") > serverCost) {
            if (!ns.serverExists('pserv-' + i) || ns.getServerRam('pserv-' + i)[0] < ramToBuy) {
                //if (maxMoney > serverCostMulti * ramToBuy) {
                if (ns.serverExists('pserv-' + i)) {
                    ns.killall('pserv-' + i);
                    await ns.sleep(8000);
                    ns.deleteServer('pserv-' + i);
                    await ns.sleep(5000);
                }

                if (!ns.serverExists('pserv-' + i)) {
                    pServer = ns.purchaseServer('pserv-' + i, ramToBuy);
                    if (pServer) {

                        // run only the permaWeakenScript on pserv-0
                        // remove the part from ... (i === 0) ... to ... } else
                        // if you want all servers to rotate through the 
                        // weaken / grow / hack scripts
                        if (i === 0) {
                            ns.scp("_permaWeaken.ns", pServer);
                            ns.scp("best_target.txt", pServer);
                            var pnumThreads = Math.round(ramToBuy / ns.getScriptRam("_permaWeaken.ns", pServer) - 1);
                            await ns.exec("_permaWeaken.ns", pServer, pnumThreads);
                        } else {
                            for (let j = 0; j < hackScripts.length; ++j) {
                                ns.scp(hackScripts[j], pServer);
                            }
                            await ns.exec('_serverScripts.ns', pServer);
                        }
                        ns.print('Bought player server #' + i + ' with ' + ramToBuy + ' GB RAM for $' + serverCostMulti * ramToBuy);
                        ++i;
                    }
                }
                await ns.sleep(500);
            } else {
                ++i;
                await ns.sleep(500);
            }
        }
        await ns.sleep(500);
    }
}
