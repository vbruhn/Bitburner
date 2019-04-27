servers = ["foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"];
hackscript = "_hack_me.script";

i = 0;
while (i < servers.length) {
    serverHackLevel = getServerRequiredHackingLevel(servers[i]);
    
    //Wait for player to reach the correct hacking level
    while (getHackingLevel() < serverHackLevel) {
        sleep(20000);
    }

    //Copy our generic hacking script and weaken script over to the target server
    scp(hackscript, servers[i]);

    //NUKE the target server to gain root access
    nuke(servers[i]);
    
    //Execute our scripts on the target server
    exec(hackscript, servers[i]);

    ++i;    
}
