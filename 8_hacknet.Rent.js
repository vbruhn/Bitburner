// Original here: https://www.reddit.com/r/Bitburner/comments/71sxly/hacknet_nodes_script_optimalish_calcs/

export async function main(ns) {
    //1% of current funds, per cycle.
    const allowancePercentage = 0.01;
    
    
    
    while (true) {
        for (let i = 0; i < ns.hacknet.numNodes(); i++) {
            var gain = [0, 0, 0];
            var currentCash = ns.getServerMoneyAvailable('home');
            var currentCash = currentCash * allowancePercentage;

            if (ns.hacknet.getPurchaseNodeCost() <= currentCash) {
                ns.hacknet.purchaseNode();
            }

            var node = ns.hacknet.getNodeStats(i);

            if (node.level < 200) {
                gain[0] = ((node.level + 1) * 1.6) * Math.pow(1.035, (node.ram - 1)) * ((node.cores + 5) / 6) / ns.hacknet.getLevelUpgradeCost(i, 1);
            } else {
                gain[0] = 0;
            }

            if (node.ram < 64) {
                gain[1] = (node.level * 1.6) * Math.pow(1.035, (node.ram * 2) - 1) * ((node.cores + 5) / 6) / ns.hacknet.getRamUpgradeCost(i, 1);
            } else {
                gain[1] = 0;
            }

            if (node.cores < 16) {
                gain[2] = (node.level * 1.6) * Math.pow(1.035, node.ram - 1) * ((node.cores + 6) / 6) / ns.hacknet.getCoreUpgradeCost(i, 1);
            } else {
                gain[2] = 0;
            }

            ns.print('Level Upgrade:  ' + gain[0]);
            ns.print('Ram Upgrade:  ' + gain[1]);
            ns.print('Core Upgrade:  ' + gain[2]);

            var topgain = 0;

            for (let j = 0; j < 3; j++) {
                if (gain[j] > topgain) {
                    topgain = gain[j];
                }
            }

            if (topgain === 0) {
                ns. print('All Gains maxed on Node' + i);
                break;
            }

            if (topgain == gain[0] && ns.hacknet.getLevelUpgradeCost(i, 1) < currentCash) {
                ns.print('Upgrading Level on Node' + i);
                ns.hacknet.upgradeLevel(i, 1);
            } else if (topgain == gain[1] && ns.hacknet.getRamUpgradeCost(i, 1) < currentCash) {
                ns.print('Upgrading Ram on Node' + i);
                ns.hacknet.upgradeRam(i, 1);
            } else if (topgain == gain[2] && ns.hacknet.getCoreUpgradeCost(i, 1) < currentCash) {
                ns.print('Upgrading Core on Node' + i);
                ns.hacknet.upgradeCore(i, 1);
            } else {
                ns.print('Cannot afford upgrades on Node' + i);
            }
        }
        await ns.sleep(1000);
    }
}
