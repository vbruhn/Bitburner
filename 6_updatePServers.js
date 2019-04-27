export async function main(ns) {
    const hackScripts = ["_singleHack.ns", "_singleGrow.ns", "_singleWeaken.ns", 
        "_serverScripts.ns", "best_target.txt", "_permaWeaken.ns"];

    ns.tprint("Sending Scripts and Target to P-Servers!");

    var i = 0;
    while (i < ns.getPurchasedServerLimit()) {
        var target = "pserv-" + i;

        if (ns.serverExists(target)) {
            ns.killall(target);
            await ns.sleep(6000);

            for (let j = 0; j < hackScripts.length; ++j) {
                ns.scp(hackScripts[j], target);
            }
            if (i === 0) {
                var memory = ns.getServerRam(target);
                var availableMem = memory[0] - memory[1];
                var numThreads = Math.round(availableMem / ns.getScriptRam("_permaWeaken.ns", target) - 1);
                await ns.exec("_permaWeaken.ns", target, numThreads);
            } else {
                await ns.exec("_serverScripts.ns", target);
            }
        }
        ++i;
        await ns.sleep(500);
    }
    ns.tprint("P-Servers updated!");
}
