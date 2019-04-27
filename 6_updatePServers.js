export async function main(ns) {
    const hackScripts = ["_singleHack.ns", "_singleGrow.ns", "_singleWeaken.ns",
        "_serverScripts.ns", "best_target.txt", "_permaWeaken.ns"
    ];

    ns.tprint("Sending Scripts and Target to P-Servers!");

    var i = 0;
    var target = "";
    var memory = 0;
    var availableMem = 0;
    var numThreads = 0;

    // kill all processes
    while (i < ns.getPurchasedServerLimit()) {
        target = "pserv-" + i;

        if (ns.serverExists(target)) {
            ns.killall(target);
        }
        ++i;
    }
    await ns.sleep(6000);

    i = 0;
    while (i < ns.getPurchasedServerLimit()) {
        target = "pserv-" + i;

        if (ns.serverExists(target)) {

            for (let j = 0; j < hackScripts.length; ++j) {
                ns.scp(hackScripts[j], target);
            }
            if (i === 0) {
                memory = ns.getServerRam(target);
                availableMem = memory[0] - memory[1];
                numThreads = Math.round(availableMem / ns.getScriptRam("_permaWeaken.ns", target) - 1);
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
