editions.push ({
	description: "An implementation of the classic property trading game by Charles Darrow",
	utiltext: '&nbsp;&nbsp;&nbsp;&nbsp;If one utility is owned rent is 4 times amount shown on dice.<br /><br />&nbsp;&nbsp;&nbsp;&nbsp;If both utilities are owned rent is 10 times amount shown on dice.',
	transtext: '<div style="font-size: 14px; line-height: 1.5;">Rent<span style="float: right;">$25.</span><br />If 2 Railroads are owned<span style="float: right;">50.</span><br />If 3 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">100.</span><br />If 4 &nbsp; &nbsp; " &nbsp; &nbsp; " &nbsp; &nbsp; "<span style="float: right;">200.</span></div>',
	houseLimit: 32,
	hotelLimit: 12,
	boardColor: "#4F64C1",
	init: function() {
		square[0] = new Square("GO");
		square[1] = new Square("Harris Street", "#5e3577", 60, 3, 2, 10, 30, 90, 160, 250);
		square[2] = new Square("Community Chest");
		square[3] = new Square("Weber Lane", "#5e3577", 60, 3, 4, 20, 60, 180, 320, 450);
		square[4] = new Square("INCOME<br>TAX");
		square[4].tax = 200;
		square[4].percentage = 10;
		square[5] = new Square("Illinois Central", null, 200, 2);
		square[6] = new Square("Sherman Street", "#d2eaf5", 100, 4, 6, 30, 90, 270, 400, 550);
		square[7] = new Square("Chance");
		square[8] = new Square("Johnson Street", "#d2eaf5", 100, 4, 6, 30, 90, 270, 400, 550);
		square[9] = new Square("Lincoln<br>Street", "#d2eaf5", 120, 4, 8, 40, 100, 300, 450, 600);
		square[10] = new Square("Just Visiting");
		square[11] = new Square("Kemp Street", "#ff60ad", 140, 5, 10, 50, 150, 450, 625, 750);
		square[12] = new Square("Electric Company", null, 150, 1);
		square[13] = new Square("McKinstry Street", "#ff60ad", 140, 5, 10, 50, 150, 450, 625, 750);
		square[14] = new Square("Dickey Street", "#ff60ad", 160, 5, 12, 60, 180, 500, 700, 900);
		square[15] = new Square("Gulf, Mobile and Ohio", null, 200, 2);
		square[16] = new Square("Walnut<br>Street", "#F28500", 180, 6, 14, 70, 200, 550, 750, 950);
		square[17] = new Square("Community Chest");
		square[18] = new Square("Spruce<br>Street", "#F28500", 180, 6, 14, 70, 200, 550, 750, 950);
		square[19] = new Square("Locust<br>Street", "#F28500", 200, 6, 16, 80, 220, 600, 800, 1000);
		square[20] = new Square("Free Parking");
		square[21] = new Square("Pine Street", "#f50c2b", 220, 7, 18, 90, 250, 700, 875, 1050);
		square[22] = new Square("Chance");
		square[23] = new Square("Chestnut Street", "#f50c2b", 220, 7, 18, 90, 250, 700, 875, 1050);
		square[24] = new Square("Elm Street", "#f50c2b", 240, 7, 20, 100, 300, 750, 925, 1100);
		square[25] = new Square("Canadian National", null, 200, 2);
		square[26] = new Square("Linden Street", "#ffed20", 260, 8, 22, 110, 330, 800, 975, 1150);
		square[27] = new Square("Cedar Street", "#ffed20", 260, 8, 22, 110, 330, 800, 975, 1150);
		square[28] = new Square("Water<br>Works", null, 150, 1);
		square[29] = new Square("Oak Street", "#ffed20", 280, 8, 24, 120, 360, 850, 1025, 1200);
		square[30] = new Square("Go to Jail");
		square[31] = new Square("Delavan Road", "#45C122", 300, 9, 26, 130, 390, 900, 1100, 1275);
		square[32] = new Square("Springfield Road", "#45C122", 300, 9, 26, 130, 390, 900, 1100, 1275);
		square[33] = new Square("Community Chest");
		square[34] = new Square("Route 122", "#45C122", 320, 9, 28, 150, 450, 1000, 1200, 1400);
		square[35] = new Square("Short Line", "#FFFFFF", 200, 2);
		square[36] = new Square("Chance");
		square[37] = new Square("Pieper Circle", "#425087", 350, 10, 35, 175, 500, 1100, 1300, 1500);
		square[38] = new Square("LUXURY<br>TAX");
		square[38].tax = 75;
		square[39] = new Square("Heritage Lane", "#425087", 400, 10, 50, 200, 600, 1400, 1700, 2000);

		communityChestCards[0] = new CommunityChestCard("Advance to \"GO\".", function() { advance(0);});
		communityChestCards[1] = new CommunityChestCard("You have won second prize in a beauty contest. Collect $11.", function() { addamount(11, 'Community Chest');});
		communityChestCards[2] = new CommunityChestCard("GET OUT OF JAIL FREE. This card may be kept until needed or traded.", function() { receivecard('communityChestJailCard');});
		communityChestCards[3] = new CommunityChestCard("From sale of stock, you get $45.", function() { addamount(45, 'Community Chest');});
		communityChestCards[4] = new CommunityChestCard("We're off the gold standard. Collect $50.", function() { addamount(50, 'Community Chest');});
		communityChestCards[5] = new CommunityChestCard("Doctor's fee. Pay $50.", function() { subtractamount(50, 'Community Chest');});
		communityChestCards[6] = new CommunityChestCard("You inherit $100.", function() { addamount(100, 'Community Chest');});
		communityChestCards[7] = new CommunityChestCard("Go back to Weber Lane.", function() { gobackto(3);});
		communityChestCards[8] = new CommunityChestCard("Pay hospital $100.", function() { subtractamount(100, 'Community Chest');});
		communityChestCards[9] = new CommunityChestCard("Income tax refund. Collect $20.", function() { addamount(20, 'Community Chest');});
		communityChestCards[10] = new CommunityChestCard("Life insurance matures. Collect $100.", function() { addamount(100, 'Community Chest');});
		communityChestCards[11] = new CommunityChestCard("Receive for services $25.", function() { addamount(25, 'Community Chest');});
		communityChestCards[12] = new CommunityChestCard("<a href='javascript:void' onclick='takeChanceInsteadOfFine()'>Take a Chance</a> or pay a $10 fine.", function() { fineordraw(10);});
		communityChestCards[13] = new CommunityChestCard("Go to jail.", function() { gotojail();});
		communityChestCards[14] = new CommunityChestCard("Pay your insurance premium of $50.", function() { subtractamount(50, 'Community Chest');});
		communityChestCards[15] = new CommunityChestCard("Bank error in your favor. Collect $200.", function() { addamount(200, 'Community Chest');});
//		communityChestCards[16] = new CommunityChestCard("It is your birthday. Collect $10 from every player.", function() { collectfromeachplayer(10, 'Community Chest');});


		chanceCards[0] = new ChanceCard("GET OUT OF JAIL FREE<br>This card may be kept until needed or traded.", function(p) { receivecard('chanceJailCard');});
		chanceCards[1] = new ChanceCard("You are assessed for street repairs.<br>$40 per House<br>$115 per Hotel", function() { streetrepairs(40, 115);});
		chanceCards[2] = new ChanceCard("Stroll down Heritage Lane.", function() { advance(39);});
		chanceCards[3] = new ChanceCard("Make a call on Elm Street.", function() { advance(24);});
		chanceCards[4] = new ChanceCard("Make general repairs on all your property.<br>For each house pay $25.<br>For each hotel pay $100.", function() { streetrepairs(25, 100);});
		chanceCards[5] = new ChanceCard("Go to jail.", function() { gotojail();});
		chanceCards[6] = new ChanceCard("Advance to \"GO\".", function() { advance(0);});
		chanceCards[7] = new ChanceCard("Your holiday fund matures. Collect $100.", function() { addamount(100, 'Chance');});
		chanceCards[8] = new ChanceCard("Pay poor tax of $12.", function() { subtractamount(12, 'Chance');});
		chanceCards[9] = new ChanceCard("Go back three spaces.", function() { skipspaces(-3);});
		chanceCards[10] = new ChanceCard("Bank pays you dividend of $50.", function() { addamount(50, 'Chance');});
		chanceCards[11] = new ChanceCard("Pay school tax of $150.", function() { subtractamount(150, 'Chance');});
		chanceCards[12] = new ChanceCard("Your building loan matures. Collect $150.", function() { addamount(150, 'Chance');});
		chanceCards[13] = new ChanceCard("Visit Kemp Street.", function() { advance(11);});
		chanceCards[14] = new ChanceCard("Parking Fine - $15.", function() { subtractamount(15, 'Chance');});
		chanceCards[15] = new ChanceCard("Take a ride on the Illinois Central Railroad.", function() { advance(5);});
		//chanceCards[16] = new ChanceCard("You have been elected chairman of the board. Pay each player $50.", function() { payeachplayer(50, 'Chance');});
		//chanceCards[17] = new ChanceCard("ADVANCE TO THE NEAREST UTILITY. IF UNOWNED, you may buy it from the Bank. IF OWNED, throw dice and pay owner a total ten times the amount thrown.", function() { advanceToNearestUtility();});
		//chanceCards[18] = new ChanceCard("ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.", function() { advanceToNearestRailroad();});
		//chanceCards[19] = new ChanceCard("ADVANCE TO THE NEAREST RAILROAD. If UNOWNED, you may buy it from the Bank. If OWNED, pay owner twice the rental to which they are otherwise entitled.", function() { advanceToNearestRailroad();});
	}
});