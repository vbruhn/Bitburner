
export async function main(ns) {

    //while (ns.getServerMoneyAvailable("home") < 2000000) {
    while(true) {
        var time = ns.commitCrime("mug");
        await ns.sleep(time);
        while (ns.isBusy()) {
            await ns.sleep(500);
        }
    }
}
