disableLog('ALL');

// Read the data of our client
clientData = read("best_target.txt").split(",");
clientName = clientData[0];
clientMaxMoney = getServerMaxMoney(clientName);
clientMinSecurity = clientData[5];

print("Observing: " + clientName);

while (true) {
    a = Math.round(getServerSecurityLevel(clientName));
    b = Math.round(getServerMoneyAvailable(clientName));
    
    currentMoney = b.toLocaleString(
        undefined,   // leave undefined to use the browser's locale,
                    // or use a string like 'en-US' to override it.
        { minimumFractionDigits: 2 });
    maxMoney = clientMaxMoney.toLocaleString(
        undefined,   // leave undefined to use the browser's locale,
                    // or use a string like 'en-US' to override it.
        { minimumFractionDigits: 2 });
    
    print(" ");
    print("Security-Level: " + a + " / " + clientMinSecurity);
    print("Available Money: $" + currentMoney + " / $" + maxMoney);
    
    sleep(5000);
    //clearLog();
}
