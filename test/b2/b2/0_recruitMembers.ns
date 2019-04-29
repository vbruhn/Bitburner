export async function main(ns) {
    var memberNames = ns.gang.getMemberNames();
    var memberCount = memberNames.length;
    var name = "";
    
    var taskNames = ns.gang.getTaskNames();
    
    while (memberCount < 30) {
        if(ns.gang.canRecruitMember()) {
            memberCount++;
            name = memberCount.toString();
            ns.gang.recruitMember(name);
            ns.gang.setMemberTask(name, "Train Hacking");
        }
        
        await ns.sleep(5000);
    }
}
