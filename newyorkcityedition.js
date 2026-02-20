editions.push ({
	description: "New York City Edition",
	utiltext: '&nbsp;&nbsp;&nbsp;&nbsp;If one "Utility" is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both "Utilitys" are owned rent is 10 times amount shown on dice.',
	transtext: '<div style="font-size: 14px; line-height: 1.5;">Rent<span style="float: right;">$25.</span><br />If 2 Transportations are owned<span style="float: right;">50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>',
	houseLimit: 40,
	hotelLimit: 16,
	init: function() {
		square[0] = new Square("GO");
		square[1] = new Square("Port Authority Bus Terminal", "#4B0082", 60, 3, 2, 10, 30, 90, 160, 250);
		square[2] = new Square("Community Chest");
		square[3] = new Square("Lincoln Tunnel", "#4B0082", 60, 3, 4, 20, 60, 180, 320, 450);
		square[4] = new Square("CITY TAX");
		square[4].tax = 200;
		square[4].percentage = 10;
		square[5] = new Square("LOMTO", null, 200, 2);
		square[6] = new Square("Statue of Liberty", "#AACCFF", 100, 4, 6, 30, 90, 270, 400, 550);
		square[7] = new Square("Chance");
		square[8] = new Square("Empire State Building", "#AACCFF", 100, 4, 6, 30, 90, 270, 400, 550);
		square[9] = new Square("Central Park", "#AACCFF", 120, 4, 8, 40, 100, 300, 450, 600);
		square[10] = new Square("Just Visiting");
		square[11] = new Square("98.7 Kiss FM", "purple", 140, 5, 10, 50, 150, 450, 625, 750);
		square[12] = new Square("Con Edison Electric", null, 150, 1);
		square[13] = new Square("Thirteen WNET", "purple", 140, 5, 10, 50, 150, 450, 625, 750);
		square[14] = new Square("The New York Times", "purple", 160, 5, 12, 60, 180, 500, 700, 900);
		square[15] = new Square("New York City Transit", null, 200, 2);
		square[16] = new Square("New York Rangers", "orange", 180, 6, 14, 70, 200, 550, 750, 950);
		square[17] = new Square("Community Chest");
		square[18] = new Square("New York Knicks", "orange", 180, 6, 14, 70, 200, 550, 750, 950);
		square[19] = new Square("Madison Square Garden", "orange", 200, 6, 16, 80, 220, 600, 800, 1000);
		square[20] = new Square("Free Parking");
		square[21] = new Square("macy*s", "red", 220, 7, 18, 90, 250, 700, 875, 1050);
		square[22] = new Square("Chance");
		square[23] = new Square("FAO Schwarz", "red", 220, 7, 18, 90, 250, 700, 875, 1050);
		square[24] = new Square("blooming-dale's", "red", 240, 7, 20, 100, 300, 750, 925, 1100);
		square[25] = new Square("Metro&ndash;North Railroad", null, 200, 2);
		square[26] = new Square("Deloitte & Touche LLP", "yellow", 260, 8, 22, 110, 330, 800, 975, 1150);
		square[27] = new Square("SmithBarney", "yellow", 260, 8, 22, 110, 330, 800, 975, 1150);
		square[28] = new Square("Con Edison Gas", null, 150, 1);
		square[29] = new Square("CITIBANK", "yellow", 280, 8, 24, 120, 360, 850, 1025, 1200);
		square[30] = new Square("Go to Jail");
		square[31] = new Square("The Regency Hotel", "green", 300, 9, 26, 130, 390, 900, 1100, 1275);
		square[32] = new Square("Essex House", "green", 300, 9, 26, 130, 390, 900, 1100, 1275);
		square[33] = new Square("Community Chest");
		square[34] = new Square("The Plaza", "green", 320, 9, 28, 150, 450, 1000, 1200, 1400);
		square[35] = new Square("United Airlines", null, 200, 2);
		square[36] = new Square("Chance");
		square[37] = new Square("Tiffany & CO.", "blue", 350, 10, 35, 175, 500, 1100, 1300, 1500);
		square[38] = new Square("LUXURY TAX");
		square[38].tax = 75;
		square[39] = new Square("TRUMP TOWER", "blue", 400, 10, 50, 200, 600, 1400, 1700, 2000);

		communityChestCards[0] = new CommunityChestCard("GET OUT OF JAIL FREE. This card may be kept until needed or traded.", function() { receivecard('communityChestJailCard');});
		communityChestCards[1] = new CommunityChestCard("You have won lifetime home delivery of the New York Times. Collect $10", function() { addamount(10, 'Community Chest');});
		communityChestCards[2] = new CommunityChestCard("From sale of Macy's stock, you get $45", function() { addamount(45, 'Community Chest');});
		communityChestCards[3] = new CommunityChestCard("Life insurance matures. Collect $100", function() { addamount(100, 'Community Chest');});
		communityChestCards[4] = new CommunityChestCard("Deloitte & Touche LLP tax return Collect $20", function() { addamount(20, 'Community Chest');});
		communityChestCards[5] = new CommunityChestCard("FAO Schwarz Xmas fund matures. Collect $100", function() { addamount(100, 'Community Chest');});
		communityChestCards[6] = new CommunityChestCard("You have won a United Airlines trip around the world! Collect $100", function() { addamount(100, 'Community Chest');});
		communityChestCards[7] = new CommunityChestCard("Performed a wedding at the Plaza Hotel. Receive $25", function() { addamount(25, 'Community Chest');});
		communityChestCards[8] = new CommunityChestCard("Pay hospital $100", function() { subtractamount(100, 'Community Chest');});
		communityChestCards[9] = new CommunityChestCard("You won the Lottery! Collect $200", function() { addamount(200, 'Community Chest');});
		communityChestCards[10] = new CommunityChestCard("Pay school tax of $150", function() { subtractamount(150, 'Community Chest');});
		communityChestCards[11] = new CommunityChestCard("Doctor's fee. Pay $50", function() { subtractamount(50, 'Community Chest');});
		communityChestCards[12] = new CommunityChestCard("Madison Square Garden opening tonight. Collect $50 from every player for opening night seats.", function() { collectfromeachplayer(50, 'Community Chest');});
		communityChestCards[13] = new CommunityChestCard("You have won kiss cash! Advance to GO (Collect $200)", function() { advance(0);});
		communityChestCards[14] = new CommunityChestCard("You are assessed for street repairs. $40 per house. $115 per hotel.", function() { streetrepairs(40, 115);});
		communityChestCards[15] = new CommunityChestCard("Go to Jail. Go directly to Jail. Do not pass GO. Do not collect $200.", function() { gotojail();});


		chanceCards[0] = new ChanceCard("GET OUT OF JAIL FREE. This card may be kept until needed or traded.", function(p) { receivecard('chanceJailCard');});
		chanceCards[1] = new ChanceCard("Make general repairs on all your property. For each house pay $25. For each hotel $100.", function() { streetrepairs(25, 100);});
		chanceCards[2] = new ChanceCard("Pay poor tax of $15.", function() { subtractamount(15, 'Chance');});
		chanceCards[3] = new ChanceCard("You have been elected chairman of Con Edison. Pay each player $50.", function() { payeachplayer(50, 'Chance');});
		chanceCards[4] = new ChanceCard("Go back 3 spaces.", function() { gobackthreespaces();});
		chanceCards[5] = new ChanceCard("Advance token to the nearest Con Edison utility. If UNOWNED you may buy it from the bank. If OWNED, throw dice and pay owner a total of ten times the amount thrown.", function() { advanceToNearestUtility();});
		chanceCards[6] = new ChanceCard("Citibank pays you interest of $50.", function() { addamount(50, 'Chance');});
		chanceCards[7] = new ChanceCard("Advance token to the nearest Transportation and pay owner Twice the Rental to which they are otherwise entitled. If Transportation is unowned, you may buy it from the Bank.", function() { advanceToNearestRailroad();});
		chanceCards[8] = new ChanceCard("Take a walk past The Essex House. Advance to GO. Collect $200.", function() { advance(0,32);});
		chanceCards[9] = new ChanceCard("Take a ride to the Regency Hotel! If you pass GO collect $200.", function() { advance(31);});
		chanceCards[10] = new ChanceCard("Take a walk on fifth avenue. Advance token to Trump Tower.", function() { advance(39);});
		chanceCards[11] = new ChanceCard("Advance to thirteen.", function() { advance(13);});
		chanceCards[12] = new ChanceCard("Your Smith Barney mutual fund pays dividend. Collect $150.", function() { addamount(150, 'Chance');});
		chanceCards[13] = new ChanceCard("Advance token to the nearest Transportation and pay owner Twice the Rental to which they are otherwise entitled.\n\nIf Transportation is unowned, you may buy it from the Bank.", function() { advanceToNearestRailroad();});
		chanceCards[14] = new ChanceCard("Catch a bus to Central Park. If you pass GO, collect $200.", function() { advance(9);});
		chanceCards[15] = new ChanceCard("Go directly to Jail. Do not pass GO, do not collect $200.", function() { gotojail();});
	}
});