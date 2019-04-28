export async function main(ns) {
    var hackScripts = ["best_target.txt", "_permaWeaken.ns"];

    var nukedServers = ns.read("nukedServers.txt").split(",");
    var target = "";
    var memory = 0;
    var availableMem = 0;
    
    for (let i = 0; i < nukedServers.length; ++i) {
        if (nukedServers[i].length < 1) { break; }

        target = nukedServers[i];
        await ns.killall(target);
    }
    while (ns.scriptRunning(hackScripts[1], target)) { await ns.sleep(150); }

    for (let i = 0; i < nukedServers.length; ++i) {
        if (nukedServers[i].length < 1) { break; }
        
        target = nukedServers[i];

        for (let j = 0; j < hackScripts.length; ++j) {
            ns.scp(hackScripts[j], target);
        }

        memory = ns.getServerRam(target);
        availableMem = memory[0] - memory[1];
        if (availableMem > 8) {
            var numThreads = Math.round(availableMem / ns.getScriptRam("_permaWeaken.ns", target) - 1);
            await ns.exec("_permaWeaken.ns", target, numThreads);
        }
    }
}
