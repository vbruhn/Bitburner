hackScripts = ["_hack.script", "_weaken.script"];
host = getHostname();
hack_mem = getScriptRam(hackScripts[0], host);
Ram = getServerRam(host);
freeRam = Ram[0] - Ram[1];

bestTarget = read("best_target.txt").split(",");
tName = bestTarget[0];
tMaxMoney = bestTarget[4];
tMinSec = bestTarget[5];

money_target = 0.75 * tMaxMoney;
sec_level = (tMinSec - 0) + 5; //-0 to convert string to number

maxInstances = 20;
maxThreads = Math.round(freeRam / (maxInstances  + 1) / hack_mem - 1);

run(hackScripts[1], maxThreads, tName);

step = 1;

for (i = 0; i < maxInstances; i++) {
    run(hackScripts[0], maxThreads, tName, money_target, sec_level);
    money_target = money_target - step;
    sleep(1000);
}
tprint(getHostname() + " started " + maxInstances  + " Hackscripts, each with " + maxThreads + " Threads.");
