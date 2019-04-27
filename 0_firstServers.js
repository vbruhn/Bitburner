export async function main(ns) {
    const servers = ["foodnstuff", "sigma-cosmetics", "joesguns", "nectar-net", "hong-fang-tea", "harakiri-sushi"];
    const hackscript = "_hack_me.ns";
    var numThreads = 0;

    var i = 0;
    while (i < servers.length) {
        var serverHackLevel = ns.getServerRequiredHackingLevel(servers[i]);

        //Wait for player to reach the correct hacking level
        while (ns.getHackingLevel() < serverHackLevel) {
            await ns.sleep(10000);
        }

        //Copy our generic hacking script and weaken script over to the target server
        ns.scp(hackscript, servers[i]);
        var svRam = ns.getServerRam(servers[i]);
        var svRamAvail = svRam[0] - svRam[1];

        //NUKE the target server to gain root access
        await ns.nuke(servers[i]);

        //Execute our scripts on the target server
        numThreads = Math.round(svRamAvail / ns.getScriptRam("_hack_me.script", servers[i]) - 1);
        await ns.exec(hackscript, servers[i], numThreads);

        ++i;
    }
}
