// Startup script to get some stats

export async function main(ns) {
    myStats = ns.getStats();
    // study
    if (myStats.hacking < 40) {
        if (myStats.city != "Volhaven") {
            ns.travelToCity("Volhaven");
        }
        ns.travelToCity("Volhaven");
        ns.universityCourse("ZB Institute of Technology", "Algorithms");
        while (ns.getStats().hacking < 40) {
            await ns.sleep(1000);
        }
    }
    ns.stopAction();

    // workout
    if (myStats.strength < 40) {
        if (myStats.city != "Sector-12") {
            ns.travelToCity("Sector-12");
        }
        ns.gymWorkout("Powerhouse Gym", "str");
        while (ns.getStats().strength < 40) {
            await ns.sleep(1000);
        }
    }
    if (myStats.defense < 40) {
        if (myStats.city != "Sector-12") {
            ns.travelToCity("Sector-12");
        }
        ns.gymWorkout("Powerhouse Gym", "def");
        while (ns.getStats().defense < 40) {
            await ns.sleep(1000);
        }
    }
    if (myStats.dexterity < 40) {
        if (myStats.city != "Sector-12") {
            ns.travelToCity("Sector-12");
        }
        ns.gymWorkout("Powerhouse Gym", "dex");
        while (ns.getStats().dexterity < 40) {
            await ns.sleep(1000);
        }
    }
    if (myStats.agility < 40) {
        if (myStats.city != "Sector-12") {
            ns.travelToCity("Sector-12");
        }
        ns.gymWorkout("Powerhouse Gym", "agi");
        while (ns.getStats().agility < 40) {
            await ns.sleep(1000);
        }
    }
    ns.stopAction();
}
