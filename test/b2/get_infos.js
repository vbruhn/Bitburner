var equipNames = gang.getEquipmentNames();
var Equipments =[];

for (i = 0; i < equipNames.length; ++i) {
    eName = equipNames[i];
    eCost = gang.getEquipmentCost(eName);
    Equipments[i] = {
        name:eName,
        cost:eCost
    };
    tprint(Equipments[i].name + ": " + Equipments[i].cost);
}
