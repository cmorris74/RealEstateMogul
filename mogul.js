/* Complete source code at https://github.com/cmorris74/RealEstateMogul */

function Square(title, color, price, groupNumber, baserent, rent1, rent2, rent3, rent4, rent5) {
	this.title = title;
	this.name = title.replaceAll("-", "").replaceAll("<br>", " ").replaceAll("&ndash;", "-");
	this.color = color;
	this.owner = 0;
	this.mortgage = false;
	this.house = 0;
	this.hotel = 0;
	this.groupNumber = groupNumber || 0;
	this.price = (price || 0);
	this.baserent = (baserent || 0);
	this.rent1 = (rent1 || 0);
	this.rent2 = (rent2 || 0);
	this.rent3 = (rent3 || 0);
	this.rent4 = (rent4 || 0);
	this.rent5 = (rent5 || 0);
	this.landcount = 0;

	if (groupNumber === 3 || groupNumber === 4) {
		this.houseprice = 50;
	} else if (groupNumber === 5 || groupNumber === 6) {
		this.houseprice = 100;
	} else if (groupNumber === 7 || groupNumber === 8) {
		this.houseprice = 150;
	} else if (groupNumber === 9 || groupNumber === 10) {
		this.houseprice = 200;
	} else {
		this.houseprice = 0;
	}
}

function Card(deckName, text, action) {
	this.deckName = deckName;
	this.text = text;
	this.action = action;
}

function CommunityChestCard(text, action) {
	return new Card("Community Chest", text, action);
}

function ChanceCard(text, action) {
	return new Card("Chance", text, action);
}

function Game() {
	var die1;
	var die2;
	var areDiceRolled = false;

	var auctionQueue = [];
	var highestbidder;
	var highestbid;
	var currentbidder = 1;
	var bidscount = -1;
	var auctionproperty;
	var gameComplete = false;
	
	this.sounds = {
		built: new Audio("mp3/build.mp3"),
		sold: new Audio("mp3/pop.mp3"),
		gained: new Audio("mp3/gain2.mp3"),
		gainedBig: new Audio("mp3/gain.mp3"),
		lost: new Audio("mp3/loss2.mp3"),
		lostBig: new Audio("mp3/loss.mp3"),
		payout: new Audio("mp3/payout.mp3"),
		bought: new Audio("mp3/sale.mp3"),
		traded: new Audio("mp3/tada.mp3"),
		jail: new Audio("mp3/siren.mp3"),
		mortgaged: new Audio("mp3/stamped.mp3"),
		unmortgaged: new Audio("mp3/bell2.mp3")
	}
	
	this.images = {
		house: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAYAAABlcqYFAAAABGdBTUEAANbY1E9YMgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeX" +
		       "HJZTwAAAMcSURBVEhLlZU7TFNhGIbfc9rSq1ZjW0QQB+OgDhCiWEy8gBAHJnHQGAlxMNHFyWjQwcXZzUWjgImDwagxBknYHIyYmAgDcfBClKggVFrojXJOfb9zekprL+IPP6f9L+/zfe/3/wdF1/UsyjRFUcoNG2" +
			   "PZbNktFdcr3FBxR/3jU/gem8GRhla01zWjfWszDgebKopVmqgICTw6gYXoT8DuArQMw1+hhgboGdj8dThGYHut9CYc2LKnKrgsxPuwG4nEIuBwAxkNjRvdUG0KpiMJwOMg0IQZcHmy7wzV486+m+hoaCkBlkDUoU" +
			   "4GnSKAGYiRyVUgQOEYM5mneKPHHDeKw67rCIc8ePN+DliYRd/x8xjsvFYEykNkvTpwFFilkMOZF0BCB4KEJDjutFNUFq4B2kJejE9FoCc5wWwRj8IbrMX8pZdwgftyy40P2wZ6gAgtUswJyOFSqea1EUABBwFawR" +
			   "lhBq0hHyY+RqHHGYAApHn95MTgvr4bT768Kobc67iCcGMbsETf4/Q5Lb5TVOVmcow6yLGWLDQdLQEfPs0sIRFJMwAZLGh2yVjByWHTtpKahIcvYvzHBFBDy6wmUUoXMT72+j2ILabx7XOUFkoEBU3TYOfPyNlb6N" +
			   "qxvzgTa5ld4SbJwE7BFbGHqvJYpWVJyU6HK60TQGstgMytcC7Fns6g3h/MA0T3rzwBnxxbChkghV3qIBAb4fKZTr6bW+Ict/J4G7bKfZaS2PmHv14nNQpaKcQmEKlBYecXgQpEuks8l0VSI1EX8VzhGZgRaDWI21" +
			   "FjRpa/Czkx0ZAxBm5YJ+ISotVzLFnkq+FdqgZRVdoSj5inyQJJ1BbYyLDyy1PW+f5l11BXP572DbKQSRMmt99qUiMhl3unypjGt0MqVvKWrvoWHv06jtuTz/Bi6jlPhJ828aLa6I9Y9ItwOdaSZYYBpZbhDDTgal" +
			   "svLofPYINjzbKqECuB2eRv9IzdwOvJURbdx6PrJWSZ4ry4vE/nWk+j/2Avdm3eXlSL/Bf5f/I/7f6Hkeymu93ZQw8uZMem365r67oyKR/e+kf/AGrkoX4R72baAAAAAElFTkSuQmCC",
		hotel: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAIAAADqEDFSAAAABGdBTUEAANcNO+1PKAAAACBjSFJNAACHCwAAjA8AAP1RAACBQAAAfXYAAOmQAAA85QAAGc0hrlxKAAAA3WlDQ1BJQ0" +
			   "MgUHJvZmlsZQAAKM9jYGB8wAAETECcm1dSFOTupBARGaXAfoGBEQjBIDG5uMA32C2EASf4dg2i9rIuA+mAs7ykoARIfwBikaKQIGegm1iAbL50CFsExE6CsFVA7CKgA4FsE5D6dAjbA8ROgrBjQOzkgiKgmYwFIP" +
			   "NTUouTgewGIDsB5DeItZ8DwW5mFDuTXFpUBnULI+NFBgZCfIQZ+fMZGCy+MDAwT0CIJU1lYNjexsAgcRshprKQgYG/lYFh29WS1IoSZM9D3AYGbPkFwNBnoCZgYAAAb3Y5PLWbw5MAAAAJcEhZcwAADsQAAA7EAZ" +
			   "UrDhsAAANDSURBVDhPhZRLixxVFMfPo6q7q6YfVTU9dkcQTARFEUW/gAtF3LjMKipBhQjigyh+BkFCQDLfQBeCUYKioCIuRVcmCjoEYsQ4ZjI9M93VXV2Prns8t7okPcaQP9XVdR/nd8/931OFIgK3KL3wBYUBbf" +
			   "T57iH2unXvnfRflrn2V3zmnCBIsaDBoLy8RX4bfY+PDHk45CMDHg7oNgscYmWffJZ8/S0GARRzQKaon3x+3nviKTEA+iuNlAZcV+KJK0XnzHuw5tWRlf5lpWn87tnFeIwtD8FANgdugO/DwT6stUGnkHYb8Nckjs" +
			   "3FH6AoZTr1XzjpvXqq4ljVrPGp13Vt9H10HHAIsIoEBGL7QAQ6rduT69tm6xIig6AYxcXITm9zkx9+SCFUEaHxwH2YzTQdmSUymUmcSFaAKe3WkKQsIVqXq1csyG0A62KCRNTpQpbFm+eWkJrlnX6Dj91f/L2ziM" +
			   "eo8/QSI2kO07nuBdf75pefzJ+XLYgQCckhdiidzxePPd595+0lpGapOIqcQUitRrmzm49GEk+RDHiETRf2R7i3za0WNTjNi73RbPvqwZVfd0c/32g++QwdPbYk3GRRP4J8AQ6T77vDqJxMF0mSX9/VU8M827+R7G" +
			   "yNrv24nVw6cP7I2hPYKN0esrse1vGHWGFgfXEc9RQdV9T2sEfdthSmzIvW72l3DH1odhy36bBLjGpkLjzYqONXWRiGetKgc/Rg7R1BoTrArg66nQZ6DE0SRlHvmYhZLXWG/WW4asWvUEtUWdpTVZwtC9GqsE19UL" +
			   "8ZK9u1UOylRaInjFFkJ1daySsKpCjRZU3HNhVqS09hCi0VrS2bp66hl50B4uLN+EOsIJDJVF+Rqqx0pMpL78owWiVaoaw56r8Nsh6U1A/q4EorXKbOi8/jNC4ns6pEK+OWRGMztFCbV2WiASkL7LaryFqrOULzxP" +
			   "Hg7Pud547L/ljSuSZod6ppVu+TOm13SmjydDHa5Ybbe+uVOrLSoe/EquYffJR+9Q2EvtnLiKn8/jchMfOZiRPv2afbb77kPGrfwVXdlrVU+vH52Yefajrldxede+7yXjvpvXyiHrtFd2AtlV/4ko/ey488WLf/Vw" +
			   "D/AKo9gV8dZwpbAAAAAElFTkSuQmCC"
	}

	this.isComplete = function() {
		return gameComplete;
	}

	this.rollDice = function() {
		die1 = Math.floor(Math.random() * 6) + 1;
		die2 = Math.floor(Math.random() * 6) + 1;

		if (document.forms.cheats != null) {
			var d1 = document.forms.cheats.elements.cheatdie1.value;
			if (d1 != "?") {
				die1 = Number(d1);
				document.forms.cheats.elements.cheatdie1.value = "?";
			}
			var d2 = document.forms.cheats.elements.cheatdie2.value;
			if (d2 != "?") {
				die2 = Number(d2);
				document.forms.cheats.elements.cheatdie2.value = "?";
			}
		}

		areDiceRolled = true;
	};

	this.resetDice = function() {
		areDiceRolled = false;
	};

	this.next = function() {
		if (game.auction(null)) {
			return;
		}

		$("#nextbutton").prop("disabled", game.tradeInProgress());

		var p = player[turn];
		if (!p.human && p.money < 0) {
			p.AI.payDebt();

			if (p.money < 0) {
				activeAlert(p.name + " owes $" + (0-p.money) + " and is bankrupt.", game.bankruptcy);
			} else {
				roll();
			}
		} else if (areDiceRolled && doublecount === 0) {
			if (!botsOnly) {
				play();
			}
		} else {
			roll();
		}
	};

	this.getDie = function(die) {
		if (die === 1) {
			return die1;
		} else {
			return die2;
		}
	};



	// Auction functions:

	var auctionCallback = null;

	var finalizeAuction = function() {
		var p = player[highestbidder];
		var sq = square[auctionproperty];

		if (highestbid > 0) {
			p.pay(highestbid, 0, false);
			sq.owner = highestbidder;
			addAlert(p.name + " bought " + sq.name + " at auction for $" + highestbid + ".");
			playSound(game.sounds.bought);
			if (p.human) {
				if (p.money < 0) {
					sq.owner = -highestbidder; // Potential purchase.  Will be changed to the proper owner when debt is paid.
				}
			} else {
				p.AI.payDebt();
			}
		} else {
			addAlert("There were no bids for " + sq.name + ".");
		}

		for (var i = 1; i <= pcount; i++) {
			player[i].bidding = true;
		}

		if (auctionCallback == null) {
			if (highestbidder == turn && player[turn].human) {
				$("#nextbutton").prop("disabled", game.tradeInProgress());
			} else {
				activeAlert("", game.next);
			}
		} else {
			auctionCallback();
		}
	};

	this.addPropertyToAuctionQueue = function(propertyIndex) {
		auctionQueue.push(propertyIndex);
	};

	this.auction = function(callback) {
		if (auctionQueue.length === 0) {
			return false;
		}

		index = auctionQueue.shift();

		var s = square[index];

		if (s.price === 0 || s.owner !== 0) {
			return game.auction(callback);
		}
		
		hideLanded();

		auctionCallback = callback;

		auctionproperty = index;
		bidscount = -1;
		highestbidder = 0;
		highestbid = 0;
		currentbidder = turn + 1;

		if (currentbidder > pcount) {
			currentbidder -= pcount;
		}

		var html = "<div style='font-weight: bold; font-size: 16px; margin-bottom: 10px;'>Auction <span id='propertyname'></span></div>"
				 + "<div id='previousbids'></div>"
				 + "<div><span id='currentbidder'></span>, what do you bid?</div>"
				 + "<div id='bid-action-border'>"
				 +   "<div>"
				 +     "<input id='bid-plus-1' type='button' value='1' onclick='document.getElementById(\"bid\").value = event.target.value'/>"
				 +     "<input id='bid-plus-10' type='button' value='10' onclick='document.getElementById(\"bid\").value = event.target.value'/>"
				 +     "<input id='bid-plus-50' type='button' value='50' onclick='document.getElementById(\"bid\").value = event.target.value'/>"
				 +     "<input id='bid-plus-100' type='button' value='100' onclick='document.getElementById(\"bid\").value = event.target.value'/>"
				 +   "</div>"
				 +   "<div><input id='bid' title='This is the amount you will bid on " + s.name + ".' style='width: 261px;' /></div>"
				 +   "<div style='margin-top: 10px'>"
				 +     "<input type='button' value='Bid' onclick='game.auctionBid();' title='Place your bid.' />"
				 +     "<input type='button' value='Pass' title='Skip bidding this time.' onclick='game.auctionPass();' />"
				 +     "<input type='button' value='Exit Auction' title='Stop bidding on " + s.name + " altogether.' onclick='game.auctionExit()' />"
				 +   "</div>";
				 + "</div>";
		popup(html, null, "blank");

		document.getElementById("propertyname").innerHTML = "<a href='javascript:void(0);' onmouseover='showdeed(" + auctionproperty + ");' onmouseout='hidedeed();' class='statscellcolor'>" + s.name + "</a>";
		document.getElementById("currentbidder").innerHTML = player[currentbidder].name;
		document.getElementById("bid-action-border").style.borderColor = player[currentbidder].color;
		document.getElementById("bid").onkeydown = function (e) {
			var key = 0;
			var isCtrl = false;
			var isShift = false;

			if (window.event) {
				key = window.event.keyCode;
				isCtrl = window.event.ctrlKey;
				isShift = window.event.shiftKey;
			} else if (e) {
				key = e.keyCode;
				isCtrl = e.ctrlKey;
				isShift = e.shiftKey;
			}

			if (isNaN(key)) {
				return true;
			}

			if (key === 13) {
				game.auctionBid();
				return false;
			}

			// Allow backspace, tab, delete, arrow keys, or if control was pressed, respectively.
			if (key === 8 || key === 9 || key === 46 || (key >= 35 && key <= 40) || isCtrl) {
				return true;
			}

			if (isShift) {
				return false;
			}

			// Only allow number keys.
			return (key >= 48 && key <= 57) || (key >= 96 && key <= 105);
		};

		document.getElementById("bid").onfocus = function () {
			this.style.color = "black";
			if (isNaN(this.value)) {
				this.value = "";
			}
		};

		updateMoney();

		if (!player[currentbidder].human) {
			currentbidder = turn; // auctionPass advances currentbidder.
			this.auctionPass();
		}
		return true;
	};

	this.auctionPass = function() {
		var previousbidsHTML = "";
		if (highestbid > 0) {
			previousbidsHTML = "<div>" + player[currentbidder].name + ", your last bid was $" + highestbid + ".</div>";
		}
		
		while (true) {
			bidscount++;
			currentbidder++;

			if (currentbidder > pcount) {
				currentbidder -= pcount;
			}

			if (highestbidder === 0) {
				highestbidder = currentbidder;
			}

			if (bidscount >= pcount && highestbid == 0) {
				popup("<p>There were no bids for " + square[auctionproperty].name + ".</p>", finalizeAuction);
				return;
			} else if (currentbidder == highestbidder && highestbid > 0 && bidscount > 0) {
				popup(previousbidsHTML + "<div>" + player[highestbidder].name + " wins the auction and buys " + square[auctionproperty].name + " for $" + highestbid + ".</div>", finalizeAuction);
				return;
			} else if (player[currentbidder].bidding) {
				var p = player[currentbidder];

				if (!p.human) {
					var bid = p.AI.bid(auctionproperty, highestbid);

					if (bid === -1 || highestbid >= p.money) {
						p.bidding = false;

						previousbidsHTML += "<div>" + p.name + " is through bidding.</div>";
						continue;

					} else if (bid === 0) {
						previousbidsHTML += "<div>" + p.name + " passed.</div>";
						continue;

					} else if (bid > 0) {
						this.auctionBid(bid);
						previousbidsHTML += "<div>" + p.name + " bid $" + bid + ".</div>";
						continue;
					}
					return;
				} else {
					break;
				}
			}

		}

		document.getElementById("currentbidder").innerHTML = player[currentbidder].name;
		document.getElementById("bid-action-border").style.borderColor = player[currentbidder].color;
		var possibleBids = [1,10,50,100];
		for (var i = 0; i < possibleBids.length; i++) {
			var button = document.getElementById("bid-plus-" + possibleBids[i]);
			button.value = highestbid + possibleBids[i];
			button.style.color = ((player[currentbidder].money >= highestbid + possibleBids[i]) ? "black" : "red");
		}
		document.getElementById("bid").value = "";
		document.getElementById("bid").style.color = "black";
		document.getElementById("previousbids").innerHTML = previousbidsHTML;
	};

	this.auctionBid = function(bid) {
		bid = bid || parseInt(document.getElementById("bid").value, 10);

		if (bid === "" || bid === null) {
			document.getElementById("bid").value = "Please enter a bid.";
			document.getElementById("bid").style.color = "red";
		} else if (isNaN(bid)) {
			document.getElementById("bid").value = "Your bid must be a number.";
			document.getElementById("bid").style.color = "red";
		} else {
			if (bid > highestbid) {
				highestbid = bid;
				highestbidder = currentbidder;

				document.getElementById("bid").focus();

				if (player[currentbidder].human) {
					this.auctionPass();
				}
			} else {
				document.getElementById("bid").value = "Your bid must be greater than highest bid. ($" + highestbid + ")";
				document.getElementById("bid").style.color = "red";
			}
		}
	};

	this.auctionExit = function() {
		player[currentbidder].bidding = false;
		this.auctionPass();
	};



	// Trade functions:
	var tradeFormFilled = false;
	var tradeFormChanged = false;
	var currentLeftPlayer;
	var currentRightPlayer;
	var counterProposalCount = 0;
	
	var setTradeFormChanged = function(value) {
		tradeFormChanged = value;
		if (!botsOnly) {
			if (tradeFormFilled && !tradeFormChanged) {
				$("#proposetradebutton").hide();
				$("#accepttradebutton").show();
				$("#rejecttradebutton").show();
			} else if (tradeFormFilled && tradeFormChanged) {
				$("#accepttradebutton").hide();
				$("#proposetradebutton").show();
				$("#rejecttradebutton").show();
			} else {
				$("#accepttradebutton").hide();
				$("#rejecttradebutton").hide();
				$("#proposetradebutton").show();
			}
		}
	}

	var tradeMoneyOnKeyDown = function (e) {
		var key = 0;
		var isCtrl = false;
		var isShift = false;

		if (window.event) {
			key = window.event.keyCode;
			isCtrl = window.event.ctrlKey;
			isShift = window.event.shiftKey;
		} else if (e) {
			key = e.keyCode;
			isCtrl = e.ctrlKey;
			isShift = e.shiftKey;
		}

		if (isNaN(key)) {
			return true;
		}

		if (key === 13) {
			return false;
		}

		// Allow tab, arrow keys, ctrl.
		if (key === 9 || (key >= 35 && key <= 40) || isCtrl) {
			return true;
		}

		if (isShift) {
			return false;
		}

		// Allow backspace, delete, and number keys.
		if (key === 8 || key === 46 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
			setTradeFormChanged(true);
			return true;
		}
		
		return false;
	};

	var tradeMoneyOnFocus = function () {
		this.style.color = "black";
		if (isNaN(this.value) || this.value === "0") {
			this.value = "";
		}
	};

	var tradeMoneyOnChange = function(e) {
		setTradeFormChanged(true);

		var amount = this.value;

		if (isNaN(amount)) {
			this.value = "This value must be a number.";
			this.style.color = "red";
			return false;
		}

		amount = Math.round(amount) || 0;
		this.value = amount;

		if (amount < 0) {
			this.value = "This value must be greater than 0.";
			this.style.color = "red";
			return false;
		}

		return true;
	};

	document.getElementById("trade-leftp-money").onkeydown = tradeMoneyOnKeyDown;
	document.getElementById("trade-rightp-money").onkeydown = tradeMoneyOnKeyDown;
	document.getElementById("trade-leftp-money").onfocus = tradeMoneyOnFocus;
	document.getElementById("trade-rightp-money").onfocus = tradeMoneyOnFocus;
	document.getElementById("trade-leftp-money").onchange = tradeMoneyOnChange;
	document.getElementById("trade-rightp-money").onchange = tradeMoneyOnChange;
	
	this.tradeInProgress = function() {
		return tradeFormFilled;
	}
	
	this.resetTrade = function(leftp, rightp, rightpCanChange) {
		var currentSquare;
		var currentTableRow;
		var currentTableCell;
		var currentTableCellCheckbox;
		var nameSelect;
		var currentOption;
		var allGroupUninproved;
		var currentName;

		var tableRowOnClick = function(e) {
			var checkboxElement = this.firstChild.firstChild;

			if (checkboxElement !== e.srcElement) {
				checkboxElement.checked = !checkboxElement.checked;
			}
			setTradeFormChanged(true);
		};

		var leftPlayerProperty = document.getElementById("trade-leftp-property");
		var rightPlayerProperty = document.getElementById("trade-rightp-property");

		currentLeftPlayer = leftp;
		currentRightPlayer = rightp;

		// Empty elements.
		while (leftPlayerProperty.lastChild) {
			leftPlayerProperty.removeChild(leftPlayerProperty.lastChild);
		}

		while (rightPlayerProperty.lastChild) {
			rightPlayerProperty.removeChild(rightPlayerProperty.lastChild);
		}

		var leftSideTable = document.createElement("table");
		var rightSideTable = document.createElement("table");


		for (var i = 0; i < 40; i++) {
			currentSquare = square[i];

			// A property cannot be traded if any properties in its group have been improved.
			if (currentSquare.house > 0 || currentSquare.groupNumber === 0) {
				continue;
			}

			allGroupUninproved = true;
			var max = currentSquare.group.length;
			for (var j = 0; j < max; j++) {

				if (square[currentSquare.group[j]].house > 0) {
					allGroupUninproved = false;
					break;
				}
			}

			if (!allGroupUninproved) {
				continue;
			}

			// Offered properties.
			if (currentSquare.owner === leftp.index) {
				currentTableRow = leftSideTable.appendChild(document.createElement("tr"));
				currentTableRow.onclick = tableRowOnClick;

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellcheckbox";
				currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
				currentTableCellCheckbox.type = "checkbox";
				currentTableCellCheckbox.id = "tradeleftcheckbox" + i;
				currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellcolor";
				currentTableCell.style.backgroundColor = currentSquare.color;

				if (currentSquare.groupNumber == 1 || currentSquare.groupNumber == 2) {
					currentTableCell.style.borderColor = "grey";
				} else {
					currentTableCell.style.borderColor = currentSquare.color;
				}

				currentTableCell.propertyIndex = i;
				currentTableCell.onmouseover = function() {showdeed(this.propertyIndex);};
				currentTableCell.onmouseout = hidedeed;

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellname";
				if (currentSquare.mortgage) {
					currentTableCell.title = "Mortgaged";
					currentTableCell.style.color = "grey";
				}
				currentTableCell.textContent = currentSquare.name;

			// Requested properties.
			} else if (currentSquare.owner === rightp.index) {
				currentTableRow = rightSideTable.appendChild(document.createElement("tr"));
				currentTableRow.onclick = tableRowOnClick;

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellcheckbox";
				currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
				currentTableCellCheckbox.type = "checkbox";
				currentTableCellCheckbox.id = "traderightcheckbox" + i;
				currentTableCellCheckbox.title = "Check this box to include " + currentSquare.name + " in the trade.";

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellcolor";
				currentTableCell.style.backgroundColor = currentSquare.color;

				if (currentSquare.groupNumber == 1 || currentSquare.groupNumber == 2) {
					currentTableCell.style.borderColor = "grey";
				} else {
					currentTableCell.style.borderColor = currentSquare.color;
				}

				currentTableCell.propertyIndex = i;
				currentTableCell.onmouseover = function() {showdeed(this.propertyIndex);};
				currentTableCell.onmouseout = hidedeed;

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellname";
				if (currentSquare.mortgage) {
					currentTableCell.title = "Mortgaged";
					currentTableCell.style.color = "grey";
				}
				currentTableCell.textContent = currentSquare.name;
			}
		}

		for (var i = 40; i < 42; i++) {
			if ((i==40 && (leftp.communityChestJailCard || rightp.communityChestJailCard)) || (i==41 && (leftp.chanceJailCard || rightp.chanceJailCard))) {
				var currentTable = (leftp.communityChestJailCard || leftp.chanceJailCard) ? leftSideTable : rightSideTable;
				currentTableRow = currentTable.appendChild(document.createElement("tr"));
				currentTableRow.onclick = tableRowOnClick;

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellcheckbox";
				currentTableCellCheckbox = currentTableCell.appendChild(document.createElement("input"));
				currentTableCellCheckbox.type = "checkbox";
				currentTableCellCheckbox.id = "trade" + (currentTable == leftSideTable ? "left" : "right") + "checkbox" + i;
				currentTableCellCheckbox.title = "Check this box to include this Get Out of Jail Free Card in the trade.";

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellcolor";
				currentTableCell.style.backgroundColor = "white";
				currentTableCell.style.borderColor = "grey";

				currentTableCell = currentTableRow.appendChild(document.createElement("td"));
				currentTableCell.className = "propertycellname";

				currentTableCell.textContent = "Get Out of Jail Free Card";
			}
		}

		if (leftSideTable.lastChild) {
			leftPlayerProperty.appendChild(leftSideTable);
		} else {
			leftPlayerProperty.textContent = leftp.name + " has no properties to trade.";
		}

		if (rightSideTable.lastChild) {
			rightPlayerProperty.appendChild(rightSideTable);
		} else {
			rightPlayerProperty.textContent = rightp.name + " has no properties to trade.";
		}

		document.getElementById("trade-leftp-name").textContent = leftp.name;

		currentName = document.getElementById("trade-rightp-name");

		if (rightpCanChange && pcount > 2) {
			while (currentName.lastChild) {
				currentName.removeChild(currentName.lastChild);
			}

			nameSelect = currentName.appendChild(document.createElement("select"));
			for (var i = 1; i <= pcount; i++) {
				if (i === leftp.index) {
					continue;
				}

				currentOption = nameSelect.appendChild(document.createElement("option"));
				currentOption.value = i + "";
				currentOption.style.color = player[i].color; //Value;
				currentOption.textContent = player[i].name;

				if (rightp != null) {
					if (i === rightp.index) {
						currentOption.selected = "selected";
					}
				}
			}

			nameSelect.onchange = function() {
				game.resetTrade(leftp, player[parseInt(this.value, 10)], true);
			};

			nameSelect.title = "Select a player to trade with.";
		} else {
			currentName.textContent = rightp.name;
		}

		document.getElementById("trade-leftp-money").value = "0";
		document.getElementById("trade-rightp-money").value = "0";
		
		document.getElementById("trade-action-border").style.borderColor = leftp.color;

		counterProposalCount = 0;
		tradeFormFilled = false;
		setTradeFormChanged(true);
	};
	
	this.reverseTrade = function(tradeObj) {
		var reversedTradeProperty = [];
		for (var i = 0; i < 40; i++) {
			reversedTradeProperty.push(-tradeObj.getProperty(i));
		}
		return new Trade(tradeObj.getRecipient(), tradeObj.getInitiator(), -tradeObj.getMoney(), reversedTradeProperty, -tradeObj.getCommunityChestJailCard(), -tradeObj.getChanceJailCard());
	}

	var readTrade = function(initiator_index) {
		var property = new Array(40);
		var money;
		var communityChestJailCard;
		var chanceJailCard;

		if (isNaN(document.getElementById("trade-leftp-money").value)) {
			document.getElementById("trade-leftp-money").value = "This value must be a number.";
			document.getElementById("trade-leftp-money").style.color = "red";
			popup("Error with money for " + currentLeftPlayer.name);
			return false;
		}

		if (isNaN(document.getElementById("trade-rightp-money").value)) {
			document.getElementById("trade-rightp-money").value = "This value must be a number.";
			document.getElementById("trade-rightp-money").style.color = "red";
			popup("Error with money for " + currentRightPlayer.name);
			return false;
		}

		var isAPropertySelected = false;

		for (var i = 0; i < 40; i++) {
			if (document.getElementById("tradeleftcheckbox" + i) && document.getElementById("tradeleftcheckbox" + i).checked) {
				property[i] = 1;
				isAPropertySelected = true;
			} else if (document.getElementById("traderightcheckbox" + i) && document.getElementById("traderightcheckbox" + i).checked) {
				property[i] = -1;
				isAPropertySelected = true;
			} else {
				property[i] = 0;
			}
		}

		if (document.getElementById("tradeleftcheckbox40") && document.getElementById("tradeleftcheckbox40").checked) {
			communityChestJailCard = 1;
			isAPropertySelected = true;
		} else if (document.getElementById("traderightcheckbox40") && document.getElementById("traderightcheckbox40").checked) {
			communityChestJailCard = -1;
			isAPropertySelected = true;
		} else {
			communityChestJailCard = 0;
		}

		if (document.getElementById("tradeleftcheckbox41") && document.getElementById("tradeleftcheckbox41").checked) {
			chanceJailCard = 1;
			isAPropertySelected = true;
		} else if (document.getElementById("traderightcheckbox41") && document.getElementById("traderightcheckbox41").checked) {
			chanceJailCard = -1;
			isAPropertySelected = true;
		} else {
			chanceJailCard = 0;
		}

		if (isAPropertySelected === false) {
			popup("One or more items must be selected in order to trade.");
			return false;
		}

		money = parseInt(document.getElementById("trade-leftp-money").value, 10) || 0;
		money -= parseInt(document.getElementById("trade-rightp-money").value, 10) || 0;

		var trade = new Trade(currentLeftPlayer, currentRightPlayer, money, property, communityChestJailCard, chanceJailCard);
		if (currentLeftPlayer.index == initiator_index) {
			return trade;
		} else {
			return game.reverseTrade(trade);
		}
	};

	var writeTrade = function(tradeObj) {
		for (var i = 0; i < 40; i++) {
			if (document.getElementById("tradeleftcheckbox" + i)) {
				document.getElementById("tradeleftcheckbox" + i).checked = false;
				if (tradeObj.getProperty(i) === 1) {
					document.getElementById("tradeleftcheckbox" + i).checked = true;
				}
			}

			if (document.getElementById("traderightcheckbox" + i)) {
				document.getElementById("traderightcheckbox" + i).checked = false;
				if (tradeObj.getProperty(i) === -1) {
					document.getElementById("traderightcheckbox" + i).checked = true;
				}
			}
		}

		if (document.getElementById("tradeleftcheckbox40")) {
			document.getElementById("tradeleftcheckbox40").checked = (tradeObj.getCommunityChestJailCard() === 1);
		}

		if (document.getElementById("traderightcheckbox40")) {
			document.getElementById("traderightcheckbox40").checked = (tradeObj.getCommunityChestJailCard() === -1);
		}

		if (document.getElementById("tradeleftcheckbox41")) {
			document.getElementById("tradeleftcheckbox41").checked =  (tradeObj.getChanceJailCard() === 1);
		}

		if (document.getElementById("traderightcheckbox41")) {
			document.getElementById("traderightcheckbox41").checked = (tradeObj.getChanceJailCard() === -1);
		}

		if (tradeObj.getMoney() > 0) {
			document.getElementById("trade-leftp-money").value = tradeObj.getMoney() + "";
		} else {
			document.getElementById("trade-rightp-money").value = (-tradeObj.getMoney()) + "";
		}

		tradeFormFilled = true;
		setTradeFormChanged(false);
	};
	
	var humanInvolved = function(tradeObj) {
		if (tradeObj != null) {
			if (tradeObj.getInitiator != null) {
				return (tradeObj.getInitiator().human || tradeObj.getRecipient().human);
			}
		}
		return true;
	}

	this.trade = function(tradeObj) {
		var initiator = tradeObj.getInitiator();
		var recipient = tradeObj.getRecipient();

		if (recipient.human) {
			$("#nextbutton").prop("disabled", true);
		}
		
		if (counterProposalCount == 0) {
			if (initiator.human || recipient.human) {
				addAlert(initiator.name + " initiated a trade with " + recipient.name + ".");
			}
		}

		if (recipient.human) {
			game.resetTrade(initiator, recipient, false);
			writeTrade(tradeObj);
			showTrade(true);
			document.getElementById("trade-action-border").style.borderColor = recipient.color;
		} else {
			var tradeResponse = recipient.AI.acceptTrade(tradeObj);
			var popupFn = null;

			if (tradeResponse === true) {
				this.acceptTrade(tradeObj);
				if (initiator.human) {
					this.resetTrade(initiator, recipient, (initiator.index == turn));
					if (initiator.index != turn) {
						$("#proposetradebutton").hide();
						popupFn = function() {addAlert("", game.next)};
					}
					playSound(game.sounds.traded);
					popup("Congratulations, " + initiator.name + ". " + recipient.name + " accepted your offer.", popupFn);
				}
			} else if (tradeResponse === false) {
				if (initiator.human) {
					if (initiator.index != turn) {
						$("#accepttradebutton").hide();
						$("#rejecttradebutton").hide();
						popupFn = game.next;
					}
					popup("Sorry, " + initiator.name + ". " + recipient.name + " rejected your offer.", popupFn);
				}
				this.rejectTrade(tradeObj);
			} else if (tradeResponse instanceof Trade) {
				if (initiator.human) {
					popup(recipient.name + " responds to " + initiator.name + " with a counter offer.");
					game.resetTrade(initiator, recipient, false);
					writeTrade(tradeResponse);
				} else {
					if (counterProposalCount < 3) {
						counterProposalCount++;
						this.trade(tradeResponse);
					} else {
						this.rejectTrade(tradeResponse);
					}
				}
			}
		}
	};

	this.rejectTrade = function(tradeObj) {
		if (!tradeObj) {
			tradeObj = readTrade(turn);
			if (tradeObj === false) {
				return;
			}
		}

		var initiator = tradeObj.getInitiator();
		var recipient = tradeObj.getRecipient();
		if (initiator.human || recipient.human) {
			addAlert(initiator.name + " and " + recipient.name + " were unable to agree on terms.");
		}

		if (player[turn].human) {
			game.resetTrade(initiator, recipient, true);
			writeTrade(tradeObj);
			tradeFormFilled = false;
			setTradeFormChanged(true);
			document.getElementById("nextbutton").disabled = false;
		} else {
			tradeFormFilled = false;
			if (humanInvolved(tradeObj)) {
				showTrade(false);
			}
			activeAlert("[rejectTrade]", game.next);
		}
	};

	this.acceptTrade = function(tradeObj) {
		if (!tradeObj) {
			tradeObj = readTrade(turn);
			if (tradeObj === false) {
				return;
			}
		}

		var money = tradeObj.getMoney();
		var initiator = tradeObj.getInitiator();
		var recipient = tradeObj.getRecipient();
		
		if (money > 0 && money > initiator.money) {
			addAlert(initiator.name + " does not have the cash to complete the trade.");
			return false;
		} else if (money < 0 && -money > recipient.money) {
			addAlert(recipient.name + " does not have the cash to complete the trade.");
			return false;
		}

		addAlert(initiator.name + " and " + recipient.name + " agreed on terms.");
		playSound(game.sounds.traded);

		// Exchange properties
		mortgagedPropertiesRecipientGets = [];
		mortgagedPropertiesInitiatorGets = [];
		for (var i = 0; i < 40; i++) {
			if (tradeObj.getProperty(i) === 1) {
				square[i].owner = recipient.index;
				addAlert(recipient.name + " received " + square[i].name + " from " + initiator.name + ".");
				if (square[i].mortgage) {
					mortgagedPropertiesRecipientGets.push(i);
				}
			} else if (tradeObj.getProperty(i) === -1) {
				square[i].owner = initiator.index;
				addAlert(initiator.name + " received " + square[i].name + " from " + recipient.name + ".");
				if (square[i].mortgage) {
					mortgagedPropertiesInitiatorGets.push(i);
				}
			}
		}

		if (tradeObj.getCommunityChestJailCard() === 1) {
			initiator.communityChestJailCard = false;
			recipient.communityChestJailCard = true;
			addAlert(recipient.name + ' received a "Get Out of Jail Free" card from ' + initiator.name + ".");
		} else if (tradeObj.getCommunityChestJailCard() === -1) {
			initiator.communityChestJailCard = true;
			recipient.communityChestJailCard = false;
			addAlert(initiator.name + ' received a "Get Out of Jail Free" card from ' + recipient.name + ".");
		}

		if (tradeObj.getChanceJailCard() === 1) {
			initiator.chanceJailCard = false;
			recipient.chanceJailCard = true;
			addAlert(recipient.name + ' received a "Get Out of Jail Free" card from ' + initiator.name + ".");
		} else if (tradeObj.getChanceJailCard() === -1) {
			initiator.chanceJailCard = true;
			recipient.chanceJailCard = false;
			addAlert(initiator.name + ' received a "Get Out of Jail Free" card from ' + recipient.name + ".");
		}

		// Exchange money.
		if (money > 0) {
			initiator.pay(money, recipient.index, false);
			addAlert(recipient.name + " received $" + money + " from " + initiator.name + ".");
		} else if (money < 0) {
			money = -money;
			recipient.pay(money, initiator.index, false);
			addAlert(initiator.name + " received $" + money + " from " + recipient.name + ".");
		}

		if (!initiator.human) {
			game.payForMortgagedPropertiesReceived(mortgagedPropertiesInitiatorGets, recipient.name);
		}
		if (!recipient.human) {
			game.payForMortgagedPropertiesReceived(mortgagedPropertiesRecipientGets, initiator.name);
		}

		if (initiator.human && recipient.human && mortgagedPropertiesRecipientGets > 0) {
			var javascript = "game.payForMortgagedPropertiesReceived([" + mortgagedPropertiesRecipientGets[0];
			for (var i = 1; i < mortgagedPropertiesRecipientGets.length; i++) {
				javascript += "," + mortgagedPropertiesRecipientGets[i];
			}
			javascript += "], '" + initiator.name + "', 'game.next()')";
			game.payForMortgagedPropertiesReceived(mortgagedPropertiesInitiatorGets, recipient.name, javascript);
		} else if (initiator.human) {
			game.payForMortgagedPropertiesReceived(mortgagedPropertiesInitiatorGets, recipient.name, "game.next()");
		} else if (recipient.human) {
			game.payForMortgagedPropertiesReceived(mortgagedPropertiesRecipientGets, initiator.name, "game.next()");
		}
		
		updateOwned();
		updateMoney();

		tradeFormFilled = false;
		if (player[turn].human) {
			game.resetTrade(initiator, recipient, true);
			showTrade(true);
			tradeFormFilled = false;
			setTradeFormChanged(true);
			document.getElementById("nextbutton").disabled = false;
		} else {
			showTrade(false);
			activeAlert("[acceptTrade]", game.next);
		}
	};

	this.proposeTrade = function() {
		if (this.tradeInProgress()) {
			var tradeObj = readTrade(turn);
			if (!(tradeObj === false)) {
				counterProposalCount++;
				var reversed = this.reverseTrade(tradeObj);
				this.trade(reversed);
			}
		} else {
			var tradeObj = readTrade(turn);
			if (!(tradeObj === false)) {
				this.trade(tradeObj);
			}
		}
	};


	// Bankrupcy functions:

	this.eliminatePlayer = function() {
		var p = player[turn];

		addAlert(p.name + " has been eliminated.")
		
		moveToken(p.index, p.position, null, 0);
		var token = document.getElementById(p.color + "-token");
		token.parentNode.removeChild(token);

		for (var i = p.index; i < pcount; i++) {
			player[i] = player[i + 1];
			player[i].index = i;
		}

		for (var i = 0; i < 40; i++) {
			if (square[i].owner >= p.index) {
				square[i].owner--;
			}
			if (square[i].groupNumber > 2) {
				updateHouse(i);
			}
		}

		pcount--;
		turn--;
		if (turn == 0) {
			turn = pcount;
		}

		if (pcount === 2) {
			document.getElementById("stats").style.width = "454px";
		} else if (pcount === 3) {
			document.getElementById("stats").style.width = "686px";
		}

		if (pcount === 1) {
			updateMoney();
			game.endgame();
		} else {
			$("#nextbutton_group").show();
			play();
		}
	};
	
	this.endgame = function() {
		var winner = player[1];
		for (var i = 2; i <= pcount; i++) {
			if (player[i].money > winner.money) {
				winner = player[i];
			}
		}
		addAlert(winner.name + " has won the game.")
	    $("#nextbutton").hide();
		$("#resignbutton").hide();
		$("#playagain").show();
		$("#nextbutton_group").show();
		turn = 1;
		gameComplete = true;
		updateOwned();
		if (battle.length > 0) {
			var href = window.location.href;
			var botAwins = 0;
			var botBwins = 0;
			var ties = 0;
			var draws = 0;
			var nameA = (battle[0].name == battle[1].name ? "A" : battle[0].name);
			var nameB = (battle[0].name == battle[1].name ? "B" : battle[1].name);
			var i = href.indexOf(nameA + "=");
			if (i > 0) {
				var str = href.substring(i + nameA.length + 1) + "&";
				botAwins = parseInt(str.substring(0, str.indexOf("&")));
				i = href.indexOf(nameB + "=");
				str = href.substring(i + nameB.length + 1) + "&";
				botBwins = parseInt(str.substring(0, str.indexOf("&")));
				i = href.indexOf("ties=");
				str = href.substring(i + 5) + "&";
				ties = parseInt(str.substring(0, str.indexOf("&")));
				i = href.indexOf("draws=");
				str = href.substring(i + 6) + "&";
				draws = parseInt(str.substring(0, str.indexOf("&")));
			}
			if (turnCount >= turnCountLimit) {
				if (pcount == 4) {
					draws++;
				} else {
					ties++;
				}
			} else if (winner.name.indexOf("1") > 0 || winner.name.indexOf("2") > 0) {
				botAwins++;
			} else {
				botBwins++;
			}
			window.location.href = "index.html?battle&" + nameA + "=" + botAwins + "&" + nameB + "=" + botBwins + "&ties=" + ties + "&draws=" + draws;
			return;
		}
		popup("Congratulations, " + winner.name + ", you have won the game!");
	}

	this.resign = function() {
		popup("<p>Are you sure you want to resign?</p>", game.resignConfirmed, "yes/no");
	};

	this.resignConfirmed = function() {
		game.bankruptcy(true);
	};

	this.bankruptcy = function(resigned) {
		var p = player[turn];
		var pcredit = player[p.creditor];
		var bankruptcyUnmortgageFee = 0;
		
		if (p.human) {
			new ClaridgeBot(p).payDebt();
		}
		
		if (p.money > 0) {
			p.money = 0;
			p.creditor = 0;
		}

		var transferred = 0;
		var mortgagedProperties = [];

		for (var i = 0; i < 40; i++) {
			sq = square[i];
			if (sq.owner == p.index) {
				sq.owner = (options.turn_assets_over_to == "creditor" ? p.creditor : 0);
				if (sq.mortgage) {
					if (p.creditor > 0 && options.turn_assets_over_to == "creditor") {
						mortgagedProperties.push(i);
					} else {
						updateMortgage(i, false);
					}
				} else {
					if (p.creditor > 0 && options.turn_assets_over_to == "creditor") {
						pcredit.gain(sq.price * 0.5);
					}
				}

				if (sq.house > 0) {
					if (p.creditor > 0 && options.turn_assets_over_to == "creditor") {
						pcredit.gain(sq.houseprice * 0.5 * sq.house);
					}
					sq.hotel = 0;
					sq.house = 0;
				}

				if ((options.turn_assets_over_to == "bank" || p.creditor === 0) && options.bank_auction) {
					game.addPropertyToAuctionQueue(i);
				}
				transferred++;
			}
		}
		
		if (p.chanceJailCard) {
			p.chanceJailCard = false;
			pcredit.chanceJailCard = true;
		}

		if (p.communityChestJailCard) {
			p.communityChestJailCard = false;
			pcredit.communityChestJailCard = true;
		}

		updateOwned();

		var message = p.name + (resigned ? " resigned." : " is bankrupt.") + "  All assets have been turned over to ";
		if (p.money < 0 && options.turn_assets_over_to == "creditor") {
			message += "the creditor, " + player[p.creditor].name + ".";
		} else {
			message += "the bank.";
		}
		addAlert(message);

		updateMoney();

		if (!game.payForMortgagedPropertiesReceived(mortgagedProperties, p.name, "game.eliminatePlayer()")) {
			activeAlert("[bankruptcy]", game.eliminatePlayer);
		}
	};
	
	this.payForMortgagedPropertiesReceived = function(properties, debtorname, callbackText) {
		if (properties.length == 0 || !options.pay_interest_on_transfer) {
			return false;
		}
			
		var p = player[square[properties[0]].owner];
		if (p.human) {
			var HTML = "<div>" + p.name + " must either unmortgage the mortgaged properties received" + (debtorname == null ? "" : " from " + debtorname) + " or pay interest on them.</div>";
			HTML += "<table>";
			for (var i = 0; i < properties.length; i++) {
				sq = square[properties[i]];
				var price1 = Math.ceil(sq.price * 0.5 + sq.price * 0.5 * options.mortgage_rate);
				var price2 = Math.ceil(sq.price * 0.5 * options.mortgage_rate);
				HTML += "<tr><td class='propertycellcolor' style='background: " + sq.color + "; border: 1px solid " + (sq.groupNumber == 1 || sq.groupNumber == 2 ? "grey" : sq.color) + "' "
				     +  "onmouseover='showdeed(" + properties[i] + ");' onmouseout='hidedeed();'></td>"
					 +  "<td style='width: 160px; text-align: left'>" + sq.name + "</td>"
					 +  "<td style='text-align: right'><input type='button' value='Unmortgage for $" + price1 + "' onclick='"
					 +  "if (" + price1 + " <= player[" + p.index + "].money) {unmortgage(" + properties[i] + ")}"
					 +  "this.parentElement.parentElement.style.display = \"none\"'>"
					 +  "<input type='button' value='Pay $" + price2 + "' onclick='"
					 +  "player[" + p.index + "].pay(" + price2 + ",0);"
					 +  "addAlert(\"" + p.name + " paid $" + price2 + " interest on mortgaged property " + sq.name + ".\");"
					 +  "this.parentElement.parentElement.style.display = \"none\"'>"
					 +  "</td></tr>";
			}

			HTML += "</table>";
			HTML += "<input type='button' value='OK' onclick='if (this.parentElement.getElementsByTagName(\"table\")[0].offsetHeight < 10) {$(\"#nextbutton_group\").show(); hideLanded(); " + callbackText + "}'>";
			$("#nextbutton_group").hide();
			showLanded(HTML, p.index, true);
			return true;
		} else {
			p.AI.unmortgagePropertiesReceived(properties);
			for (var i = 0; i < properties.length; i++) {
				if (square[properties[i]].mortgage) {
					var interest = Math.ceil(square[properties[i]].price * 0.5 * options.mortgage_rate);
					p.pay(interest, 0);
					addAlert(p.name + " paid $" + interest + " interest on mortgaged property " + square[properties[i]].name + ".");
				}
			}
			return false;
		}
	}
}

var game;


function Player(name, color) {
	this.name = name;
	this.color = color;
	this.position = 0;
	this.money = 1500;
	this.creditor = -1;
	this.owed = 0;
	this.jail = false;
	this.jailroll = 0;
	this.communityChestJailCard = false;
	this.chanceJailCard = false;
	this.bidding = true;
	this.human = true;

	this.gain = function(amount, sound) {
		if (sound === false) {
			// Don't play sound
		} else {
			if (this.human) {
				if (amount >= 200) {
					addToSoundQueue(game.sounds.gainedBig);
				} else if (amount > 0) {
					addToSoundQueue(game.sounds.gained);
				}
			}
		}
		var settled = false;
		if (this.money < 0) {
			if (this.owed > 0) {
				if (amount <= this.owed) {
					if (this.creditor > 0) {
						player[this.creditor].money += amount;
					}
					this.owed -= amount;
				} else {
					if (this.creditor > 0) {
						player[this.creditor].money += this.owed;
					}
					this.owed = 0;
					settled = true;
				}
			}
		}
		this.money += amount;
		updateMoney();
		if (settled) {
			addAlert(this.name + " settled up with " + player[this.creditor].name + ".");
			this.creditor = -1;
		}
	}
	
	this.pay = function(amount, creditor, sound) {
		if (sound === false) {
			// Don't play sound
		} else {
			if (this.human) {
				if (amount >= 200) {
					addToSoundQueue(game.sounds.lostBig);
				} else if (amount > 0) {
					addToSoundQueue(game.sounds.lost);
				}
			}
			if (amount >= 200) {
				addToSoundQueue(game.sounds.payout, 5.5 - Math.floor(amount / 100) * .25);
			}
		}
		if (amount <= this.money) {
			if (creditor > 0) {
				player[creditor].gain(amount);
			}
			this.money -= amount;
			updateMoney();
			return true;
		} else {
			if (creditor > 0) {
				player[creditor].gain(this.money);
			}
			this.money -= amount;
			this.creditor = creditor;
			this.owed = -this.money;
			updateMoney();
			return false;
		}
	};
	
	this.liquidity = function() {
		var liquidity = this.money;
		for (var i = 0; i < 40; i++) {
			if (square[i].owner == this.index && !square[i].mortgage) {
				liquidity += Math.ceil(square[i].price * 0.5) + square[i].house * square[i].houseprice / 2;
			}
		}
		return liquidity;
	}

	this.netWorth = function() {
		var netWorth = this.money;
		for (var i = 0; i < 40; i++) {
			if (square[i].owner == this.index && !square[i].mortgage) {
				netWorth += square[i].price + square[i].house * square[i].houseprice;
			}
		}
		return netWorth;
	}
}

// paramaters:
// initiator: object Player
// recipient: object Player
// money: integer, positive for offered, negative for requested
// property: array of integers, length: 40
// communityChestJailCard: integer, 1 means offered, -1 means requested, 0 means neither
// chanceJailCard: integer, 1 means offered, -1 means requested, 0 means neither
function Trade(initiator, recipient, money, property, communityChestJailCard, chanceJailCard) {
	// For each property and get out of jail free cards, 1 means offered, -1 means requested, 0 means neither.

	this.getInitiator = function() {
		return initiator;
	};

	this.getRecipient = function() {
		return recipient;
	};

	this.getProperty = function(index) {
		return property[index];
	};

	this.setMoney = function(m) {
		money = m;
	};

	this.getMoney = function() {
		return money;
	};

	this.getCommunityChestJailCard = function() {
		return communityChestJailCard;
	};

	this.getChanceJailCard = function() {
		return chanceJailCard;
	};
}

var square = [];
var communityChestCards = [];
var chanceCards = [];
var editions = [];
var edition = 0;

var player = [];
var pcount;
var options = {
	sound: true,
	houseLimit: 9999,
	hotelLimit: 9999,
	delayed_start: false
}
var turn = 0;
var doublecount = 0;
var botsOnly = false;
var turnCount = 0;
var turnCountLimit = 500;

var tookChanceInsteadOfFine = false;

// Overwrite an array with numbers from one to the array's length in a random order.
Array.prototype.randomize = function(length) {
	length = (length || this.length);
	var num;
	var indexArray = [];

	for (var i = 0; i < length; i++) {
		indexArray[i] = i;
	}

	for (var i = 0; i < length; i++) {
		// Generate random number between 0 and indexArray.length - 1.
		num = Math.floor(Math.random() * indexArray.length);
		this[i] = indexArray[num] + 1;

		indexArray.splice(num, 1);
	}
};

function addAlert(alertHTML) {
	var div = document.createElement("div");
	div.style.borderLeft = "5px solid " + player[turn].color;
	div.style.paddingLeft = "5px";
	if (alertHTML.substring(0,1) != "[") {
		div.innerHTML = "<span>" + turnCount + ":" + "</span>" + alertHTML;
		document.getElementById("game-general-alert-html").innerHTML = alertHTML;
	}
	document.getElementById("alert").appendChild(div);
	$alert = $("#alert");

	// Animate scrolling down alert element.
	$alert.stop().animate({"scrollTop": $alert.prop("scrollHeight")}, 1000);
}

function popupcard(deck, index) {
	if (botsOnly) {
		cardAction(deck, index);
		return;
	}
	
	$("#cardclose").click();

	var html = "";
	if (deck[index].deckName == "Chance") {
		html += "<div class='chance-icon' style='font-family: \"Noto Emoji\"'>&#x2753;&#xFE0E;</div>";
		document.getElementById("cardpopup").className = "chancepopup";
	} else {
		html += "<div class='community-chest-icon' style='font-family: \"Noto Emoji\"'>&#x1F381;&#xFE0E;</div>";
		document.getElementById("cardpopup").className = "communitychestpopup";
	}
	html += "<div style='padding-left:60px; padding-right:20px'><b>" + deck[index].deckName + "</b><br><br>";
	if (player[turn].human) {
		html += deck[index].text;
	} else {
		html += deck[index].text.replace("<a", "<span").replace("</a>", "</span>").replace("onclick", "noclick");
	}
	html += "</div>";
	document.getElementById("cardtext").innerHTML = html;
	var closeCard = function() {
		$("#cardpopup").hide();
		$("#cardclose").off("click", closeCard);
		$("#okbutton").off("click", closeCard);
		$("#okbutton").hide();
		$("#nextbutton_group").show();
		addAlert("[cardclose]");
		cardAction(deck, index);
	};

	$("#nextbutton_group").hide();
	$("#cardclose").on("click", closeCard);
	$("#okbutton").on("click", closeCard);
	$("#cardpopup").show();
	$("#okbutton").show();
}

function popup(HTML, action, option) {
	document.getElementById("popuptext").innerHTML = HTML;

	if (botsOnly) {
		if (action != null) {
			action();
		}
		return;
	}
	
	document.getElementById("popup").style.width = "300px";
	document.getElementById("popup").style.top = "0px";
	document.getElementById("popup").style.left = "0px";

	// Yes/No
	if (option === "yes/no") {
		document.getElementById("popuptext").innerHTML += "<div><input type=\"button\" value=\"Yes\" id=\"popupyes\" /><input type=\"button\" value=\"No\" id=\"popupno\" /></div>";

		$("#popupyes, #popupno").on("click", function() {
			var yesClicked = (this.id == "popupyes");
			addAlert(yesClicked ? "[popupyes]" : "[popupno]");
			$("#popupwrap").hide();
			$("#popupbackground").fadeOut(400);
			$("#popupyes").off("click");
			$("#popupno").off("click");
			if (action != null && yesClicked) {
				action();
			}
		});

	// Ok
	} else if (option !== "blank") {
		$("#popuptext").append("<div><input type='button' value='OK' id='popupclose' /></div>");
		$("#popupclose").focus();

		$("#popupclose").on("click", function() {
			addAlert("[popupclose]");
			$("#popupwrap").hide();
			$("#popupbackground").fadeOut(400);
			$("#popupclose").off("click");
			if (action != null) {
				action();
			}
		});

	}

	// Show using animation.
	$("#popupbackground").fadeIn(400, function() {
		$("#popupwrap").show();
	});

}

function showLog(opt) {
	showDeeds(false);
	$("#manage").hide();
	$("#trade").hide();
	if (opt == "toggle") {
		$("#log").toggle();
	} else {
		$("#log").toggle(opt);
	}
}

function showDeeds(opt) {
	$("#log").hide();
	$("#manage").hide();
	$("#trade").hide();
	if (opt == "toggle") {
		$("#deeds").toggle();
	} else {
		$("#deeds").toggle(opt);
	}
	if ($("#deeds").is(':hidden')) {
		for (var i = 1; i < 40; i++) {
			document.getElementById("cell" + i).removeEventListener("mouseover", showMouseDeed);
		}
		hidedeed();
	} else {
		var rect = document.getElementById("deeds").getBoundingClientRect();
		document.getElementById("deed").style.top = Math.max(rect.y + rect.height / 2 - 140, 185) + "px";
		document.getElementById("deed").style.left = (rect.x + rect.width / 2 - 120) + "px";
		if (square[player[turn].position].groupNumber == 0) {
			showdeed(1);
		} else {
			showdeed(player[turn].position);
		}
		for (var i = 0; i < 40; i++) {
			document.getElementById("cell" + i).addEventListener("mouseover", showMouseDeed);
		}
	}
}

function showMouseDeed() {
	var i = parseInt(window.event.target.id.substring(4));
	if (square[i].groupNumber > 0) {
		showdeed(i);
	} else {
		hidedeed();
	}
}

function highlightArrow(highlightArrow) {
	window.event.target.style.color = (highlightArrow ? "blue" : "black");
}

function nextDeed(inc) {
	game.deedShown += inc;
	if (game.deedShown >= 40) {
		game.deedShown = 1;
	}
	if (game.deedShown <= 0) {
		game.deedShown = 39;
	}
	if (square[game.deedShown].groupNumber == 0) {
		nextDeed(inc);
	} else {
		showdeed(game.deedShown);
	}
}

function showManage(opt) {
	$("#log").hide();
	showDeeds(false);
	$("#trade").hide();
	if (opt == "toggle") {
		$("#manage").toggle();
	} else {
		$("#manage").toggle(opt);
	}
}

function showTrade(opt) {
	$("#log").hide();
	showDeeds(false);
	$("#manage").hide();
	if (opt == "toggle") {
		$("#trade").toggle();
	} else {
		$("#trade").toggle(opt);
	}
}

function activeAlert(HTML, action, option) {
	if (typeof action !== "function") {
		action = null;
	}

	if (typeof HTML === "string") {
		addAlert(HTML);
	}
	
	if (botsOnly && option != "status") {
		if (action != null) {
			action();
		}
		return;
	}

	$("#nextbutton_group").hide();

	$("#okbutton").on("click", function() {
		addAlert("[okbutton]");
		$("#okbutton").off("click");
		$("#okbutton").hide();
		$("#nextbutton_group").show();
		if (action != null) {
			action();
		}
	});

	$("#okbutton").show();
}	

function updatePosition(targetPosition, direction) {
	var lastPosition = null;
	if (typeof targetPosition == "number" && typeof player[turn].position == "number") {
		lastPosition = player[turn].position;
		player[turn].position = targetPosition;
	}
	moveToken(turn, lastPosition, player[turn].position, direction);
}

function updateTurn() {
	document.getElementById("player-up-html").innerHTML = player[turn].name + "<br>is up";
	var divs = document.getElementById("pawn").getElementsByTagName("div");
	for (var i = 1; i < divs.length; i++) {
		if (divs[i].className.indexOf("main") < 0 && divs[i].className.indexOf("glare") < 0) {
			divs[i].style.backgroundColor = player[turn].color; //Value;
		}
	}
}

function updateMoney() {
	var p = player[turn];

	document.getElementById("pmoney").innerHTML = "$" + p.money;
	$(".money-bar-row").hide();

	for (var i = 1; i <= pcount; i++) {
		p_i = player[i];

		$("#moneybarrow" + i).show();
		document.getElementById("p" + i + "arrow").style.color = p_i.color;
		document.getElementById("p" + i + "moneybar").style.border = "3px solid " + p_i.color;
		document.getElementById("p" + i + "money").innerHTML = p_i.money;
		document.getElementById("p" + i + "moneyname").innerHTML = p_i.name;
	}
	

	document.getElementById("quickstats").style.borderColor = p.color; //Value;

	if (p.money < 0) {
		if (p.human) {
			$("#resignbutton").show();
		} else {
			$("#resignbutton").hide()
		}
		$("#nextbutton").hide();
	} else {
		$("#resignbutton").hide();
		$("#nextbutton").show();
		
		// Resolve potential sales
		for (var i = 0; i < 40; i++) {
			if (square[i].owner == -turn) {
				square[i].owner = turn;
			}
		}
	}
}

function updateDice() {
	var die0 = game.getDie(1);
	var die1 = game.getDie(2);

	$("#die0").show();
	$("#die1").show();

	document.getElementById("die0").textContent = die0;
	document.getElementById("die1").textContent = die1;

	document.getElementById("die0").title = "Die";
	document.getElementById("die1").title = "Die";

	//var control = document.getElementById("control");
	var lastx = 0, lasty = 0;
	for (var i = 0; i < 2; i++) {
		var die = document.getElementById("board-die-" + i);
		while (die.firstChild != null) {
			die.removeChild(die.firstChild);
		}
		die.className = "die-face";
		die.style.position = "absolute";
		var x = lastx;
		var y = lasty;
		while (Math.abs(x - lastx) < 50 && Math.abs(y - lasty) < 50) {
			x = (150 + Math.floor(Math.random() * 550));
			y = (150 + Math.floor(Math.random() * 400));
		}
		die.style.left = x + "px";
		die.style.top = y + "px";
		die.style.transform = "rotate(" + Math.floor(Math.random() * 360) + "deg)";
		for (j = 0; j < game.getDie(i); j++) {
			var pip = document.createElement("span");
			pip.className = "pip";
			die.appendChild(pip);
		}
		lastx = x;
		lasty = y;
	}
}

function updateOwned() {
	var p = player[turn];
	var checkedproperties = getCheckedProperties();
	$("#option").show();
	$("#owned").show();

	var HTML = "",
	firstproperty = -1;

	var mortgagetext = "",
	housetext = "";
	var sq;

	for (var i = 0; i < 40; i++) {
		sq = square[i];
		if (sq.groupNumber && sq.owner === 0) {
			$("#cell" + i + "owner").hide();
		} else if (sq.groupNumber && sq.owner > 0) {
			var currentCellOwner = document.getElementById("cell" + i + "owner");

			currentCellOwner.style.display = "block";
			currentCellOwner.style.backgroundColor = player[sq.owner].color; //Value;
			currentCellOwner.title = player[sq.owner].name;
		}
	}

	for (var i = 0; i < 40; i++) {
		sq = square[i];
		if (sq.owner == turn) {

			mortgagetext = "";
			if (sq.mortgage) {
				mortgagetext = "title='Mortgaged' style='color: grey;'";
			}

			housetext = "";
			if (sq.house >= 1 && sq.house <= 4) {
				for (var x = 1; x <= sq.house; x++) {
					housetext += "<img src='" + game.images.house + "' alt='' title='House' class='house' />";
				}
			} else if (sq.hotel) {
				housetext += "<img src='" + game.images.hotel + "' alt='' title='Hotel' class='hotel' />";
			}

			if (HTML === "") {
				HTML += "<table>";
				firstproperty = i;
			}

			HTML += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox" + i + "' /></td><td class='propertycellcolor' style='background: " + sq.color + ";";

			if (sq.groupNumber == 1 || sq.groupNumber == 2) {
				HTML += " border: 1px solid grey; width: 18px;";
			}

			HTML += "' onmouseover='showdeed(" + i + ");' onmouseout='hidedeed();'></td><td class='propertycellname' " + mortgagetext + ">" + sq.name + housetext + "</td></tr>";
		}
	}

	if (p.communityChestJailCard) {
		if (HTML === "") {
			firstproperty = 40;
			HTML += "<table>";
		}
		HTML += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox40' /></td><td class='propertycellcolor' style='background: white;'></td><td class='propertycellname'>Get Out of Jail Free Card</td></tr>";

	}
	if (p.chanceJailCard) {
		if (HTML === "") {
			firstproperty = 41;
			HTML += "<table>";
		}
		HTML += "<tr class='property-cell-row'><td class='propertycellcheckbox'><input type='checkbox' id='propertycheckbox41' /></td><td class='propertycellcolor' style='background: white;'></td><td class='propertycellname'>Get Out of Jail Free Card</td></tr>";
	}

	if (HTML === "") {
		HTML = p.name + ", you don't have any properties.";
		$("#option").hide();
	} else {
		HTML += "</table>";
	}

	document.getElementById("owned").innerHTML = HTML;

	// Select previously selected property.
	for (var i = 0; i < checkedproperties.length; i++) {
		var checkbox = document.getElementById("propertycheckbox" + checkedproperties[i]);
		if (checkbox) {
			checkbox.checked = true;
		}
	}
	
	$(".propertycellname").click(function() {
		$(this).parent().find(".propertycellcheckbox > input").prop("checked", function(index, val) {
			unCheckProperties();
			return true;
		});
	});
	
	$(".property-cell-row").click(function() {
		updateOption();
	});
	
	updateOption();
}

function updateOption() {
	$("#option").show();

	var checkedproperties = getCheckedProperties();

	var buyhousebutton = document.getElementById("buyhousebutton");
	var sellhousebutton = document.getElementById("sellhousebutton");
	var mortgagebutton = document.getElementById("mortgagebutton");

	buyhousebutton.value = "Buy";
	buyhousebutton.disabled = true;

	mortgagebutton.value = "Mortgage";
	mortgagebutton.disabled = true;

	sellhousebutton.value = "Sell";
	sellhousebutton.disabled = true;

	if (checkedproperties.length == 0) {
		return;
	}

	var housesum = options.houseLimit;
	var hotelsum = options.hotelLimit;

	for (var i = 0; i < 40; i++) {
		var s = square[i];
		if (s.hotel == 1) {
			hotelsum--;
		} else {
			housesum -= s.house;
		}
	}

	document.getElementById("buildings").innerHTML = "<img src='" + game.images.house + "' alt='' title='House' class='house' />:&nbsp;" + housesum + "&nbsp;&nbsp;<img src='" + game.images.hotel + "' alt='' title='Hotel' class='hotel' />:&nbsp;" + hotelsum;
	
	var canBuy = true;
	var canSell = true;
	var canMortgage = true;
	var canUnmortgage = true;
	var mortgagePrice = 0;
	var unmortgagePrice = 0;
	var buyPrice = 0;
	var salePrice = 0;
	var housesToBuy = 0;
	var hotelsToBuy = 0;
	var housesToSell = 0;
	var hotelsToSell = 0;
	
	for (var i = 0; i < checkedproperties.length; i++) {
		var checkedproperty = checkedproperties[i];
		if (checkedproperty > 40) {
			canBuy = false;
			canSell = false;
			canMortgage = false;
			canUnmortgage = false;
			continue;
		}
		var sq = square[checkedproperty];

		if (!!sq.mortgage) {
			canBuy = false;
			canSell = false;
			canMortgage = false;
			unmortgagePrice += Math.ceil(sq.price * 0.5 + sq.price * 0.5 * options.mortgage_rate);
		} else {
			canUnmortgage = false;
			mortgagePrice += Math.ceil(sq.price * 0.5);
			buyPrice += sq.houseprice;
			salePrice += sq.houseprice / 2;

			if (sq.groupNumber >= 3) {
				var allOwned = true;
				var allUnmortgaged = true;
				var allUnbuilt = true;
				var maxAfterBuy = -1;
				var minAfterBuy = 6;
				var maxAfterSell = -1;
				var minAfterSell = 6;
				for (var j = 0; j < sq.group.length; j++) {
					var checked = false;
					for (var k = 0; k < checkedproperties.length; k++) {
						if (checkedproperties[k] == sq.group[j]) {
							checked = true;
							break;
						}
					}
					
					var s = square[sq.group[j]];
					
					if (s.owner != sq.owner) {
						allOwned = false;
					}
					
					if (!!s.mortgage) {
						allUnmortgaged = false;
					}
					
					if (s.house > 0) {
						allUnbuilt = false;
					}
					
					if (s.house + (checked ? 1 : 0) > maxAfterBuy) {
						maxAfterBuy = s.house + (checked ? 1 : 0);
					}
					if (s.house + (checked ? 1 : 0) < minAfterBuy) {
						minAfterBuy = s.house + (checked ? 1 : 0);
					}
					if (s.house - (checked ? 1 : 0) > maxAfterSell) {
						maxAfterSell = s.house - (checked ? 1 : 0);
					}
					if (s.house - (checked ? 1 : 0) < minAfterSell) {
						minAfterSell = s.house - (checked ? 1 : 0);
					}
				}
				
				if (!allUnbuilt || maxAfterBuy != 1) {
					canMortgage = false;
				}
				if (!allOwned || !allUnmortgaged || maxAfterBuy - minAfterBuy > 1 || minAfterBuy > 5) {
					canBuy = false;
				}
				if (!allOwned || maxAfterSell - minAfterSell > 1 || minAfterSell < 0) {
					canSell = false;
				}
				if (sq.house == 4) {
					hotelsToBuy++;
				} else {
					housesToBuy++;
				}
				if (sq.house == 5) {
					hotelsToSell++;
				} else {
					housesToSell++;
				}
			} else {
				canBuy = false;
				canSell = false;
			}
		}
	}
	
	if (canBuy) {
		buyhousebutton.value = "Buy ";
		if (housesToBuy > 0 && hotelsToBuy == 0) {
			buyhousebutton.value += "house";
			if (housesToBuy > 1) {
				buyhousebutton.value += "s";
			}
		} else if (hotelsToBuy > 0 && housesToBuy == 0) {
			buyhousebutton.value += "hotel";
			if (hotelsToBuy > 1) {
				buyhousebutton.value += "s";
			}
		} else {
			buyhousebutton.value += " on All";
		}
		buyhousebutton.value += " (" + buyPrice + ")";
		buyhousebutton.disabled = false;
	}

	if (canMortgage) {
		mortgagebutton.value = "Mortgage" + (checkedproperties.length > 1 ? " All" : "") + " (+" + mortgagePrice + ")";
		mortgagebutton.disabled = false;
	}
	
	if (canUnmortgage) {
		mortgagebutton.value = "Unmortgage" + (checkedproperties.length > 1 ? " All" : "") + " (" + unmortgagePrice + ")";
		mortgagebutton.disabled = false;
	}

	if (canSell) {
		sellhousebutton.value = "Sell ";
		if (housesToSell > 0 && hotelsToSell == 0) {
			sellhousebutton.value += "house";
			if (housesToSell > 1) {
				sellhousebutton.value += "s";
			}
		} else if (hotelsToSell > 0 && housesToSell == 0) {
			sellhousebutton.value += "hotel";
			if (hotelsToSell > 1) {
				sellhousebutton.value += "s";
			}
		} else {
			sellhousebutton.value += " on All";
		}
		sellhousebutton.value += " (" + salePrice + ")";
		sellhousebutton.disabled = false;
	}
}

function chanceCommunityChest(deckname) {
	var p = player[turn];
	
	var cards = (deckname == "Chance" ? chanceCards : communityChestCards);

	var index = cards.deck[cards.index];
	if (document.forms.cheats != null) {
		var cheat = document.forms.cheats.elements[deckname == "Chance" ? "cheatchance" : "cheatcommunitychest"];
		if (cheat.value != "") {
			index = Number(cheat.value);
			cheat.value = "";
		}
	}

	// Remove the get out of jail free card from the deck.
	if (cards[index].text.indexOf("GET OUT OF JAIL FREE") == 0) {
		cards.deck.splice(cards.index, 1);
	}

	popupcard(cards, index);

	cards.index++;

	if (cards.index >= cards.deck.length) {
		cards.index = 0;
	}
}

function cardAction(deck, index) {
	var p = player[turn]; // This is needed for reference in action() method.
	
	var gotojail = (deck[index].text.indexOf("Go to jail") == 0);

	if (!gotojail && !p.human) {
		$("#okbutton").hide();
	}
		
	deck[index].action(p);

	updateMoney();

	if (!gotojail && !p.human) {
		//p.AI.alertList = "";
		if ($("#okbutton").is(":hidden")) {
			activeAlert("[cardAction]", game.next);
		}
	}
}

function addamount(amount, cause) {
	var p = player[turn];

	p.gain(amount);

	addAlert(p.name + " received $" + amount + " from " + cause + ".");
}

function subtractamount(amount, cause) {
	var p = player[turn];

	p.pay(amount, 0);

	addAlert(p.name + " lost $" + amount + " from " + cause + ".");
}

function gotojail() {
	var p = player[turn];
	p.jail = true;
	doublecount = 0;

	addAlert(p.name + " went directly to jail.");
	playSound(game.sounds.jail);
	if (p.human) {
		showLanded("You are now in jail.");
		setNextButton("End turn");
		document.getElementById("nextbutton").focus();
	}

	updatePosition(40);
	updateOwned();

	if (!p.human) {
		activeAlert("[gotojail]", game.next);
	}
}

function receivecard(cardname) {
	var p = player[turn];
	p[cardname] = true;
	updateOwned();
	addAlert(p.name + " received a Get Out of Jail Free card.");
}


function skipspaces(spaces) {
	var p = player[turn];

	updatePosition((p.position + spaces + 40) % 40, (spaces >= 1 ? 1 : -1));
	addAlert(p.name + " went " + (spaces >= 1 ? "forward" : "back") + spaces + " spaces to " + square[p.position].name + ".");

	land();
}

function fineordraw(fine) {
	var p = player[turn];
	if (p.human) {
		if (!tookChanceInsteadOfFine) {
			subtractamount(10, 'Community Chest');
		}
	} else {
		if (p.AI.fineOrDraw(fine) == 'draw') {
			takeChanceInsteadOfFine();
		} else {
			subtractamount(10, 'Community Chest');
		}
	}
	tookChanceInsteadOfFine = false;
}

function takeChanceInsteadOfFine() {
	tookChanceInsteadOfFine = true;
	addAlert(player[turn].name + " took a Chance card instead of paying a fine.");
	chanceCommunityChest("Chance");
}

function gobackto(destination) {
	var p = player[turn];

	updatePosition(destination, -1);
	addAlert(p.name + " went back to " + square[p.position].name + ".");

	land();
}

function payeachplayer(amount, cause) {
	var p = player[turn];
	var total = 0;

	for (var i = 1; i <= pcount; i++) {
		if (i != turn) {
			player[i].gain(amount);
			total += amount;
			p.pay(amount, 0);
		}
	}

	addAlert(p.name + " paid $" + amount + " to each player, for a total of $" + total + ".");
}

function collectfromeachplayer(amount, cause) {
	var p = player[turn];
	var total = 0;

	for (var i = 1; i <= pcount; i++) {
		if (i != turn) {
			money = player[i].money;
			if (money < amount) {
				p.gain(money);
				total += money;
				player[i].money = 0;
			} else {
				player[i].pay(amount, 0); //, turn);
				p.gain(amount);
				total += amount;
			}
		}
	}

	addAlert(p.name + " received $" + total + ", $" + amount + " from each player.");
}

function advance(destination, dest_name, increasedrent) {
	var p = player[turn];
	var old_position = p.position;

	updatePosition(destination);
	var msg = p.name + " advanced to ";
	if (dest_name == null) {
		msg += square[destination].name;
	} else {
		msg += dest_name;
	}
	if (old_position > destination && destination > 0) {
		p.gain(200, p.human);
		game.buyingStarted = true;
		msg += ", collecting $200 for passing GO";
	}
	addAlert(msg + ".");

	land(increasedrent);
}

function advanceToNearestUtility() {
	var p = player[turn];
	var dest_name = "the nearest utility";

	if (p.position < 12) {
		advance(12, dest_name, true);
	} else if (p.position >= 12 && p.position < 28) {
		advance(28, dest_name, true);
	} else if (p.position >= 28) {
		advance(12, dest_name, true);
	}
}

function advanceToNearestRailroad() {
	var p = player[turn];
	var dest_name = "the nearest railroad";

	if (p.position < 5) {
		advance(5, dest_name, true);
	} else if (p.position < 15) {
		advance(15, dest_name, true);
	} else if (p.position < 25) {
		advance(25, dest_name, true);
	} else if (p.position < 35) {
		advance(35, dest_name, true);
	} else {
		advance(5, dest_name, true);
	}
}

function streetrepairs(houseprice, hotelprice) {
	var cost = 0;
	for (var i = 0; i < 40; i++) {
		var s = square[i];
		if (s.owner == turn) {
			if (s.hotel == 1)
				cost += hotelprice;
			else
				cost += s.house * houseprice;
		}
	}

	var p = player[turn];

	if (cost > 0) {
		p.pay(cost, 0);
	}
	addAlert(p.name + " spent $" + cost + " on street repairs.");
}

function payfifty() {
	var p = player[turn];

	hideLanded();
	if (p.jailroll != 3) {
		doublecount = 0;
	}

	p.jail = false;
	p.jailroll = 0;
	updatePosition(10);
	p.pay(50, 0);
	if (options.bonus == "bail") {
		game.bonus += 50;
		updateBonus();
	}

	addAlert(p.name + " paid the $50 fine to get out of jail.");
	updateMoney();
}

function useJailCard() {
	var p = player[turn];

	hideLanded();
	p.jail = false;
	p.jailroll = 0;

	updatePosition(10);

	doublecount = 0;

    var cards;
	if (p.communityChestJailCard) {
		p.communityChestJailCard = false;
		cards = communityChestCards;
	} else if (p.chanceJailCard) {
		p.chanceJailCard = false;
		cards = chanceCards;
	}
	
	for (var i = 0; i < cards.length; i++) {
		if (cards[i].text.indexOf("GET OUT OF JAIL") == 0) {
			// Insert the get out of jail free card back into the deck.
			cards.deck.splice(cards.index, 0, i);
			cards.index++;
			break;
		}
	}

	if (cards.index >= cards.deck.length) {
		cards.index = 0;
	}

	addAlert(p.name + " used a \"Get Out of Jail Free\" card.");
	updateOwned();
}

function buyHouse(index) {
	var sq = square[index];
	var p = player[sq.owner];
	var houseSum = 0;
	var hotelSum = 0;

	if (p.money - sq.houseprice < 0) {
		if (sq.house == 4) {
			return false;
		} else {
			return false;
		}

	} else {
		for (var i = 0; i < 40; i++) {
			if (square[i].hotel === 1) {
				hotelSum++;
			} else {
				houseSum += square[i].house;
			}
		}

		if (sq.house < 4) {
			if (houseSum >= options.houseLimit) {
				return false;

			} else {
				sq.house++;
				addAlert(p.name + " placed a house on " + sq.name + ".");
				playSound(game.sounds.built);
			}

		} else {
			if (hotelSum >= options.hotelLimit) {
				return;

			} else {
				sq.house = 5;
				sq.hotel = 1;
				addAlert(p.name + " placed a hotel on " + sq.name + ".");
				playSound(game.sounds.built);
			}
		}

		p.pay(sq.houseprice, 0, false);

		updateOwned();
		updateMoney();
		updateHouse(index);
	}
}

function updateHouse(index) {
	var sq = square[index];
	var cell = document.getElementById("cell" + index);
	var cb = cell.getElementsByClassName("color-bar")[0];
	while (cb.firstChild != null) {
		cb.removeChild(cb.firstChild);
	}
	var buildings = sq.house;
	var buildingType = "house";
	if (sq.hotel) {
		buildings = 1;
		buildingType = "hotel";
	}
	for (var i = 0; i < buildings; i++) {
		var sides = 0;
		var loc = "mid";
		if ((index % 10) < 3) {
			loc = "right";
			sides = 4
		}
		if ((index % 10) > 7) {
			loc = "left";
			sides = 4
		}
		var building = document.createElement("div");
		building.className = buildingType + "-" + loc;
		building.style.top = "-1px";
		var x;
		if (sq.hotel) {
			x = 18;
		} else if (sq.house == 1) {
			x = 25;
		} else if (sq.house == 2) {
			x = 15;
		} else if (sq.house == 3) {
			x = 5;
		} else if (sq.house == 4) {
			x = -5;
			if (square[(index + 1) % 40].groupNumber == sq.groupNumber) {
				x += 2;
			}
			if (square[index - 1].groupNumber == sq.groupNumber) {
				x -= 2;
			}
		}
		building.style.left = (x + i * 20) + "px";
		var roof = document.createElement("div");
		roof.className = buildingType + "-" + loc + "-roof";
		building.appendChild(roof);
		for (var j = 1; j <= sides; j++) {
			var side = document.createElement("div");
			side.className = buildingType + "-" + loc + "-side-" + j;
			building.appendChild(side);
		}
		for (var j = 1; j <= 3; j++) {
			var chimney = document.createElement("div");
			chimney.className = buildingType + "-" + loc + "-chimney-" + j;
			building.appendChild(chimney);
		}
		var ridge = document.createElement("div");
		ridge.className = buildingType + "-" + loc + "-ridge";
		building.appendChild(ridge);
		cb.appendChild(building);
	}
}

function sellHouse(index) {
	var sq = square[index];
	var p = player[sq.owner];

	if (sq.hotel === 1) {
		sq.hotel = 0;
		sq.house = 4;
		addAlert(p.name + " sold the hotel on " + sq.name + ".");
	} else {
		sq.house--;
		addAlert(p.name + " sold a house on " + sq.name + ".");
	}
	playSound(game.sounds.sold);
	p.gain(sq.houseprice * 0.5, false);
	
	updateOwned();
	updateMoney();
	updateHouse(index);
}

function sellHouses(properties, num) {
	for (var i = 0; i < num; i++) {
		for (var j = 0; j < properties.length; j++) {
			sellHouse(properties[j]);
		}
	}
}
		
function showStats() {
	var HTML, sq, p;
	var mortgagetext,
	housetext;
	var write;
	HTML = "<table align='center'><tr>";

	for (var x = 1; x <= pcount; x++) {
		write = false;
		var p = player[x];
		if (x == 5) {
			HTML += "</tr><tr>";
		}
		HTML += "<td class='statscell' id='statscell" + x + "' style='border: 2px solid " + p.color + "' ><div class='statsplayername'>" + p.name + "</div>";

		for (var i = 0; i < 40; i++) {
			sq = square[i];

			if (sq.owner == x) {
				mortgagetext = "",
				housetext = "";

				if (sq.mortgage) {
					mortgagetext = "title='Mortgaged' style='color: grey;'";
				}

				if (!write) {
					write = true;
					HTML += "<table>";
				}

				if (sq.house == 5) {
					housetext += "<span style='float: right; font-weight: bold;'>1&nbsp;x&nbsp;<img src='" + game.images.house + "' alt='' title='Hotel' class='hotel' style='float: none;' /></span>";
				} else if (sq.house > 0 && sq.house < 5) {
					housetext += "<span style='float: right; font-weight: bold;'>" + sq.house + "&nbsp;x&nbsp;<img src='" + game.images.hotel + "' alt='' title='House' class='house' style='float: none;' /></span>";
				}

				HTML += "<tr><td class='statscellcolor' style='background: " + sq.color + ";";

				if (sq.groupNumber == 1 || sq.groupNumber == 2) {
					HTML += " border: 1px solid grey;";
				}

				HTML += "' onmouseover='showdeed(" + i + ");' onmouseout='hidedeed();'></td><td class='statscellname' " + mortgagetext + ">" + sq.name + housetext + "</td></tr>";
			}
		}

		if (p.communityChestJailCard) {
			if (!write) {
				write = true;
				HTML += "<table>";
			}
			HTML += "<tr><td class='statscellcolor'></td><td class='statscellname'>Get Out of Jail Free Card</td></tr>";

		}
		if (p.chanceJailCard) {
			if (!write) {
				write = true;
				HTML += "<table>";
			}
			HTML += "<tr><td class='statscellcolor'></td><td class='statscellname'>Get Out of Jail Free Card</td></tr>";

		}

		if (!write) {
			HTML += p.name + " dosen't have any properties.";
		} else {
			HTML += "</table>";
		}

		HTML += "</td>";
	}
	HTML += "</tr></table><div id='titledeed'></div>";

	document.getElementById("statstext").innerHTML = HTML;
	// Show using animation.
	$("#statsbackground").fadeIn(400, function() {
		$("#statswrap").show();
	});
}

function showdeed(property) {
	var sq = square[property];
	$("#deed").show();

	$("#deed-normal").hide();
	$("#deed-mortgaged").hide();
	$("#deed-special").hide();

	if (sq.mortgage) {
		$("#deed-mortgaged").show();
		document.getElementById("deed-mortgaged-name").textContent = sq.name;
		document.getElementById("deed-mortgaged-mortgage").textContent = Math.ceil(sq.price * 0.5);

	} else {

		if (sq.groupNumber >= 3) {
			$("#deed-normal").show();
			document.getElementById("deed-header").style.backgroundColor = sq.color;
			document.getElementById("deed-name").textContent = sq.name;
			document.getElementById("deed-baserent").textContent = sq.baserent;
			document.getElementById("deed-rent1").textContent = sq.rent1;
			document.getElementById("deed-rent2").textContent = sq.rent2;
			document.getElementById("deed-rent3").textContent = sq.rent3;
			document.getElementById("deed-rent4").textContent = sq.rent4;
			document.getElementById("deed-rent5").textContent = sq.rent5;
			document.getElementById("deed-mortgage").textContent = Math.ceil(sq.price * 0.5);
			document.getElementById("deed-houseprice").textContent = sq.houseprice;
			document.getElementById("deed-hotelprice").textContent = sq.houseprice;

		} else if (sq.groupNumber == 1) {
			$("#deed-special").show();
			document.getElementById("deed-special-icon").innerHTML = (property == 12 ? "&#128161;" : "&#128705;");
			document.getElementById("deed-special-name").textContent = sq.name;
			document.getElementById("deed-special-text").innerHTML = editions[edition].utiltext;
			document.getElementById("deed-special-mortgage").textContent = Math.ceil(sq.price * 0.5);

		} else if (sq.groupNumber == 2) {
			$("#deed-special").show();
			document.getElementById("deed-special-icon").innerHTML = "&#128642;";
			document.getElementById("deed-special-name").textContent = sq.name;
			document.getElementById("deed-special-text").innerHTML = editions[edition].transtext;
			document.getElementById("deed-special-mortgage").textContent = Math.ceil(sq.price * 0.5);
		}
	}
	
	game.deedShown = property;
}

function hidedeed() {
	$("#deed").hide();
}

function buy() {
	var p = player[turn];
	var property = square[p.position];
	var cost = property.price;

	if (p.money >= cost) {
		addAlert(p.name + " bought " + property.name + " for $" + property.price + ".");
		
		p.pay(cost, 0, false);

		property.owner = turn;
		updateMoney();
		playSound(game.sounds.bought);

		updateOwned();

		hideLanded();
		$("#nextbutton").prop("disabled", game.tradeInProgress());
	} else {
		popup("<p>You need $" + (property.price - p.money) + " more cash to buy " + property.name + ".</p>");
	}
}

function declineToBuy() {
	var p = player[turn];
	var sq = square[p.position];
	if (options.auctions != "all") {
		addAlert(p.name + " declined to buy " + sq.name + " for the list price of $" + sq.price + ".");
	}
	if (options.auctions != "no") {
		game.addPropertyToAuctionQueue(p.position);
	}
}

function updateMortgage(index, state) {
	square[index].mortgage = state;
	document.getElementById("mm" + index).className = (state ? "mortgaged" : "");
}

function updateBonus(bonus) {
	if (bonus != null) {
		game.bonus = bonus;
	}
	if (game.bonus > 0) {
		document.getElementById("bonus_cash").textContent = "$" + game.bonus;
		document.getElementById("free_parking").style.display = "none";
		document.getElementById("bonus").style.display = "block";
		square[20].name = "Bonus";
	} else {
		document.getElementById("free_parking").style.display = "block";
		document.getElementById("bonus").style.display = "none";
		square[20].name = "Free Parking";
	}
}

function mortgage(index) {
	var sq = square[index];
	var p = player[sq.owner];

	if (sq.house > 0 || sq.hotel > 0 || sq.mortgage) {
		return false;
	}

	var mortgagePrice = Math.ceil(sq.price * 0.5);
	var unmortgagePrice = Math.ceil(sq.price * 0.5 + sq.price * 0.5 * options.mortgage_rate);

	addAlert(p.name + " mortgaged " + sq.name + " for $" + mortgagePrice + ".");
	playSound(game.sounds.mortgaged);

	updateMortgage(index, true);
	p.gain(mortgagePrice, false);

	updateOwned();
	updateMoney();

	return true;
}

function unmortgage(index, noFee) {
	var sq = square[index];
	var p = player[sq.owner];
	var unmortgagePrice = Math.ceil(sq.price * 0.5 + sq.price * 0.5 * options.mortgage_rate);
	var mortgagePrice = Math.ceil(sq.price * 0.5);
	if (noFee === true) {
		unmortgagePrice = mortgagePrice;
	}

	if (unmortgagePrice > p.money || !sq.mortgage) {
		return false;
	}

	addAlert(p.name + " unmortgaged " + sq.name + " for $" + unmortgagePrice + ".");
	playSound(game.sounds.unmortgaged);
	
	p.pay(unmortgagePrice, 0, false);
	updateMortgage(index, false);

	updateOwned();

	return true;
}

function showLanded(html, playerno, wide) {
	var p = player[playerno == null ? turn : playerno];
	document.getElementById("game-player-action-border").style.borderColor = p.color; //Value;
	document.getElementById("game-player-action-html").innerHTML = html;
	document.getElementById("game-player-action").style.left = (wide ? "122px" : "");
	document.getElementById("game-player-action").style.width = (wide ? "638px" : "");
	document.getElementById("game-player-action").style.display = "block";
}

function hideLanded() {
	document.getElementById("game-player-action-html").innerHTML = "";
	document.getElementById("game-player-action").style.display = "none";
}

function land(increasedRent) {
	increasedRent = !!increasedRent; // Cast increasedRent to a boolean value. It is used for the ADVANCE TO THE NEAREST RAILROAD/UTILITY Chance cards.

	var p = player[turn];
	var s = square[p.position];

	var die1 = game.getDie(1);
	var die2 = game.getDie(2);
	
	var cell = document.getElementById("cell" + p.position);
	var containers = cell.getElementsByClassName("normal-cell-container");
	var containerNum = 0;
	if (containers.length == 0) {
		containers = cell.getElementsByClassName("corner-cell-container");
		if (p.position == 20 && game.bonus == 0) {
			containerNum = 1;
		}
		document.getElementById("enlarge").style.height = "144px";
	} else {
		document.getElementById("enlarge").style.height = "204px";
	}
	document.getElementById("enlarge").innerHTML = "<div class='" + containers[containerNum].className + "'>" + containers[containerNum].innerHTML.replace("id=\"jail\"", "") + "</div>";

	s.landcount++;
	var msg = p.name + " landed on " + s.name;
	if (p.position == 0) {
		p.gain(200, p.human);
		game.buyingStarted = true;
		msg += ", collecting $200";
	}
	addAlert(msg + ".");
	
	if (s.owner == turn) {
		addAlert(p.name + " owns " + s.name + ".");
	} else if (s.mortgage) {
		addAlert(s.name + " is mortgaged.");
	}

	var landedHTML = " landed on <a href='javascript:void(0);' onmouseover='showdeed(" + p.position + ");' onmouseout='hidedeed();' class='statscellcolor'>" + s.name + "</a>.";
	
	// Allow player to buy the property on which he landed.
	if (s.price !== 0 && s.owner === 0 && game.buyingStarted) {
		if (options.auctions == "all") {
			declineToBuy();
		} else if (!p.human) {
			if (p.AI.buyProperty(p.position)) {
				buy();
			} else {
				declineToBuy();
			}
		} else {
			$("#nextbutton").prop("disabled", true);
			var html = "<div style='margin-bottom:10px'>You" + landedHTML + "</div>"
			         + "<input type='button' onclick='buy();' value='Buy ($" + s.price + ")' title='Buy " + s.name + " for $" + s.price + ".'/> &nbsp;"
				     + "<input type='button' onclick='declineToBuy(); game.next();'";
			if (options.auctions == "no") {
				html += " value='Decline'/>";
			} else {
				html += " value='Auction' title='Allow the bank to auction " + s.name + ".'/>";
			}
			showLanded(html);
		}
	}

	// Collect rent
	if (s.owner > 0 && s.owner != turn && !s.mortgage && player[s.owner].position == 40 && options.no_rent_from_jail) {
		showLanded(p.name + landedHTML + " " + player[s.owner].name + " is in jail and cannot collect rent.");
	} else if (s.owner > 0 && s.owner != turn && !s.mortgage) {
		var groupowned = true;
		var rent;

		// Railroads
		if (p.position == 5 || p.position == 15 || p.position == 25 || p.position == 35) {
			if (increasedRent) {
				rent = 25;
			} else {
				rent = 12.5;
			}

			if (s.owner == square[5].owner) {
				rent *= 2;
			}
			if (s.owner == square[15].owner) {
				rent *= 2;
			}
			if (s.owner == square[25].owner) {
				rent *= 2;
			}
			if (s.owner == square[35].owner) {
				rent *= 2;
			}

		} else if (p.position === 12) {
			if (increasedRent || square[28].owner == s.owner) {
				rent = (die1 + die2) * 10;
			} else {
				rent = (die1 + die2) * 4;
			}

		} else if (p.position === 28) {
			if (increasedRent || square[12].owner == s.owner) {
				rent = (die1 + die2) * 10;
			} else {
				rent = (die1 + die2) * 4;
			}

		} else {

			for (var i = 0; i < 40; i++) {
				sq = square[i];
				if (sq.groupNumber == s.groupNumber && sq.owner != s.owner) {
					groupowned = false;
				}
			}

			if (!groupowned) {
				rent = s.baserent;
			} else {
				if (s.house === 0) {
					rent = s.baserent * 2;
				} else {
					rent = s["rent" + s.house];
				}
			}
		}

		if (player[s.owner].human) {
			var payNow = false;
			if (!p.human && !options.auto_rent) {
				payNow = p.AI.payBeforeAsked(p.index, rent);
			}
			if (options.auto_rent || payNow) {
				payrent(rent, s.owner);
				if (p.human) {
					showLanded(p.name + landedHTML + " " + p.name + " paid $" + rent + " rent.");
				}
			} else {
				showLanded(p.name + landedHTML + "<input type='button' onclick='payrent(" + rent + "," + s.owner + "); this.style.display = \"none\"' value='Request $" + rent + " rent'/>", s.owner);
			}
		} else {
			if (options.auto_rent) {
				var payment = payrent(rent, s.owner);
				if (p.human) {
					showLanded("You" + landedHTML + " " + player[s.owner].name + " collected " + payment + ".");
				}
			} else {
				var request = player[s.owner].AI.rentRequest(p.index, rent);
				if (p.human) {
					if (request != null) {
						$("#nextbutton").prop("disabled", true);
					}
					var paybutton = "<input type='button' onclick='payrent(" + rent + "," + s.owner + "); this.style.display = \"none\"' value='Pay $" + rent + " rent'/>";
					showLanded("You" + landedHTML + " " + player[s.owner].name + " says \"" + request + "\" " + paybutton);
				} else {
					if (request != null) {
						payrent(rent, s.owner);
					}
				}
			}
		}
	} else if (s.owner > 0 && s.owner != turn && s.mortgage) {
		if (p.human) {
			showLanded(p.name + ", you" + landedHTML + " Property is mortgaged; no rent was collected.");
		}
	}

	// Free Parking / Bonus
	if (p.position === 20) {
		if (game.bonus > 0) {
			p.gain(game.bonus);
			addAlert(p.name + " received a bonus of $" + game.bonus + ".");
			if (options.bonus == "bail" || options.bonus == "luxury_tax")	{
				game.bonus = 0;
				updateBonus();
			}
		}
	}

	// Go to jail. Go directly to Jail. Do not pass GO. Do not collect $200.
	if (p.position === 30) {
		updateMoney();

		if (p.human) {
			activeAlert("[land(30)]", gotojail);
		} else {
			gotojail();
		}

		return;
	}
	
	// Tax squares
	if (s.tax != null) {
		var tax = s.tax;
		if (s.percentage != null) {
			var net = p.netWorth();
			tax = Math.min(tax, Math.ceil(net * s.percentage / 100));
		}
		p.pay(tax, 0);
		if (s.name == "LUXURY TAX" && options.bonus == "luxury_tax") {
			game.bonus += tax;
			updateBonus();
		}
		addAlert(p.name + " paid taxes of $" + tax + ".");
	}

	updateMoney();
	updateOwned();

	if (square[p.position].name == "Chance" || square[p.position].name == "Community Chest") {
		chanceCommunityChest(square[p.position].name);
	} else {
		if (!p.human) {
			if (!p.AI.onLand()) {
				activeAlert("[land]", game.next);
			}
		}
	}
}

function payrent(rent, owner, payment) {
	var p = player[turn];
	var covered = (p.money >= rent);
	var payment = rent;
	if (!covered) {
		if (p.money > 0) {
			payment = p.money;
		} else {
			payment = 0;
		}
	}
	var paymentDecription = (covered ? "full" : "partial") + " payment of $" + payment;
	p.pay(rent, owner);
	if ((p.money >= rent)) {
		addAlert(p.name + " paid rent of $" + rent + " to " + player[owner].name + ".");
	} else {
		addAlert(p.name + " owes $" + rent + " rent to " + player[owner].name + ".");
		if (payment > 0) {
			addAlert(p.name + " made " + paymentDecription + " to " + player[owner].name + ".");
		}
	}
	if (options.auto_rent != "yes") {
		$("#nextbutton").prop("disabled", game.tradeInProgress());
		hideLanded();
	}
	return paymentDecription;
}

function setNextButton(value) {
	if (value == "Roll dice") {
		document.getElementById("nextbutton").value = value;
		document.getElementById("nextbutton").title = "Roll the dice and move your token accordingly.";
	} else if (value == "Roll again") {
		document.getElementById("nextbutton").value = value;
		document.getElementById("nextbutton").title = "You threw doubles. Roll again.";
	} else {
		document.getElementById("nextbutton").value = "End turn";
		document.getElementById("nextbutton").title = "End turn and pass play to the next player.";
	}
}

function roll() {
	var p = player[turn];

	if (p.human) {
		document.getElementById("nextbutton").focus();
	}
	setNextButton("End turn");

	game.rollDice();
	var die1 = game.getDie(1);
	var die2 = game.getDie(2);

	doublecount++;

	addAlert(p.name + " rolled " + ((die1 + die2) == 8 || (die1 + die2) == 11 ? "an " : "a ") + (die1 + die2) + ". <span style='font-size: 24px; vertical-align: top; line-height: 16px;'>&#" + (9855 + die1) + ";&#" + (9855 + die2) + ";</span>");

	if (die1 == die2 && !p.jail) {
		updateDice(die1, die2);

		if (doublecount < 3) {
			setNextButton("Roll again");

		// If player rolls doubles three times in a row, send him to jail
		} else if (doublecount === 3) {
			p.jail = true;
			doublecount = 0;
			addAlert(p.name + " rolled doubles three times in a row.");
			updateMoney();


			if (p.human) {
				popup("You rolled doubles three times in a row. Go to jail.", gotojail);
			} else {
				gotojail();
			}

			return;
		}
	} else {
		setNextButton("End turn");
		doublecount = 0;
	}

	updateMoney();
	updateOwned();

	if (p.jail === true) {
		p.jailroll++;

		updateDice(die1, die2);
		if (die1 == die2) {
			hideLanded();
			//$("#landed").hide();

			p.jail = false;
			p.jailroll = 0;
			updatePosition(10 + die1 + die2);
			doublecount = 1;
			setNextButton("Roll again");

			addAlert(p.name + " rolled doubles to get out of jail.");

			land();
		} else if (p.jailroll === 3) {
			doublecount = 0;
			if (p.human) {
				$("#nextbutton").prop("disabled", true);
				var nextaction = "updatePosition(10 + game.getDie(1) + game.getDie(2)); land(); $(\"#nextbutton\").prop(\"disabled\", false)";
				var html = "You must pay $50 to get out of jail. " +
				           "<input type='button' value='Pay $50 fine' onclick='payfifty(); " + nextaction + "' />";
				if (p.communityChestJailCard || p.chanceJailCard) {
					html += "<input type='button' value='Use Card' onclick='useJailCard(); " + nextaction + "' />";
				}
				showLanded(html);
			} else {
				payfifty();
				updatePosition(10 + die1 + die2);
				land();
			}
		} else {
			if (p.human) {
				showLanded("You are in jail.");
			} else {
				activeAlert("[roll]", game.next);
			}
		}

	} else {
		updateDice(die1, die2);

		if (p.position + die1 + die2 >= 40) {
			updatePosition(p.position + die1 + die2 - 40);
			if (p.position != 0) {
				p.gain(200, p.human);
				game.buyingStarted = true;
				addAlert(p.name + " collected $200 for passing GO.");
			}
		} else {
			updatePosition(p.position + die1 + die2);
		}

		land();
	}
}

function play() {
	if (game.isComplete()) {
		return;
	}

	if (botsOnly && turnCount > turnCountLimit) {
		turn = 0;
		addAlert("Game is being suspended after " + turnCount + " turns.")
		game.endgame();
		return;
	}
	
	if (game.auction(play)) {
		return;
	}
	
	turnCount++;
	if (botsOnly && turnCount % 10 == 0) {
		console.log("Turn " + turnCount);
	}

	turn++;
	if (turn > pcount) {
		turn -= pcount;
	}
	updateTurn();

	var p = player[turn];
	game.resetDice();

	document.getElementById("pname").innerHTML = p.name;

	addAlert(p.name + " begins turn " + turnCount + ".");

	p.pay(0, p.creditor);

	hideLanded();
	$("#manage, #trade").hide();

	doublecount = 0;
	if (p.human) {
		document.getElementById("nextbutton").focus();
	}
	setNextButton("Roll dice");

	$("#die0").hide();
	$("#die1").hide();

	if (p.jail) {

		if (p.human) {
			var html = "This is your " + getOrdinal(p.jailroll + 1) + " turn in jail. <input type='button' title='Pay $50 fine to get out of jail immediately.' value='Pay $50 fine' onclick='payfifty();' />";

			if (p.communityChestJailCard || p.chanceJailCard) {
				html += "<input type='button' id='gojfbutton' title='Use &quot;Get Out of Jail Free&quot; card.' onclick='useJailCard();' value='Use Card' />";
			}
			
			showLanded(html);

			document.getElementById("nextbutton").title = "Roll the dice. If you throw doubles, you will get out of jail.";
		}

		addAlert("This is " + p.name + "'s " + getOrdinal(p.jailroll + 1) + " turn in jail.");

		if (!p.human && p.AI.postBail()) {
			if (p.communityChestJailCard || p.chanceJailCard) {
				useJailCard();
			} else {
				payfifty();
			}
		}
	}

	updateMoney();
	updatePosition();
	updateOwned();

	$(".money-bar-arrow").hide();
	$("#p" + turn + "arrow").show();

	if (!p.human) {
		if (!p.AI.beforeTurn()) {
			//addTimeout(game.next);
			game.next();
		}
	}
}

var battle = [];

function setup() {
	botsOnly = true;

	if (window.location.href.indexOf('battle') > 0) {
		pcount = 4;
		for (var i = 0; i <= pcount; i++) {
			player[i];
		}
		battle = [ClaridgeBot, ClaridgeBot];
		if (battle[0].name == battle[1].name && window.location.href.indexOf(battle[0].name) < 0 && window.location.href.indexOf("A") < 0) {
			alert("Warning: Battle bots have the same name: " + battle[0].name);
		}
		player[1].name="Bot 1";
		player[1].color = "orange";
		player[1].human = false;
		player[1].AI = new battle[0](player[1]);
		player[2].name="Bot 2";
		player[2].color = "red";
		player[2].human = false;
		player[2].AI = new battle[0](player[2]);
		player[3].name="Bot 3";
		player[3].color = "blue";
		player[3].human = false;
		player[3].AI = new battle[1](player[3]);
		player[4].name="Bot 4";
		player[4].color = "green";
		player[4].human = false;
		player[4].AI = new battle[1](player[4]);
	} else {
		pcount = parseInt(document.getElementById("playernumber").value, 10);
		for (var i = 1; i <= pcount; i++) {
			var p = player[i];
			p.name = document.getElementById("player" + i + "name").value;
			if (document.getElementById("player" + i + "ai").value == "human") {
				p.human = true;
				botsOnly = false;
			} else if (document.getElementById("player" + i + "ai").value == "ai") {
				p.human = false;
				p.AI = new ClaridgeBot(p);
			}
		}
	}
	
	if (window.location.href.indexOf('cheats') >= 0) {
		document.getElementById("cheats").style.display = "block";
	}
	
	var tokens_div = document.getElementById("tokens-container");
	for (var i = 1; i <= pcount; i++) {
		player[i].color = document.getElementById("player" + i + "color").value.toLowerCase();
		var token = document.createElement("div");
		token.className = "token ";
		token.id = player[i].color + "-token";
		token.style.transform = "scale(" + game.scale + ")";
		for (var j = 0; j < 3; j++) {
			var circle = document.createElement("div");
			circle.className = player[i].color + "-pawn" + (j==1 ? "-shadow" : "");
			token.appendChild(circle);
		}
		tokens_div.appendChild(token);
	}
	
	var setupForm = document.forms["setup-form"];
	
	var improvements = setupForm.improvements.value;
	if (improvements == "standard") {
		options.houseLimit = editions[edition].houseLimit;
		options.hotelLimit = editions[edition].hotelLimit;
	} else {
		options.houseLimit = 9999;
		options.hotelLimit = 9999;
	}
	options.delayed_start = (setupForm.delayed_start.value == "yes");
	options.turn_assets_over_to = setupForm.turn_assets_over_to.value;
	options.bank_auction = (setupForm.bank_auction.value == "yes");
	options.auctions = setupForm.auctions.value;
	options.mortgage_rate = parseInt(setupForm.mortgage_rate.value) / 100.0;
	options.pay_interest_on_transfer = (setupForm.pay_interest_on_transfer.value == "yes");
	options.auto_rent = (setupForm.auto_rent.value == "yes");
	options.no_rent_from_jail = (setupForm.collect_rent_from_jail.value == "no");
	options.bonus = setupForm.bonus.value;
	
	if (botsOnly) {
		options.sound = false;
		options.delayed_start = true;
	}
	
	game.buyingStarted = !options.delayed_start;
	
	game.bonus = 0;
	if (options.bonus.indexOf("0") >= 0) {
		game.bonus = parseInt(options.bonus);
	}
	updateBonus();
	
	if (options.houseLimit == 9999) {
		$("#buildings").hide();
	}

	$("#board, #moneybar").show();
	$("#setup").hide();

	if (pcount === 2) {
		document.getElementById("stats").style.width = "454px";
	} else if (pcount === 3) {
		document.getElementById("stats").style.width = "686px";
	}

	document.getElementById("stats").style.top = "0px";
	document.getElementById("stats").style.left = "0px";

	//updateTokens();

	$("#option, #setup-buttons").hide();
	$("#board, #menu, #pawn, #player-up-html, #game-general-alert, #game-buttons").show();
	document.getElementById("enlarge").innerHTML = document.getElementById("cell0").innerHTML;
	$("#right-container").show();

	resize();

	if (botsOnly) {
		while (!game.isComplete()) {
			play();
		}
	} else {
		play();
	}
}

function getCheckedProperty() {
	for (var i = 0; i < 42; i++) {
		if (document.getElementById("propertycheckbox" + i) && document.getElementById("propertycheckbox" + i).checked) {
			return i;
		}
	}
	return -1; // No property is checked.
}

function getCheckedProperties() {
	var properties = [];
	for (var i = 0; i < 42; i++) {
		if (document.getElementById("propertycheckbox" + i) && document.getElementById("propertycheckbox" + i).checked) {
			properties.push(i);
		}
	}
	return properties;
}

function unCheckProperties() {
	for (var i = 0; i < 42; i++) {
		if (document.getElementById("propertycheckbox" + i)) {
			document.getElementById("propertycheckbox" + i).checked = false;
		}
	}
}

function clearFootprints() {
	var footprints_container = document.getElementById("footprints-container");
	while (footprints_container.firstChild != null) {
		footprints_container.removeChild(footprints_container.firstChild);
	}
}


function moveToken(playerNo, fromCellNo, toCellNo, direction) {
	if (typeof fromCellNo == "number" && fromCellNo != toCellNo) {
		
		var token = document.getElementById(player[playerNo].color + "-token");
		var footprints_container = document.getElementById("footprints-container");
		if (fromCellNo != 30 && direction != 0) {
			clearFootprints();
		}
		var targetCellNo = toCellNo;
		if (targetCellNo == 40) {
			targetCellNo = 10;
		} else if (direction == 0) {
			targetCellNo = (fromCellNo + 1) % 40;
		}
		var increment = 1;
		if (direction === -1) {
			increment = -1;
		} else if (direction == null && fromCellNo > 10 && targetCellNo == 10 && toCellNo == 40) {
			increment = -1;
		} 
		var currentCell, rect, x, y;
		if (fromCellNo < 40) {
			for (var i = fromCellNo; i != targetCellNo; i = (i + increment + 40) % 40) {
				currentCell = document.getElementById("cell" + i);
				rect = currentCell.getBoundingClientRect();
				x = rect.x + rect.width / 2;
				y = rect.y + rect.height / 2 + window.pageYOffset;
				x += (Math.floor(Math.random() * 20) - 10) * game.scale;
				y += (Math.floor(Math.random() * 20) - 10) * game.scale;
				
				var div = document.createElement("div");
				div.className = "footprint";
				div.style.left = (x-25) + "px";
				div.style.top = (y-25) + "px";
				var footprint = div;
				footprint.style.position = "absolute";
				var degrees = 180;
				if (i >= 10 && i < 20) {
					degrees = 270;
				} else if (i >= 20 && i < 30) {
					degrees = 0;
				} else if (i >= 30 && i < 40) {
					degrees = 90;
				}
				if (direction == 0) {
					degrees += 270;
				}
				if (increment < 0) {
					degrees = (degrees + 180) % 360;
				}
				degrees = (degrees + 90) % 360;
				footprint.style.transform = "scale(" + game.scale + ") rotate(" + degrees + "deg)";
				footprint.style.color = player[playerNo].color; //Value;
				footprint.innerHTML = "&#x1F463;&#xFE0E;"
				footprints_container.appendChild(div);
			}
		}
		
		updateTokens()
	}
}

function updateTokens() {
	var a = 1;
	if (document.documentElement.clientHeight < 932) {
		a = .9;
	}
	if (document.documentElement.clientHeight < 830) {
		a = .8;
	}
	if (document.documentElement.clientHeight < 750) {
		a = .7;
	}
	if (document.documentElement.clientHeight < 640) {
		a = .6;
	}
	for (var i = 0; i <= 40; i++) {
		var tokens = [];
		for (var j = 1; j <= pcount; j++) {
			if (player[j].position == i) {
				var token = document.getElementById(player[j].color + "-token");
				if (token != null) {
					tokens.push(token);
				}
			}
		}
		if (tokens.length > 0) {
			if (i == 40) {
				currentCell = document.getElementById("jail");
			} else {
				currentCell = document.getElementById("cell" + i);
			}
			var rect = currentCell.getBoundingClientRect();
			x = rect.x + rect.width*a / 2;
			y = rect.y + rect.height*a / 2 + window.pageYOffset;
			if (i > 0 && i < 10) {
				y += 10*a;
			} else if (i > 10 && i < 20) {
				x -= 10*a;
			} else if (i > 20 && i < 30) {
				y -= 10*a;
			} else if (i > 30 && i < 40) {
				x += 10*a;
			}
			if (i == 10) {
				x -= 48*a;
				y += 12*a;
				if (tokens.length == 1) {
					tokens[0].style.left = x + "px";
					tokens[0].style.top = y + "px";
				} else if (tokens.length == 2) {
					tokens[0].style.left = (x+40*a) + "px";
					tokens[0].style.top = y + "px";
					tokens[1].style.left = x + "px";
					tokens[1].style.top = (y-40*a) + "px";
				} else if (tokens.length == 3) {
					tokens[0].style.left = (x) + "px";
					tokens[0].style.top = y + "px";
					tokens[1].style.left = (x+40*a) + "px";
					tokens[1].style.top = y + "px";
					tokens[2].style.left = x + "px";
					tokens[2].style.top = (y-40*a) + "px";
				} else if (tokens.length >= 4) {
					tokens[0].style.left = (x+27*a) + "px";
					tokens[0].style.top = y + "px";
					tokens[1].style.left = (x+65*a) + "px";
					tokens[1].style.top = y + "px";
					tokens[2].style.left = x + "px";
					tokens[2].style.top = (y-27*a) + "px";
					tokens[3].style.left = x + "px";
					tokens[3].style.top = (y-65*a) + "px";
				}
			} else {
				if (tokens.length == 1) {
					tokens[0].style.left = (x-18*a) + "px";
					tokens[0].style.top = (y-18*a) + "px";
				} else if (tokens.length == 2) {
					tokens[0].style.left = (x-32*a) + "px";
					tokens[0].style.top = (y-32*a) + "px";
					tokens[1].style.left = (x-5*a) + "px";
					tokens[1].style.top = (y-5*a) + "px";
				} else if (tokens.length == 3) {
					tokens[0].style.left = (x-37*a) + "px";
					tokens[0].style.top = (y-37*a) + "px";
					tokens[1].style.left = x + "px";
					tokens[1].style.top = (y-37*a) + "px";
					tokens[2].style.left = (x-18*a) + "px";
					tokens[2].style.top = y + "px";
				} else if (tokens.length >= 4) {
					tokens[0].style.left = (x-37*a) + "px";
					tokens[0].style.top = (y-37*a) + "px";
					tokens[1].style.left = x + "px";
					tokens[1].style.top = (y-37*a) + "px";
					tokens[2].style.left = (x-37*a) + "px";
					tokens[2].style.top = y + "px";
					tokens[3].style.left = x + "px";
					tokens[3].style.top = y + "px";
				}
			}
		}
	}
}

function strippx(value) {
	return Number(value.substring(0,2));
}

function newgame() {
	if (window.location.href.indexOf('?battle') > 0) {
		setup();
		return;
	}
	document.getElementById("setup").style.display = "block";
}

function closeControls() {
	document.getElementById("changeboardbutton").style.display = "none";
	document.getElementById("resumebutton").style.visibility = "visible";
	document.getElementById("control").style.display = "none";
	document.getElementById("cardpopup").style.display = "none";
}

function showControls() {
	document.getElementById("control").style.display = "block";
}

function playernumber_onchange() {
	pcount = parseInt(document.getElementById("playernumber").value, 10);

	$(".player-input").hide();

	for (var i = 1; i <= pcount; i++) {
		$("#player" + i + "input").show();
	}
}

function addPlayerInputs() {
	var container = document.getElementById("player-container");
	var p1 = document.getElementById("player1input");
	for (var i = 2; i <=8; i++) {
		var p = document.createElement("div");
		p.id = "player" + i + "input";
		p.className = "player-input";
		container.appendChild(p);
		p.innerHTML = p1.innerHTML.replaceAll("1", "" + i);
		document.getElementById("player" + i + "name").value = "Bot " + (i -1);
		document.getElementById("player" + i + "ai").value = "ai";
	}
	document.getElementById("player1color").value = "Orange";
	document.getElementById("player2color").value = "Blue";
	document.getElementById("player3color").value = "Red";
	document.getElementById("player4color").value = "Green";
	document.getElementById("player5color").value = "Silver";
	document.getElementById("player6color").value = "Fuchsia";
	document.getElementById("player7color").value = "Teal";
	document.getElementById("player8color").value = "Purple";
}

function menuitem_onmouseover(element) {
	element.className = "menuitem menuitem_hover";
	return;
}

function menuitem_onmouseout(element) {
	element.className = "menuitem";
	return;
}

function changeBoard(i) {
	edition = i;
	editions[edition].init();
	
	document.getElementById("board").style.borderColor = (editions[edition].boardColor ? editions[edition].boardColor : "");
	
	document.getElementById("edition-description").textContent = editions[edition].description;

	var groupPropertyArray = [];
	var groupNumber;

	for (var i = 0; i < 40; i++) {
		groupNumber = square[i].groupNumber;

		if (groupNumber > 0) {
			if (!groupPropertyArray[groupNumber]) {
				groupPropertyArray[groupNumber] = [];
			}

			groupPropertyArray[groupNumber].push(i);
		}
	}

	for (var i = 0; i < 40; i++) {
		if (square[i].groupNumber > 0) {
			square[i].group = groupPropertyArray[square[i].groupNumber];
		}

		square[i].index = i;

		var cell = document.getElementById("cell" + i);
		var colorBars = cell.getElementsByClassName("color-bar");
		if (colorBars.length > 0) {
			colorBars[0].style.backgroundColor = square[i].color;
		}
		var titles = cell.getElementsByClassName("property-title");
		if (titles.length == 0) {
			titles = cell.getElementsByClassName("cell-title");
		}
		if (titles.length > 0) {
			titles[0].innerHTML = square[i].title;
		}
		var prices = cell.getElementsByClassName("property-price");
		if (prices.length > 0) {
			if (square[i].groupNumber > 0) {
				prices[0].innerHTML = "Price: $" + square[i].price
			} else if (square[i].tax != null) {
				prices[0].innerHTML = "$" + square[i].tax + (square[i].percentage != null ? " or " + square[i].percentage + "%" : "");
			}
		}
	}

	var improvements = document.forms['setup-form'].improvements;
	var children = improvements.childNodes;
	for (var  i = 0; i < children.length; i++) {
		if (children[i].value == "standard") {
			children[i].textContent = editions[edition].houseLimit + " houses and " + editions[edition].hotelLimit + " hotels";
		}
	}
}

function resize() {
	var ar = window.innerWidth / window.innerHeight;
	var div = document.getElementById("board-container");
	var scale = 1;
	if (ar > 1) {
		scale = window.innerHeight / 932;
		if (ar < 1142 / 932) {
			// console.log("square " + scale);
		} else {
			// console.log("landscape " + scale);
		}
	} else {
		scale = window.innerWidth / 932;
		// console.log("portrait " + scale);
	}
	game.scale = scale;
	div.style.transform = "scale(" + scale + "," + scale + ")";
	div.style.margin = (0 - (932-(932*scale))/2) + "px";

	var div2 = document.getElementById("board-sizer");
	div2.style.width = (932*scale) + "px";
	div2.style.height = (932*scale) + "px";
	
	var div3 = document.getElementById("right-container");
	div3.style.height = (932*scale) + "px";
	
	var rect = document.getElementById("board").getBoundingClientRect();
	var tabs = ["log", "deeds", "manage", "trade"];
	for (var i = 0; i < tabs.length; i++) {
		var h = (rect.bottom - rect.top - 500*scale) + "px";
		var w = (rect.right - rect.left - 254*scale) + "px";
		var t = (rect.top + 170*scale) + "px";
		var l = (rect.left + 125*scale) + "px";
		var r = "0";
		var b = "0";
		var m = "0 0";
		var zIndex = null;
		if ((i == 1 && rect.right - rect.left < 450) || i != 1 && rect.right - rect.left < 800) {
			t = "0";
			l = "0";
			h = "96%"
			w = "96%"
			m = "auto auto"
			zIndex = 1;
		}
		var style = document.getElementById(tabs[i]).style;
		style.height = h;
		style.width = w;
		style.top = t;
		style.left = l;
		style.right = r;
		style.bottom = b;
		style.margin = m;
		if (zIndex) {
			style.zIndex = zIndex;
		}
	}
	
	document.getElementById("setup").style.margin = (window.innerHeight < 580 ? 0 : "auto") + " auto";
	if (window.innerWidth < 580) {
		document.getElementById("setup").style.width = "90%";
		document.getElementById("setup").style.height = "";
	}
	
	clearFootprints();
	for (var i = 1; i <= pcount; i++) {
		var token = document.getElementById(player[i].color + "-token");
		if (token) {
			token.style.transform = "scale(" + game.scale + ")";
		}
	}
	updateTokens();
}

window.onload = function() {
	addPlayerInputs();
	
	editions[0].init();
	
	game = new Game();
	
	for (var i = 0; i <= 8; i++) {
		player[i] = new Player("", "");
		player[i].index = i;
	}

	changeBoard(0);

	player[0].name = "the bank";
	player[1].human = true;

	communityChestCards.index = 0;
	chanceCards.index = 0;

	communityChestCards.deck = [];
	chanceCards.deck = [];

	for (var i = 0; i < 16; i++) {
		chanceCards.deck[i] = i;
		communityChestCards.deck[i] = i;
	}

	// Shuffle Chance and Community Chest decks.
	chanceCards.deck.sort(function() {return Math.random() - 0.5;});
	communityChestCards.deck.sort(function() {return Math.random() - 0.5;});

	$("#playernumber").on("change", playernumber_onchange);
	playernumber_onchange();

	$("#yesbutton").hide();
	$("#nobutton").hide();
	$("#okbutton").hide();
	$("#nextbutton").click(function (){addAlert("[nextbutton]");game.next()});
	$("#noscript").hide();

	var currentCell;
	var currentCellAnchor;
	var currentCellName;
	var currentCellOwner;

	for (var i = 0; i < 40; i++) {
		var s = square[i];

		currentCell = document.getElementById("cell" + i);

		currentCellAnchor = currentCell.appendChild(document.createElement("div"));
		currentCellAnchor.id = "cell" + i + "anchor";
		currentCellAnchor.className = "cell-anchor";

		currentCellName = currentCellAnchor.appendChild(document.createElement("div"));
		currentCellName.id = "cell" + i + "name";
		currentCellName.className = "cell-name";
		currentCellName.textContent = s.name;

		if (square[i].groupNumber) {
			currentCellOwner = currentCellAnchor.appendChild(document.createElement("div"));
			currentCellOwner.id = "cell" + i + "owner";
			currentCellOwner.className = "cell-owner";
		}
	}

	resize();

	
	// Create event handlers for hovering and draging.
	var drag, dragX, dragY, dragObj, dragTop, dragLeft;

	$("body").on("mousemove", function(e) {
		var object;

		if (e.target) {
			object = e.target;
		} else if (window.event && window.event.srcElement) {
			object = window.event.srcElement;
		}


		if (object.classList.contains("propertycellcolor") || object.classList.contains("statscellcolor")) {
			if (e.clientY + 20 > window.innerHeight - 279) {
				document.getElementById("deed").style.top = (window.innerHeight - 279) + "px";
			} else {
				document.getElementById("deed").style.top = (e.clientY + 20) + "px";
			}
			document.getElementById("deed").style.left = (e.clientX + 10) + "px";


		} else if (drag) {
			if (e) {
				dragObj.style.left = (dragLeft + e.clientX - dragX) + "px";
				dragObj.style.top = (dragTop + e.clientY - dragY) + "px";

			} else if (window.event) {
				dragObj.style.left = (dragLeft + window.event.clientX - dragX) + "px";
				dragObj.style.top = (dragTop + window.event.clientY - dragY) + "px";
			}
		}
	});


	$("body").on("mouseup", function() {
		drag = false;
	});

	document.getElementById("statsdrag").onmousedown = function(e) {
		dragObj = document.getElementById("stats");
		dragObj.style.position = "relative";

		dragTop = parseInt(dragObj.style.top, 10) || 0;
		dragLeft = parseInt(dragObj.style.left, 10) || 0;

		if (window.event) {
			dragX = window.event.clientX;
			dragY = window.event.clientY;
		} else if (e) {
			dragX = e.clientX;
			dragY = e.clientY;
		}

		drag = true;
	};

	document.getElementById("popupdrag").onmousedown = function(e) {
		dragObj = document.getElementById("popup");
		dragObj.style.position = "relative";

		dragTop = parseInt(dragObj.style.top, 10) || 0;
		dragLeft = parseInt(dragObj.style.left, 10) || 0;

		if (window.event) {
			dragX = window.event.clientX;
			dragY = window.event.clientY;
		} else if (e) {
			dragX = e.clientX;
			dragY = e.clientY;
		}

		drag = true;
	};

	$("#mortgagebutton").click(function() {
		var checkedProperties = getCheckedProperties();
		var mortgage_price = 0;
		var unmortgage_price = 0;
		for (var i = 0; i < checkedProperties.length; i++) {
			var s = square[checkedProperties[i]];
			mortgage_price += Math.ceil(s.price * 0.5);
			unmortgage_price += Math.ceil(s.price * 0.5 + s.price * 0.5 * options.mortgage_rate);
		}

		if (s.mortgage) {
			if (player[s.owner].money < unmortgage_price) {
				popup("<p>You need $" + (unmortgage_price - player[s.owner].money) + " more to unmortgage the selected properties.</p>");
			} else {
				for (var i = 0; i < checkedProperties.length; i++) {
					unmortgage(checkedProperties[i]);
				}
				updateOption();
			}
		} else {
			for (var i = 0; i < checkedProperties.length; i++) {
				mortgage(checkedProperties[i]);
			}
			updateOption();
		}
	});

	$("#buyhousebutton").on("click", function() {
		var checkedProperties = getCheckedProperties();
		var price = 0;
		var housesToBuild = 0;
		var hotelsToBuild = 0;
		for (var i = 0; i < checkedProperties.length; i++) {
			price += square[checkedProperties[i]].houseprice;
			if (square[checkedProperties[i]].house === 4) {
				hotelsToBuild++;
			} else {
				housesToBuild++;
			}
		}
		var p = player[square[checkedProperties[0]].owner];
		var houseSum = 0;
		var hotelSum = 0;

		if (p.money < price) {
			popup("<p>You need $" + (price - p.money) + " more to build on the selected properties.</p>");
			return;
		}

		for (var i = 0; i < 40; i++) {
			if (square[i].hotel === 1) {
				hotelSum++;
			} else {
				houseSum += square[i].house;
			}
		}

		if (houseSum + housesToBuild > options.houseLimit || hotelSum + hotelsToBuild > options.hotelLimit) {
			popup("<p>You cannot build on all of the selected properties because only " + options.houseLimit + " houses and " + options.hotelLimit + " hotels are allowed on the board.</p>");
			return;
		}

		for (var i = 0; i < checkedProperties.length; i++) {
			buyHouse(checkedProperties[i]);
		}
	});

	$("#sellhousebutton").click(function() {
		var checkedProperties = getCheckedProperties();

		var price = 0;
		for (var i = 0; i < checkedProperties.length; i++) {
			price += square[checkedProperties[i]].houseprice / 2;
		}
		
		var houseSum = 0;
		for (var i = 0; i < 40; i++) {
			if (square[i].hotel == 0 && square[i].house > 0) {
				houseSum += square[i].house;
			}
		}
		
		var newHouseSum = houseSum;
		for (var i = 0; i < checkedProperties.length; i++) {
			if (square[checkedProperties[i]].hotel === 1) {
				newHouseSum += 4;
			} else if (square[checkedProperties[i]].house >= 1) {
				newHouseSum--;
			} else {
				popup(msg + "<p>Some of the seleced properties do not have anything to sell.</p>");
				return;
			}
		}

		if (newHouseSum > options.houseLimit && newHouseSum > houseSum) {
			var msg = "<p>Selling on each of the selected properties will leave more than " + options.houseLimit + " houses on the board.</p>";
				msg += "<p>You will have to sell " + (newHouseSum - options.houseLimit) + " additional houses.</p>";
				msg += "<p>Do you wish to proceede?</p>";
			popup(msg, function() {$("#nextbutton").prop("disabled", true); sellHouses(checkedProperties, 1)}, "yes/no");
			return;
		}
		
		for (var i = 0; i < checkedProperties.length; i++) {
			sellHouse(checkedProperties[i]);
		}
		
		$("#nextbutton").prop("disabled", game.tradeInProgress());
	});

	$("#viewstats").on("click", showStats);
	$("#statsclose, #statsbackground").on("click", function() {
		$("#statswrap").hide();
		$("#statsbackground").fadeOut(400);
	});

	$("#log-menu-item").click(function() {
		showLog("toggle");
	});

	$("#deeds-menu-item").click(function() {
		showDeeds("toggle");
	});

	$("#manage-menu-item").click(function() {
		if (player[turn].human) {
			unCheckProperties();
			showManage("toggle");
		} else {
			popup("Wait for your turn to manage properties.");
		}
	});

	$("#trade-menu-item").click(function() {
		if (game.tradeInProgress()) {
			showTrade(true);
		} else if (player[turn].human) {
			var initiator = player[turn];
			var recipient = (turn === 1 ? player[2] : player[1]);
			game.resetTrade(initiator, recipient, true);
			showTrade("toggle");
		} else {
			popup("Wait for your turn to trade assets.");
		}
	});

	if (window.location.href.indexOf('?battle') > 0) {
		newgame();
	}
};

function getOrdinal(num) {
	if (num == 1) {
		return "first";
	} else if (num == 2) {
		return "second";
	} else if (num == 3) {
		return "third";
	} else {
		return num + "th";
	}
}

function delay(fn, time) {
	if (time == 0) {
		fn();
	} else {
		setTimeout(fn, time);
	}
}

var soundQueue = [];
var soundQueueSeq = 0;

function toggleSound() {
	var off = document.getElementById("sound-off");
	var on = document.getElementById("sound-on");
	if (off.style.display == "none") {
		on.style.display = "none";
		off.style.display = "block";
		options.sound = false;
		if (soundQueue.length > 0) {
			soundQueue[0].sound.pause();
			soundQueue = [];
		}
	} else {
		off.style.display = "none";
		on.style.display = "block";
		options.sound = true;
		playSound(game.sounds.gained);
	}
}

function playSound(sound, startTime) {
	for (var i = 0; i < soundQueue.length; i++) {
		soundQueue[i].sound.pause();
		soundQueue[i].sound.currentTime = 0;
	}
	if (options.sound) {
		soundQueueSeq++;
		soundQueue = [{sound:sound, startTime:(startTime == null ? 0 : startTime), seq:soundQueueSeq}];
		sound.currentTime = soundQueue[0].startTime;
		var promise = sound.play();
		if (promise) {
			promise.catch(function() {})
		}
	}
}

function addToSoundQueue(sound, startTime) {
	if (options.sound) {
		var time = 0;
		for (var i = 0; i < soundQueue.length; i++) {
			if (soundQueue[i].sound.paused) {
				if (i > 0) {
					time += soundQueue[i].sound.duration - soundQueue[i].startTime;
				}
			} else {
				time += soundQueue[i].sound.duration - soundQueue[i].sound.currentTime;
			}
		}
		if (soundQueue.length == 0) {
			soundQueue.push(null);
		}
		soundQueue.push({sound:sound, startTime:(startTime == null ? 0 : startTime), seq:soundQueueSeq});
		if (time == 0) {
			playNextSound(soundQueueSeq + 0)
		} else {
			setTimeout(function() {playNextSound(soundQueueSeq + 0)}, Math.round(time * 1000));
		}
	}
}

function playNextSound(seq) {
	if (options.sound) {
		if (soundQueue.length > 1) {
			if (soundQueue[1].seq == soundQueueSeq) {
				soundQueue.splice(0, 1);
				soundQueue[0].sound.pause();
				soundQueue[0].sound.currentTime = soundQueue[0].startTime;
				var promise = soundQueue[0].sound.play();
				if (promise) {
					promise.catch(function() {})
				}
			}
		}
	}
}

function toggleTableTop() {
	var boards = ["redcheckerboard", "maple wood", "beach wood", "chestnut wood", "cherry wood", "mahogany wood", "undyed linen", "blue-dyed linen", "pink-dyed linen", "scrabble"];
	var body = document.getElementsByTagName("body")[0];
	for (var i = 0; i < boards.length; i++) {
		if (body.className == boards[i]) {
			body.className = boards[(i + 1) % boards.length];
			break;
		}
	}
}