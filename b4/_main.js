var wait = true;

async function doStats(ns) {
    let myStats = ns.getStats();

    if (myStats.hacking < 40) {
        await ns.run('1_mapServers.ns');
        ns.universityCourse("Rothman University", "Algorithms");
        while (ns.getStats().hacking < 40) {
            await ns.sleep(1000);
        }
        ns.stopAction();
        await ns.run("2_nukePossible.ns");
        while (ns.scriptRunning("2_nukePossible.ns", 'home')) {
            await ns.sleep(1000);
        }
        await ns.run('7_updateServers.ns');
    }

    if (myStats.strength < 40) {
        ns.gymWorkout("Powerhouse Gym", "str");
        while (ns.getStats().strength < 40) {
            await ns.sleep(1000);
        }
    }
    if (myStats.defense < 40) {
        ns.gymWorkout("Powerhouse Gym", "def");
        while (ns.getStats().defense < 40) {
            await ns.sleep(1000);
        }
    }
    if (myStats.dexterity < 40) {
        ns.gymWorkout("Powerhouse Gym", "dex");
        while (ns.getStats().dexterity < 40) {
            await ns.sleep(1000);
        }
    }
    if (myStats.agility < 40) {
        ns.gymWorkout("Powerhouse Gym", "agi");
        while (ns.getStats().agility < 40) {
            await ns.sleep(1000);
        }
    }
    ns.stopAction();
    wait = false;
}

export async function main(ns) {
    doStats(ns);

    while (wait) {
        await ns.sleep(2000);
    }

    var crime = 'mug';
    // purchase4SMarketData throws an exception right now (May 2019)
    var fsig = false; //ns.purchase4SMarketData();
    var fsigAPI = false; //ns.purchase4SMarketDataTixApi();
    var sma = false;
    var hServer = false; // homeScript running?
    var pServers = false; // have the pServers been bought?
    var updatedPS = false; // flag to upgrade the pServers once
    var stockMarket = false; // 4S-API-Script running?
    var hackStage = 50; // every 50 Hackinglevels, update some scripts
    var tor = false;

    while (true) {
        // Commit Crime forever ... want to open up gangs
        if (ns.getCrimeChance('homicide') > 0.9) crime = 'homicide';
        let time = ns.commitCrime(crime);
        await ns.sleep(time - 500);

        let runLoop = true; // will be set to false latest at the end of the loop
        while (runLoop) {
            // Use the money for RAM
            let myCash = ns.getServerMoneyAvailable('home');
            if (myCash > ns.getUpgradeHomeRamCost()) {
                ns.upgradeHomeRam();
            }
            // ... and ...
            /*
            // Purchase Stockmarket API 
            if (!fsig && myCash > 1000000000)
                fsig = ns.purchase4SMarketData();
            // 50 Billion: 25 for the API and 25 for the Market
            if (!fsigAPI && myCash > 50000000000)
                fsigAPI = ns.purchase4SMarketDataTixApi();
            */
            // handle scripts
            let mem = ns.getServerRam('home');
            let freeMem = mem[0] - mem[1];
            let myHL = ns.getHackingLevel();

            // start Mainscript on Homeserver
            if (!hServer & freeMem > ns.getScriptRam('9_homeDoesIt.ns')) {
                await ns.run('9_homeDoesIt.ns');
                hServer = true;
                runLoop = false;
                continue;
            }
            // buy pServers
            if ((!pServers & hServer) & freeMem > ns.getScriptRam('5_purchaseServers.ns')) {
                await ns.run('5_purchaseServers.ns');
                pServers = true;
                runLoop = false;
                continue;
            }
            // upgrade pServers once
            if ((!updatedPS & pServers) & myCash > 60000000000) {
                // home should have enough RAM by now
                await ns.run('5_purchaseServers.ns');
                updatedPS = true;
                runLoop = false;
                continue;
            }
            // nuke new servers every 50 levels in hacking
            if (myHL > hackStage) {
                hackStage += 50;
                if (!tor & myCash > 200000) ns.purchaseTor();
                ns.purchaseProgram('BruteSSH.exe');
                ns.purchaseProgram('FTPCrack.exe');
                ns.purchaseProgram('relaySMTP.exe');
                ns.purchaseProgram('HTTPWorm.exe');
                ns.purchaseProgram('SQLInject.exe');
                await ns.run("2_nukePossible.ns");
                while (ns.scriptRunning("2_nukePossible.ns", 'home')) {
                    await ns.sleep(1000);
                }
                await ns.run('7_updateServers.ns');
                runLoop = false;
                continue;
            }

            // start basic SMA-Stockmarket script
            if ((!fsigAPI & (!sma & fsig)) & myCash > 1000000000) {
                await ns.run("sma.ns");
                sma = true;
                runLoop = false;
                continue;
            }
            // start the 4S-API-Stocktrader
            if ((!stockMarket & fsigAPI) & freeMem > ns.getScriptRam('FSIG-StockTrader.ns')) {
                ns.kill('sma.ns', 'home');
                while (ns.scriptRunning("sma.ns", 'home')) {
                    await ns.sleep(1000);
                }
                await ns.run('FSIG-StockTrader.ns');
                stockMarket = true;
                runLoop = false;
                continue;
            }

            runLoop = false;
        }

        while (ns.isBusy()) {

            await ns.sleep(500);
        }
    }

}
