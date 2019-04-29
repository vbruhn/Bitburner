export async function main(ns) {
    // script to start /b4/0_Dummy.ns
    // opening a prompt to kill the script
    
    await ns.run("_b4_0_Crime.ns", 1);
    
    await ns.sleep(10000);
    
    await ns.prompt("Whatever you press, the script will stop!");
    ns.kill("_b4_0_Crime.ns", ns.getHostname());
}
