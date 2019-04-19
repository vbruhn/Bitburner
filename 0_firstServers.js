servers = ["foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"];
hackscript = "_hack_me.script";

i = 0;
while (i < servers.length) {
    //Wait for player to reach the correct hacking level
    while (getHackingLevel() < getServerRequiredHackingLevel(servers[i])) {
        sleep(20000);
    }

    //Copy our generic hacking script and weaken script over to the target server
    scp(hackscript, servers[i]);
    
    //NUKE the target server to gain root access
    nuke(servers[i]);
    
    //Execute our scripts on the target server
    if (servers[i] == "joesguns") {
        exec(hackscript, servers[i], 4, servers[i], 50000000, 10);
    } else {
        exec(hackscript, servers[i], 4, servers[i], 2000000, 10);
    }
    exec(weakenscript, servers[i], 1, servers[i]);

    ++i;    
}
