// This script makes a catalogue of all servers in the network
// should be run before buying P-Servers!!!

servers = ["home"];
clear("servers.txt");

for (i = 0; i < servers.length; ++i) {
    hostname = servers[i];
    print(hostname + " logged.");
    write("servers.txt", hostname +
        "," + getServerRam(hostname)[0] +
        "," + getServerNumPortsRequired(hostname) +
        "," + getServerRequiredHackingLevel(hostname) +
        "," + getServerMaxMoney(hostname) +
        "," + getServerMinSecurityLevel(hostname) +
        "," + getServerGrowth(hostname) +
        "\r\n");

    newScan = scan(hostname);
    for (j = 0; j < newScan.length; j++) {
        if (servers.indexOf(newScan[j]) == -1) {
            servers.push(newScan[j]);
        }
    }
}
tprint("Network mapped.");
