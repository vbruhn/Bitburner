clear("hacked.txt");

numBusters = 0;
portBusters = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
for (i = 0; i < portBusters.length; i++) {
    if (fileExists(portBusters[i], "home")) {
        tprint(portBusters[i] + " exists");
        ++numBusters;
    } else
        tprint(portBusters[i] + " missing");
}

myHackLevel = getHackingLevel();
bestTargetIndex = 1;
bestTargetScore = 0;
rows = read("servers.txt").split("\r\n");

for (i = 0; i < rows.length; ++i) {
    serverData = rows[i].split(',');
    if (serverData.length < 7) break; //Ignore last blank row

    svName = serverData[0];
    svRamAvail = serverData[1];
    svPortsNeeded = serverData[2];
    svHackLevel = serverData[3];

    //tprint("Testing " + svName);

    if (!(hasRootAccess(svName)) &&
        (numBusters >= svPortsNeeded) &&
        (myHackLevel >= svHackLevel)) {

        if (numBusters > 0) brutessh(svName);
        if (numBusters > 1) ftpcrack(svName);
        if (numBusters > 2) relaysmtp(svName);
        if (numBusters > 3) httpworm(svName);
        if (numBusters > 4) sqlinject(svName);

        nuke(svName);
        tprint("Server nuked: " + svName);
    }
    if (hasRootAccess(svName)) {
        svMaxMoney = serverData[4];
        svMinSec = serverData[5];
        svGrowRt = serverData[6];
        svExecTime = getHackTime(svName);
        svScore = (100 - (svMinSec * 1.5)) * svMaxMoney * svGrowRt / svExecTime;
        if (svScore > bestTargetScore) {
            bestTargetScore = svScore;
            bestTargetIndex = i;
        }
        if (svRamAvail > 0 && svMaxMoney > 0) {
            write("hacked.txt", svName + ",");
            if (!scriptRunning("_hack_me.script", svName)) {
                scp("_hack_me.script", svName);
                numThreads = Math.floor(svRamAvail/getScriptRam("_hack_me.script",svName)-1);
                exec("_hack_me.script",svName,numThreads);
            }
        }
    }
    //tprint("Done Testing " + svName);
}
write("best_target.txt", rows[bestTargetIndex], "w");
tprint("Best target:" + rows[bestTargetIndex]);
