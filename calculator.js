function calculate3n2d(event, inid1, inid3) {
	var output = getElement("output3n2d");
	var in1 = getElement(inid1).value;
	var in3 = getElement(inid3).value;

	var notable1 = sortOrderMap[in1];
	var notable3 = sortOrderMap[in3];

	if (notable1.Mod.CorrectGroup == notable3.Mod.CorrectGroup) {
		writeToOutput(output, "Notables cannot be in the same group: " + notable3.Mod.CorrectGroup + ".");
		return;
	}


	let allEnchants = [];
	// enchants contains values which occur in notable1.Enchantments and notable3.Enchantments
	for (const index in notable1.Enchantments) {
		let ench = notable1.Enchantments[index];
		allEnchants.push(ench);
	}
	for (const index in notable3.Enchantments) {
		let ench = notable3.Enchantments[index];
		if (!includesEnchant(allEnchants, ench)) {
			allEnchants.push(ench);
		}
	}

	let validEnchants = [];
	for (const index in allEnchants) {
		let ench = allEnchants[index];
		if (includesEnchant(notable1.Enchantments, ench) && includesEnchant(notable3.Enchantments, ench)) {
			validEnchants.push(ench);
		}
	}

	if (validEnchants.length == 0) {
		writeToOutput(output, "Those notables cannot roll on any of the same cluster jewel types.");
		return;
	}

	var text = "";
	var notablesBetween = [];
	var betweenNames = [];
	for (const s in megaStruct.Notables) {
		if (s != "Large") {
			continue;
		}
		let sObj = megaStruct.Notables[s];
		for (const notableName in sObj) {
			let nObj = sObj[notableName];

			if (areNotablesCompatible(notable1, notable3, nObj, validEnchants)) {
				notablesBetween.push(nObj);
				betweenNames.push(notableName);
			}
		}
	}

	if (notablesBetween.length == 0) {
		writeToOutput(output, "There are no notables that can appear in position 2 with the current selection.");
		return;
	}

	// OUTPUT
	let desired = [in1, in3];

	text = text + "<b>Enchantments</b>"
	// LINK FOR A SPECIFIC ENCHANT
	for (let i = 0; i < validEnchants.length; i++) {
		let ench = validEnchants[i];
		let notablesNames = notablesBetween.filter(nObj => {
			return includesEnchant(nObj.Enchantments, ench);
		})
		.map(nObj => nObj.PassiveSkill.Name);
		// Should always be true, but may as well check
		if (notablesNames.length > 0) {
			let enchantKey = getEnchantKey(ench);
			let enchantDescription = enchantMap[enchantKey].text;
			var url = getSearchUrl(generateBody3n2d(desired, notablesNames, ench));
			text = text + "<div>" + enchantDescription + ": "  + createSearchLink(url) + "</div>";
		}
	}

	// LINK FOR ANY ENCHANT
	if (validEnchants.length > 1) {
		var url = getSearchUrl(generateBody3n2d(desired, betweenNames));
		text = text + "<div>Any Enchant: " + createSearchLink(url) + "</div>";
	}

	writeToOutput(output, text);
}

// not2 is proposed 'middle' notable
function areNotablesCompatible(not1, not3, not2, validEnchants) {
	var numPrefixes = 0;
	if (!isSuffix(not1)) {
		numPrefixes++;
	}
	if (!isSuffix(not2)) {
		numPrefixes++;
	}
	if (!isSuffix(not3)) {
		numPrefixes++;
	}

	return numPrefixes < 3
		&& isNotableBetween(not1, not3, not2) 
		&& isEnchantsValid(validEnchants, not2.Enchantments) 
		&& not2.Mod.CorrectGroup != not1.Mod.CorrectGroup 
		&& not2.Mod.CorrectGroup != not3.Mod.CorrectGroup;
	
}

function isSuffix(notable) {
	return notable.Mod.CorrectGroup.includes("Suffix");
}

function includesEnchant(l1, l2) {
	return l1.filter(lv => enchantEquals(lv, l2)).length > 0;
}

function enchantEquals(e1, e2) {
	if (e1.length != e2.length) {
		return false;
	}
	for (var i = 0; i < e1.length; i++) {
		if (!enchLineEquals(e1[i], e2[i])) {
			return false;
		}
	}
	return true;
}

function enchLineEquals(l1, l2) {
	return (l1.Description == l2.Description) && (l1.Value == l2.Value);
}

function isNotableBetween(not1, not3, between) {
	let num1 = not1.Stat._rid;
	let num3 = not3.Stat._rid;
	let numb = between.Stat._rid;
	return isBetween(num1, num3, numb);
}

function isBetween(val1, val3, between) {
	if (val1 < val3) {
		return (val1 < between) && (val3 > between);
	} else {
		return (val3 < between) && (val1 > between);
	}
}

function isEnchantsValid(allowed, enchs) {
	for (let i = 0; i < enchs.length; i++) {
		let ench = enchs[i];
		if (includesEnchant(allowed, ench)) {
			return true;
		}
	}
	return false;
}

function getElement(id) {
	return document.getElementById(id);
}

function createSearchLink(url) {
	return "<a href=" + url + " target=\"_blank\">Go to trade</a>";
}

function writeToOutput(output, text) {
	output.innerHTML = text;
}