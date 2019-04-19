clientName = args[0];
money_target = args[1];
sec_target = args[2];

while(true) {
    print(" ");
    
    currentSecLevel = Math.round(getServerSecurityLevel(clientName));
    currentDollars = Math.round(getServerMoneyAvailable(clientName));
    
    print("Current Sec-Lvl: " + currentSecLevel + " / " + sec_target);
    print("Current Money: " + currentDollars + " / " + money_target);
    
    if (currentSecLevel > sec_target) {
        //If the server's security level is above our threshold, weaken it
        weaken(clientName);
    } else if (currentDollars < money_target) {
        //If the server's money is less than our threshold, grow it
        grow(clientName);
    } else {
        //Otherwise, hack it
        hack(clientName);
    }
}
