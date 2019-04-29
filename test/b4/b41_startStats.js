export async function main(ns) {
    // script to start /b4/0_Dummy.ns
    // opening a prompt to kill the script

    await ns.run("_b4_1_Stats.ns", 1);

    await ns.sleep(10000);

    var stopScript = false;
    while (true) {
        stopScript = await ns.prompt("YES: Stop this script! ... \r\nNO: Hide this prompt for 30 seconds! ...");
        if (stopScript) {
            ns.kill("_b4_1_Stats.ns", ns.getHostname());
            ns.stopAction();
            break;
        }
        await ns.sleep(30 * 1000);
    }
}
