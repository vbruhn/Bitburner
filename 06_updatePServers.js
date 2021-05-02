export async function main(ns) {
    const hackScripts = ["_singleHack.ns", "_singleGrow.ns", "_singleWeaken.ns",
        "_serverScripts.ns", "best_target.txt", "_permaWeaken.ns"
    ];

    var servers = ns.getPurchasedServers(true);

    var serverRam = 0;
    var availRAM = 0;
    var scriptRam = 0;
    var numThreads = 0;
    var prevRAM = 2.75;

    for (let i = 0; i < servers.length; i++) {
        await ns.killall(servers[i]);
        await ns.sleep(500);

        serverRam = ns.getServerRam(servers[i]);
        availRAM = serverRam[0] - serverRam[1];
        scriptRam = ns.getScriptRam("_permaWeaken.ns");
        
        if (scriptRam == 0) scriptRam = prevRAM;
        prevRAM = scriptRam;
        
        numThreads = Math.round(availRAM / scriptRam / 3);
        if (numThreads < 1) numThreads = 1;

        ns.print(`Server ${servers[i]} with ${availRAM}GB available RAM will start the 'Weaken'-Script with ${numThreads} Threads.`);
        ns.print(`The script uses ${scriptRam}GB RAM.`);
        hackScripts.forEach((script) => {
            ns.scp(script, servers[i]);
        });
        await ns.exec("_permaWeaken.ns", servers[i], numThreads);
        while (ns.scriptRunning("_permaWeaken.ns", servers[i]) == false) { await ns.sleep(100); }
        
        await ns.exec("_serverScripts.ns", servers[i]);
    }
}
