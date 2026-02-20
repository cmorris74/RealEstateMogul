/* Complete source code at https://github.com/cmorris74/RealEstateMogul */

function ClaridgeBot(p) {
	this.name = "ClaridgeBot AI";

	this.proposedTrades = "#";
	
	this.getPropertiesByGroup = function(group) {
		var properties = [];
		for (var i = 0; i < 40; i++) {
			if (square[i].groupNumber == group) {
				properties.push(i);
			}
		}
		return properties;
	}

	// Decide whether to buy a property the AI landed on.
	// Return: boolean (true to buy).
	// Arguments:
	// index: the property's index (0-39).
	this.buyProperty = function(index) {
		var s = square[index];

		if (p.money > s.price + 50) {
			return true;
		} else {
			return false;
		}
	}

	// Determine the response to an offered trade.
	// Return: boolean/instanceof Trade: a valid Trade object to counter offer (with the AI as the recipient); false to decline; true to accept.
	// Arguments:
	// tradeObj: the proposed trade, an instanceof Trade, with the AI as the recipient.
	this.acceptTrade = function(tradeObj) {
		var money = tradeObj.getMoney();
		var initiator = tradeObj.getInitiator();
		var recipient = tradeObj.getRecipient();
		var evaluator = recipient.index;
		var opponent = initiator.index;
		var lose = -1;
		var gain = 1;
		var property = [];
		var propertiesGained = [];
		var propertiesLost = [];
		var groupsOfPropertiesLost = [];
		for (var i = 0; i < 40; i++) {
			property[i] = tradeObj.getProperty(i);
			if (property[i] == lose) {
				propertiesLost.push(i);
				var found = false;
				for (j = 0; j < groupsOfPropertiesLost.length; j++) {
					if (square[i].groupNumber == groupsOfPropertiesLost[j]) {
						found = true;
					}
				}
				if (!found) {
					groupsOfPropertiesLost.push(square[i].groupNumber);
				}
			}
			if (property[i] == gain) {
				propertiesGained.push(i);
			}
		}

		var gainOrLoss = 0;
		var opponentGainOrLoss = 0;
		if (tradeObj.getCommunityChestJailCard()) {
			gainOrLoss += 25;
			opponentGainOrLoss -= 25;
		}
		if (tradeObj.getChanceJailCard()) {
			gainOrLoss += 25;
			opponentGainOrLoss -= 25;
		}

		gainOrLoss += money;
		opponentGainOrLoss -= money;
		
		if (propertiesGained.length == 0) {
			var mortgageValue = 0;
			var percent = 0;
			for (var i = 0; i < 40; i++) {
				if (property[i] == lose) {
					percent += square[i].price / 10;
					if (!square[i].mortgage) {
						mortgageValue += square[i].price / 2;
					}
				}
			}
			if (money < mortgageValue + percent) {
				return false;
			}
		}
		
		if (groupsOfPropertiesLost.length > 1) {
			return false;
		}
		
		var liquidityChange = money;
		var opponentLiquidityChange = -money;
		for (var i = 0; i < 40; i++) {
			var liquidityLoseAmount = square[i].price * (square[i].mortgage ? 0 : .5) + square[i].house * square[i].houseprice / 2;
			var liquidityGainAmount = liquidityLoseAmount - (square[i].mortgage ? square[i].price * options.mortgage_rate : 0);
			var netAmount = square[i].price / 2 + square[i].house * square[i].houseprice / 2;
			if (property[i] == lose) {
				liquidityChange -= liquidityLoseAmount;
				opponentLiquidityChange += liquidityGainAmount;
				gainOrLoss -= (liquidityLoseAmount + netAmount);
				opponentGainOrLoss += (liquidityLoseAmount + netAmount);
			} else if (property[i] == gain) {
				liquidityChange += liquidityGainAmount;
				opponentLiquidityChange -= liquidityLoseAmount;
				gainOrLoss += (liquidityGainAmount + netAmount);
				opponentGainOrLoss -= (liquidityGainAmount + netAmount);
			}
		}

		var liquidity = recipient.liquidity();
		
		if (liquidity >= 250 && (liquidity + liquidityChange) < 250) {
			return false;
		}
		
		var groupsOwnedBefore = [];
		var opponentGroupsOwnedBefore = [];
		for (var group = 2; group <= 10; group++) {
			var groupOwnedCount = 0;
			var opponentGroupOwnedCount = 0;
			var otherPlayerCount = 0;
			var total = 0;
			for (var i = 0; i < 40; i++) {
				var s = square[i];
				if (s.groupNumber == group) {
					total++;
					groupOwnedCount += (s.owner == evaluator ? 1 : 0);
					opponentGroupOwnedCount += (s.owner == opponent ? 1 : 0);
					otherPlayerCount += (s.owner > 0 && s.owner != evaluator && s.owner != opponent ? 1 : 0);
				}
			}
			if (groupOwnedCount > 0 && opponentGroupOwnedCount == 0 && otherPlayerCount == 0) {
				groupsOwnedBefore.push({group:group, owned:groupOwnedCount, total:total});
			}
			if (opponentGroupOwnedCount > 0 && groupOwnedCount == 0 && otherPlayerCount == 0) {
				opponentGroupsOwnedBefore.push({group:group, owned:opponentGroupOwnedCount, total:total});
			}
		}

		var groupsOwnedAfter = [];
		var opponentGroupsOwnedAfter = [];
		for (var group = 2; group <= 10; group++) {
			var groupOwnedCount = 0;
			var opponentGroupOwnedCount = 0;
			var otherPlayerCount = 0;
			var total = 0;
			for (var i = 0; i < 40; i++) {
				var s = square[i];
				if (s.groupNumber == group) {
					total++;
					groupOwnedCount += (property[i] == gain || (property[i] == 0 && s.owner == evaluator) ? 1 : 0);
					opponentGroupOwnedCount += (property[i] == lose || (property[i] == 0 && s.owner == opponent) ? 1 : 0);
					otherPlayerCount += (property[i] == 0 && s.owner > 0 && s.owner != evaluator && s.owner != opponent ? 1 : 0);
				}
			}
			if (groupOwnedCount > 0 && opponentGroupOwnedCount == 0 && otherPlayerCount == 0) {
				groupsOwnedAfter.push({group:group, owned:groupOwnedCount, total:total});
			}
			if (opponentGroupOwnedCount > 0 && groupOwnedCount == 0 && otherPlayerCount == 0) {
				opponentGroupsOwnedAfter.push({group:group, owned:opponentGroupOwnedCount, total:total});
			}
		}
		
		var singlesBefore = []
		var singlesAfter = []
		var opponentSinglesBefore = []
		var opponentSinglesAfter = []
		for (var i = 0; i < 40; i++) {
			var s = square[i];
			if (s.groupNumber > 0) {
				if (s.owner == evaluator) {
					var single = true;
					for (var j = 0; j < groupsOwnedBefore.length; j++) {
						if (s.groupNumber == groupsOwnedBefore[j].group) {
							var single = false;
						}
					}
					if (single) {
						singlesBefore.push(i);
					}
				}
				if (s.owner == opponent) {
					var single = true;
					for (var j = 0; j < opponentGroupsOwnedBefore.length; j++) {
						if (s.groupNumber == opponentGroupsOwnedBefore[j].group) {
							var single = false;
						}
					}
					if (single) {
						opponentSinglesBefore.push(i);
					}
				}
				if (property[i] == gain || (property[i] == 0 && s.owner == evaluator)) {
					var single = true;
					for (var j = 0; j < groupsOwnedAfter.length; j++) {
						if (s.groupNumber == groupsOwnedAfter[j].group) {
							var single = false;
						}
					}
					if (single) {
						singlesAfter.push(i);
					}
				}
				if (property[i] == lose || (property[i] == 0 && s.owner == opponent)) {
					var single = true;
					for (var j = 0; j < opponentGroupsOwnedAfter.length; j++) {
						if (s.groupNumber == opponentGroupsOwnedAfter[j].group) {
							var single = false;
						}
					}
					if (single) {
						opponentSinglesAfter.push(i);
					}
				}
			}
		}
		
		var boardCost = 0;
		var opponentBoardCost = 0;
		for (var i = 0; i < 40; i++) {
			var s = square[i];
			if (s.groupNumber > 0 && !s.mortgage) {
				if (s.owner != evaluator && s.owner != 0) {
					boardCost += this.calcCurrentRent(i);
				}
				if (s.owner != opponent && s.owner != 0) {
					opponentBoardCost += this.calcCurrentRent(i);
				}
			}
		}
		boardCost = Math.max(boardCost, 50);
		opponentBoardCost = Math.max(opponentBoardCost, 50);

		var groupsGained = 0;
		for (var i = 0; i < groupsOwnedBefore.length; i++) {
			groupsGained -= (groupsOwnedBefore[i].owned == groupsOwnedBefore[i].total ? 1 : 0);
		}
		var noSetsBefore = (groupsGained == 0);
		for (var i = 0; i < groupsOwnedAfter.length; i++) {
			groupsGained += (groupsOwnedAfter[i].owned == groupsOwnedAfter[i].total ? 1 : 0);
		}
		var opponentGroupsGained = 0;
		for (var i = 0; i < opponentGroupsOwnedBefore.length; i++) {
			opponentGroupsGained -= (opponentGroupsOwnedBefore[i].owned == opponentGroupsOwnedBefore[i].total ? 1 : 0);
		}
		for (var i = 0; i < opponentGroupsOwnedAfter.length; i++) {
			opponentGroupsGained += (opponentGroupsOwnedAfter[i].owned == opponentGroupsOwnedAfter[i].total ? 1 : 0);
		}

		var potentialBefore = this.calcPotential(groupsOwnedBefore, singlesBefore, p.money);
		var potentialAfter = this.calcPotential(groupsOwnedAfter, singlesAfter, p.money + money);
		
		var opponentPotentialBefore = this.calcPotential(opponentGroupsOwnedBefore, opponentSinglesBefore, player[opponent].money);
		var opponentPotentialAfter = this.calcPotential(opponentGroupsOwnedAfter, opponentSinglesAfter, player[opponent].money - money);

		var scoreBefore = this.calcScore(potentialBefore, p.money, boardCost);
		var scoreAfter = this.calcScore(potentialAfter, p.money + gainOrLoss, boardCost + opponentPotentialAfter.current - opponentPotentialBefore.current);
		var score = scoreAfter - scoreBefore;

		var opponentScoreBefore = this.calcScore(opponentPotentialBefore, player[opponent].money, opponentBoardCost);
		var opponentScoreAfter = this.calcScore(opponentPotentialAfter, player[opponent].money + opponentGainOrLoss, opponentBoardCost + potentialAfter.current - potentialBefore.current);
		var opponentScore = opponentScoreAfter - opponentScoreBefore;
		
		if (opponent == 0) {
			return (score > 0);
		}

		var desperation = 1;
		if (!player[opponent].human) {
			if (opponentScoreBefore > scoreBefore) {
				desperation = 1 + Math.random() * turnCount / 500;
			}
			if (pcount == 3) {
				desperation = Math.max(desperation, 1 + Math.random() * 1.25);
			}
			if (pcount == 4) {
				desperation = Math.max(desperation, 1 + Math.random() * 1.7);
			}
			if (pcount > 4) {
				desperation = Math.max(desperation, 1 + Math.random() * 2);
			}

			if (groupsGained > opponentGroupsGained) {
				desperation += Math.random() * 2;
			}
			if (noSetsBefore && groupsGained > 0) {
				desperation += Math.random() * 3;
			}
		}
        
		if (score > 0 || groupsGained > 0) {
			if (score * desperation > opponentScore) {
				return true;
			}
		}
		return false;
	}


	// This function is called at the beginning of the AI's turn, before any dice are rolled. The purpose is to allow the AI to manage property and/or initiate trades.
	// Return: boolean: Must return true if and only if the AI proposed a trade.
	this.beforeTurn = function() {
		return false;
	}

	this.findMiddleTrade = function(tradeObj, minCash, maxCash) {
		var reversedTrade = game.reverseTrade(tradeObj);
		var low = null;
		for (var cash = minCash; cash <= maxCash; cash += 100) {
			reversedTrade.setMoney(-cash);
			if (this.acceptTrade(reversedTrade)) {
				low = cash;
				break;
			}
		}
		if (low == null) {
			return null;
		}
		var high = low;
		for (var cash = maxCash; cash > low; cash -= 100) {
			reversedTrade.setMoney(-cash);
			if (this.acceptTrade(reversedTrade)) {
				high = cash;
				break;
			}
		}
		return low + (high - low) / 2;
	}
	
	this.randomUnimprovedProperty = function(index) {
		var n = Math.floor(Math.random() * 40);
		
		for (var i = 0; i < 40; i++) {
			var s = square[(i + n) % 40];
			if (s.owner == index && s.house == 0) {
				var houses = 0;
				for (var j = 0; j < 40; j++) {
					if (square[j].groupNumber == s.groupNumber && square[j].house > 0) {
						houses++;
					}
				}
				if (houses == 0) {
					return s.index;
				}
			}
		}
		
		return null;
	}
	
	this.propose_property_for_property = function() {
		var property = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		const SETS = 1; // Try trades that will give both parties a set
		const ADVANTAGE = 2;  // Try trades that will give both parties progress towards a set
		for (var trade_type = SETS; trade_type <= ADVANTAGE; trade_type++) {
			for (var group1 = 10; group1 > 1; group1--) {
				var group1Size = 0;
				var group1owned = 0;
				var recipient = 0;
				var request = -1;
				for (var i = 0; i < 40; i++) {
					var s = square[i];
					if (s.groupNumber == group1) {
						group1Size++;
						if (s.owner == p.index) {
							group1owned++;
						} else {
							recipient = s.owner;
							request = i;
						}
					}
				}
				if (recipient > 0 && group1owned > 0 && request >= 0 && (group1owned == group1Size - 1 || (trade_type == ADVANTAGE && !player[recipient].human))) {
					for (var group2 = 2; group2 <= 10; group2++) {
						if (group2 != group1) {
							var group2Size = 0;
							var recipientOwned = 0;
							var offer1 = -1;
							var offer2 = -1
							var offered = 0;
							for (var i = 0; i < 40; i++) {
								var s = square[i];
								if (s.groupNumber == group2) {
									group2Size++;
									if (s.owner == p.index) {
										if (offer1 == -1) {
											offer1 = i;
											offered++;
										} else if (offer2 == -1) {
											offer2 = i;
											offered++;
										}
									} else if (s.owner == recipient) {
										recipientOwned++;
									}
								}
							}
							var tradeName = offer1;
							if (offer2 >= 0) {
								tradeName += "+" + offer2;
							}
							tradeName += "-for-" + request;
							var firstOffer = (this.proposedTrades.indexOf("#" + tradeName + "#") < 0);
							if ((firstOffer || (!player[recipient].human && Math.random() > .1)) && recipientOwned > 0 && offered > 0 && (recipientOwned + offered == group2Size || (trade_type == ADVANTAGE && !player[recipient].human))) {
								if (firstOffer) {
									this.proposedTrades += tradeName + "#";
								}
								property[request] = -1;
								property[offer1] = 1;
								if (offer2 >= 0) {
									property[offer2] = 1;
								}
								var start = -Math.floor(player[recipient].money / 100) * 100;
								var end = Math.floor(p.money / 100) * 100;
								var proposedTrade = new Trade(p, player[recipient], 0, property, 0, 0);
								proposedTrade.setMoney(this.findMiddleTrade(proposedTrade, start, end));
								if (proposedTrade.getMoney() != null) {
									game.trade(proposedTrade);
									return true;
								}
								property[request] = 0;
								property[offer1] = 0;
								if (offer2 >= 0) {
									property[offer2] = 0;
								}
							}
						}
					}
				}
			}
		}
		
		return false;
	}
	
	this.propose_buying_property = function() {
		var property = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var group1 = 10; group1 > 1; group1--) {
			var groupSize = 0;
			var groupOwned = 0;
			var recipient = 0;
			var request = -1;
			for (var i = 0; i < 40; i++) {
				var s = square[i];
				if (s.groupNumber == group1) {
					groupSize++;
					if (s.owner == p.index) {
						groupOwned++;
					} else {
						recipient = s.owner;
						request = i;
					}
				}
			}
			if (recipient > 0 && groupOwned == groupSize - 1 && request >= 0) {
				var offer = Math.ceil((square[request].price + 100) / 100) * 100;
				if (p.money > offer) {
					var tradeName = "cash-for-" + request;
					var firstOffer = (this.proposedTrades.indexOf("#" + tradeName + "#") < 0);
					if (firstOffer || (!player[recipient].human && Math.random() > .05)) {
						if (firstOffer) {
							this.proposedTrades += tradeName + "#";
						}
						property[request] = -1;
						var start = offer;
						var end = Math.floor(p.money / 100) * 100;
						var proposedTrade = new Trade(p, player[recipient], 0, property, 0, 0);
						proposedTrade.setMoney(this.findMiddleTrade(proposedTrade, start, end));
						if (proposedTrade.getMoney() == null) {
							this.findMiddleTrade(proposedTrade, end, end);
						}
						if (proposedTrade.getMoney() != null) {
							game.trade(proposedTrade);
							return true;
						}
						property[request] = 0;
					}
				}
			}
		}

		return false;
	}
	
	// This function is called every time the AI lands on a square. The purpose is to allow the AI to manage property and/or initiate trades.
	// Return: boolean: Must return true if and only if the AI proposed a trade.
	this.onLand = function() {
		if (this.debug) console.log("onLand");
		var proposedTrade;
		var s;

		var allGroupOwned;
		var max;
		var leastHouseProperty;
		var leastHouseNumber;

		// Buy houses.
		var bought = 99;
		while (bought > 0) {
			bought = 0;
			for (var i = 0; i < 40; i++) {
				s = square[i];

				if (s.owner === p.index && s.groupNumber >= 3) {
					max = s.group.length;
					allGroupOwned = true;
					allUnmortgaged = true;
					leastHouseNumber = 6; // No property will ever have 6 houses.

					for (var j = max - 1; j >= 0; j--) {
						if (square[s.group[j]].owner !== p.index) {
							allGroupOwned = false;
							break;
						}

						if (square[s.group[j]].mortgage) {
							allUnmortgaged = false;
							break;
						}

						if (square[s.group[j]].house < leastHouseNumber) {
							leastHouseProperty = square[s.group[j]];
							leastHouseNumber = leastHouseProperty.house;
						}
					}

					if (allGroupOwned && allUnmortgaged && leastHouseNumber < 5) {
						if (p.money > leastHouseProperty.houseprice + 100) {
							buyHouse(leastHouseProperty.index);
							bought++;
						}
					}
				}
			}
		}

		// Unmortgage property
		for (var i = 39; i >= 0; i--) {
			s = square[i];

			if (s.owner === p.index && s.mortgage && p.money > s.price) {
				unmortgage(i);
			}
		}
		
		if (this.propose_property_for_property()) {
			return true;
		}
		
		if (Math.random() > .1) {
			if (this.propose_buying_property()) {
				return true;
			}
		}

		return false;
	}

	// Determine whether to post bail/use get out of jail free card (if in possession).
	// Return: 0 to stay in, 1 to pay fine, 2 to use Chance card, 3 to use Community Chest card.
	this.postBail = function() {
		if (p.communityChestJailCard) {
			return 3;
		} else if (p.chanceJailCard) {
			return 2;
		} else if (p.jailroll === 2) {
			// Third turn in jail.
			return 1;
		} else {
			return 0;
		}
	}
	
	this.mortgageAsNecessary = function() {
		for (var i = 39; i >= 0; i--) {
			s = square[i];
			if (s.owner === p.index && !s.mortgage && s.house === 0) {
				var noneBuilt = true;
				for (var j = 0; j <= 39; j++) {
					if (square[j].groupNumber == s.groupNumber && square[j].house > 0) {
						noneBuilt = false;
						break;
					}
				}
				if (noneBuilt) {
					mortgage(i);
					if (p.money >= 0) {
						return;
					}
				}
			}
		}
	}

	// Raise enough money to pay debt.
	// Return: void: don't return anything, just call the functions mortgage()/sellHouse()
	this.payDebt = function() {
		if (p.money >= 0) {
			return;
		}

		this.mortgageAsNecessary();
		if (p.money >= 0) {
			return;
		}

		var houseSum = 0;
		for (var i = 0; i < 40; i++) {
			if (square[i].hotel == 0 && square[i].house > 0) {
				houseSum += square[i].house;
			}
		}

		for (var selltype = 1; selltype <= 3; selltype++) {
			for (var group = 3; group <= 10; group++) {
				var properties = this.getPropertiesByGroup(group);
				var has1or2 = false;
				var has3 = false;
				var has4or5 = false;
				for (var i = 0; i < properties.length; i++) {
					s = square[properties[i]];
					if (s.owner === p.index && (s.house === 1 || s.house == 2)) {
						has1or2 = true;
					}
					if (s.owner === p.index && s.house == 3) {
						has3 = true;
					}
					if (s.owner === p.index && (s.house == 4 || s.house == 5)) {
						has4or5 = true;
					}
				}
				
				var meetsCondition, start, end;
				if (selltype === 1) {
					meetsCondition = (has1or2 && !has3 && !has4or5);
					start = 2;
					end = 1;
				} else if (selltype == 2) {
					meetsCondition = has4or5;
					start = 5;
					end = 4;
				} else if (selltype == 3) {
					meetsCondition = has3;
					start = 3;
					end = 1;
				}
				
				if (meetsCondition) {
					for (var highHouse = start; highHouse >= end; highHouse--) {
						for (var i = 0; i < properties.length; i++) {
							s = square[properties[i]];
							if (s.house === highHouse) {
								if (s.house == 5) {
									houseSum += 4;
								} else {
									houseSum--;
								}
								sellHouse(properties[i]);
								if (p.money >= 0 && houseSum <= options.houseLimit) {
									return;
								}
							}
						}
					}
				}
				
				if (end === 1) {
					this.mortgageAsNecessary();
					if (p.money >= 0) {
						return;
					}
				}
			}
		}
	}
	
	// Determine what to bid during an auction.
	// Return: integer: -1 for exit auction, 0 for pass, a positive value for the bid.
	this.bid = function(property, currentBid) {
		var bid = currentBid + Math.round(Math.random() * 20 + 10);
		
		var properties = [];
		for (var i = 0; i < 40; i++) {
			properties.push(0);
		}
		properties[property] = 1;
		
		var proposedTrade = new Trade(player[0], p, -bid, properties, 0, 0);
		if (this.acceptTrade(proposedTrade)) {
			return bid;
		} else if (square[property].price / 2 > p.money) {
			if (bid < p.money) {
				return bid;
			} else {
				return p.money;
			}
		} else {
			return -1;
		}
	}
	
	this.unmortgagePropertiesReceived = function(properties) {
		if (pcount > 2) {
			var remaining_interest = 0;
			for (var i = 0; i < properties.length; i++) {
				remaining_interest += square[properties[i]].price * options.mortgage_rate;
			}
			for (var i = 39; i >= 0; i--) {
				for (var j = 0; j < properties.length; j++) {
					if (properties[j] == i) {
						s = square[i];
						if (p.money - remaining_interest > s.price) {
							unmortgage(i);
						}
					}
				}
			}
		}
	}

	// Return "fine" or "draw"
	this.fineOrDraw = function(fine_amount) {
		return "fine";
	}
	
	this.rentRequest = function(player, rent) {
		if (rent > 500 && Math.random() > .5) {
			return "I hope you can afford $" + rent + ".";
		}
		if (Math.random() > .5) {
			return "That will be $" + rent + " please.";
		}
		return "Your rent is due.";
	}

	this.payBeforeAsked = function(player, rent) {
		return (Math.random() > .5);
	}

	this.calcCurrentRent = function(index) {
		if (square[index].groupNumber > 0) {
			if (!square[index].mortgage) {
				var total = 0;
				var owned = 0;
				for (var i = 0; i < 40; i++) {
					if (square[i].groupNumber == square[index].groupNumber) {
						total++;
						if (square[i].owner == square[index].owner) {
							owned++;
						}
					}
				}
				if (square[index].groupNumber == 1) {
					if (owned == 2) {
						return 70;
					} else {
						return 28;
					}
				} else if (square[index].groupNumber == 2) {
					if (owned == 4) {
						return 200;
					} else if (owned == 3) {
						return 100;
					} else if (owned == 2) {
						return 50;
					} else {
						return 25;
					}
				} else if (square[index].house == 0) {
					return square[index].baserent * (owned == total ? 2 : 1);
				} else {
					return square[index]["rent" + square[index].house];
				}
			}
		}
		return 0;
	}

	this.calcCurrentGroupRent = function(group) {
		var rent = 0;
		for (var j = 0; j < 40; j++) {
			if (square[j].groupNumber == group) {
				if (!square[j].mortgage) {
					if (group == 1) {
						rent += 70;
					} else if (group == 2) {
						rent += 200;
					} else if (square[j].house == 0) {
						rent += square[j].baserent * 2;
					} else {
						rent += square[j]["rent" + square[j].house];
					}
				}
			}
		}
		return rent;
	}
	
	this.calcMaxGroupRent = function(group) {
		var rent = 0;
		for (var j = 0; j < 40; j++) {
			if (square[j].groupNumber == group) {
				if (group == 1) {
					rent += 70;
				} else if (group == 2) {
					rent += 200;
				} else {
					rent += square[j].rent5;
				}
			}
		}
		return rent;
	}
	
	this.calcGroupHotelPrice = function(group) {
		var price = 0;
		for (var j = 0; j < 40; j++) {
			if (square[j].mortgage) {
				price += Math.round(square[j].price * .5 + square[j].price * options.mortgage_rate);
			}
			if (square[j].groupNumber == group) {
				if (group > 2) {
					price += square[j].houseprice * (5 - square[j].house);
				}
			}
		}
		return (price == 0 ? 1 : price);
	}

	this.calcPotential = function(groups, singles, moneyToSpend) {
		var currentRent = 0;
		var maxRent = 0;
		var price = 0;
		for (var i = 0; i < groups.length; i++) {
			if (groups[i].owned == groups[i].total) {
				currentRent += this.calcCurrentGroupRent(groups[i].group);
				maxRent += this.calcMaxGroupRent(groups[i].group);
			} else {
				if (groups[i].group == 1) {
					currentRent += 28;
					maxRent += 28 + (70-28) / pcount;
				} else if (groups[i].group == 2 && groups[i].owned == 1) {
					currentRent += 25;
					maxRent += 25 + (800-25) / pcount / pcount / pcount;
				} else if (groups[i].group == 2 && groups[i].owned == 2) {
					currentRent += 50*2;
					maxRent += 100 + (800-100) / pcount / pcount;
				} else if (groups[i].group == 2 && groups[i].owned == 3) {
					currentRent += 100*3;
					maxRent += 300 + (800-300) / pcount;
				} else {
					var thisCurrentRent = this.calcCurrentGroupRent(groups[i].group) / 2 * groups[i].owned / groups[i].total;
					var thisMaxRent = this.calcMaxGroupRent(groups[i].group);
					currentRent += thisCurrentRent;
					if (groups[i].total - groups[i].owned == 2) {
						maxRent += thisCurrentRent + (thisMaxRent - thisCurrentRent) / pcount / pcount;
					} else if (groups[i].total - groups[i].owned == 1) {
						maxRent += thisCurrentRent + (thisMaxRent - thisCurrentRent) / pcount;
					} else {
						//Should not happen
					}
				}
			}
			if (groups[i].total - groups[i].owned == 1) {
				price += this.calcGroupHotelPrice(groups[i].group) / pcount;
			} else if (groups[i].total - groups[i].owned == 2) {
				price += this.calcGroupHotelPrice(groups[i].group) / pcount / pcount;
			} else if (groups[i].total - groups[i].owned == 3) {
				price += this.calcGroupHotelPrice(groups[i].group) / pcount / pcount / pcount;
			}
		}
		for (var i = 0; i < singles.length; i++) {
			if (square[singles[i]].mortgage) {
				price += Math.round(square[singles[i]].price * .5 + square[singles[i]].price * options.mortgage_rate);
			} else {
				currentRent += square[singles[i]].baserent;
			}
			maxRent += square[singles[i]].baserent;
		}
		var potential = maxRent * Math.min(moneyToSpend / price, 1);
		if (currentRent > potential) {
			return {current: currentRent, potential:currentRent, price:0};
		} else if (moneyToSpend > price) {
			return {current: currentRent, potential:potential, price:price};
		} else {
			return {current: currentRent, potential:potential, price:moneyToSpend};
		}
	}
	
	this.calcScore = function(potentialObj, money, boardCost) {
		var timesAround = 16;
		return money - potentialObj.price + potentialObj.potential / 6 * timesAround;
	}
}
