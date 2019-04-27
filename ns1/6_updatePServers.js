hackScripts = ["_singleHack.script", "_singleGrow.script", "_singleWeaken.script", "_serverScripts.script", "best_target.txt"];

tprint("Sending Scripts and Target-File to P-Servers!");

i = 0;
while (i < getPurchasedServerLimit()) {
    target = "pserv-" + i;

    if (serverExists(target)) {
        killall(target);
        sleep(6000);

        for (j = 0; j < hackScripts.length; ++j) {
            scp(hackScripts[j], target);
        }
        exec("_serverScripts.script", target);
    }
    ++i;
    sleep(500);
}
tprint("P-Servers updated!");
