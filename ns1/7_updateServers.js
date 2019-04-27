// this script uses nuked servers to weaken your Target-Server

hackScripts = ["best_target.txt", "_permaWeaken.script"];

var hackedServers = read("hacked.txt").split(",");

for (i = 0; i < hackedServers.length; ++i) {
    if (hackedServers[i].length < 1) { break; }

    var target = hackedServers[i];
    killall(target);
    sleep(5000);

    for (j = 0; j < hackScripts.length; ++j) {
        scp(hackScripts[j], target);
    }

    var memory = getServerRam(target);
    var availableMem = memory[0] - memory[1];
    if (availableMem > 0) {
        var numThreads = Math.round(availableMem / getScriptRam("_permaWeaken.script", target) - 1);
        exec("_permaWeaken.script", target, numThreads);
    }
}
