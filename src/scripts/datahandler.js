var sortOrderMap;
var megaStruct;
var enchantMap;

function initData(megaPath) {
	fetch(megaPath)
	.then(response => {
		return response.json();
	})
	.then(jsondata => {
		megaStruct = jsondata;
		createSortOrderMaps();
		createEnchantMap();
		fillindropdowns();
	});
}

function createSortOrderMaps() {
	sortOrderMap = {};
	for (const s in megaStruct.Notables) {
		if (s != "Large") {
			continue;
		}
		let sObj = megaStruct.Notables[s];
		for (const notableName in sObj) {
			let nObj = sObj[notableName];
			sortOrderMap[notableName] = nObj;
		}
	}
}

function createEnchantMap() {
	enchantMap = {};
	for (const s in megaStruct.Notables) {
		if (s != "Large") {
			continue;
		}
		let sObj = megaStruct.Notables[s];
		for (const notableName in sObj) {
			let nObj = sObj[notableName];
			for (let i = 0; i < nObj.Enchantments.length; i++) {
				let enchantment = nObj.Enchantments[i];
				let enchantKey = getEnchantKey(enchantment);
				if (enchantKey == "non_curse_aura_effect_+3%") {
					console.log(nObj);
				}
				let enchantValue = determineEnchantValue(enchantment);
				enchantMap[enchantKey] = enchantValue;
			}
		}
	}
}

function getEnchantKey(enchantment) {
	let key = "";
	for (let i = 0; i < enchantment.length; i++) {
		if (key.length > 0) {
			key += "/";
		}
		let enchantLine = enchantment[i];
		let descr = enchantLine.Description.replace("%", enchantLine.Value + "%");
		key += descr;
	}
	return key;
}

// since we don't have a data source for cluster jewel enchant types to their descriptions, determine it with some questionable logic
function determineEnchantValue(enchantment) {
	let tradeOptions = megaStruct.TradeStats.Enchant["Added Small Passive Skills grant: #"].option.options;
	tradeOptions = [...tradeOptions]; // copy it so we don't modify the original

	for (let i = 0; i < enchantment.length; i++) {
		let enchantLine = enchantment[i];
		let lineValue = enchantLine.Value;
		let lineDescr = enchantLine.Description;
		let keywords = harvestKeywords(lineDescr);

		tradeOptions = tradeOptions.filter(function (opt) {
			let text = opt.text.toLowerCase();
			
			if (!text.includes(lineValue)) {
				return false;
			}
			for (let k = 0; k < keywords.length; k++) {
				let kword = keywords[k];
				if (!text.includes(kword)) {
					return false;
				}
			}
			if (text.includes("legacy")) {
				return false;
			}
			if (text.startsWith("minion") && !keywords.includes("minion")) {
				return false;
			}
			if (text.includes("herald") && !keywords.includes("herald")) {
				return false;
			}
			if (text.includes("time") && !keywords.includes("time")) {
				let found = false;
				for (let l = 0; l < enchantment.length; l++) {
					if (l == i) {
						continue;
					}
					enchantLineL = enchantment[l];
					let lineDescrL = enchantLineL.Description;
					let keywordsL = harvestKeywords(lineDescrL);
					if (keywordsL.includes("time")) {
						found = true;
					}
				}
				if (!found) {
					return false;
				}
			}
			return true;
		});
		if (Object.keys(tradeOptions).length == 1) {
			return tradeOptions[Object.keys(tradeOptions)[0]];
		}
	}

	return null;
}

function harvestKeywords(lineDescr) {
	return lineDescr
	.replace("+", "increased_")
	.replace("physical_damage_reduction_rating", "armour")
	.replace("channelled", "channel")
	.replace("suppression", "suppress")
	.replace("sigil", "brand")
	.replace("empowered", "exert")
	.toLowerCase().split("_")
	.filter(function (word) {
		if (word == "%") {
			return false;
		}
		if (word == "and") {
			return false;
		}
		if (word == "a") {
			return false;
		}
		if (word == "base") {
			return false;
		}
		if (word == "damage") {
			return false;
		}
		if (word == "to") {
			return false;
		}
		if (word == "rating") {
			return false;
		}
		if (word == "additional") {
			return false;
		}
		return true;
	});
}

function fillindropdowns() {
	let dropDownIds = ["select3n2dn1", "select3n2dn3"];
	for (const index in dropDownIds) {
		let id = dropDownIds[index];
		let dropDown = document.getElementById(id);
		for (const notable in sortOrderMap) {
			let option = createOption(notable, notable);
			dropDown.add(option);
		}
	}
}

function createDefaultOption() {
	return createOption("Please make a selection", -1);
}

function createOption(text, value) {
	let option = document.createElement('option');
	option.text = text;
	option.value = value;
	return option;
}

function fillInNotablesLegend() {
	let tableId = "tableNotables";
}