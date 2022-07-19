import React from 'react';
import diagram from '../img/3not_2desired_marked.png';
import megaStruct from '../data/data.json';
import CalculatorOutput from './CalculatorOutput';
import CalculatorInput from './CalculatorInput';

class Calculator extends React.Component {

    constructor(props) {
        super(props);
        initData();
        this.state = this.defaultState();
    }

    defaultState() {
        return {
            error: null,
            betweenNames: null,
            notablesBetween: null,
            validEnchants: null,
            notable1: null,
            notable3: null,
            notableName1: null,
            notableName3: null
        };
    }

    selectNotable(componentName, notableName) {
        let tempState = this.state || this.defaultState();
        tempState[componentName] = notableName;
        this.setState(tempState);

        const {notableName1, notableName3} = this.state || null;
        if (notableName1 !== null && notableName3 !== null) {
            this.calculate3n2d(notableName1, notableName3);
        }
    }

	calculateCallback(selected) {
		console.log(selected);
		if (selected.length === 2) {
			let tempState = this.state;
			let notableName1 = selected[0];
			let notableName3 = selected[1];
			tempState.notableName1 = notableName1;
			tempState.notableName3 = notableName3;
			this.setState(tempState);
            this.calculate3n2d(notableName1, notableName3);
		} else {
			this.setError("Please select exactly 2 notables. Currently selected " + selected.length + " notables: " + selected.join(", "))
		}
	}

    calculate3n2d(notableName1, notableName3) {
        var notable1 = sortOrderMap[notableName1];
        var notable3 = sortOrderMap[notableName3];

        if (notable1.Mod.CorrectGroup === notable3.Mod.CorrectGroup) {
            this.setError("Notables cannot be in the same group: " + notable3.Mod.CorrectGroup + ".");
            return;
        }
    
        var validEnchants = this.getValidEnchants(notable1, notable3);
        if (validEnchants.length === 0) {
            this.setError("Those notables cannot roll on any of the same cluster jewel types.");
            return;
        }
    
        var notablesBetween = [];
        var betweenNames = [];
        for (const s in megaStruct.Notables) {
            if (s !== "Large") {
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
    
        if (notablesBetween.length === 0) {
            this.setError("There are no notables that can appear in position 2 with the current selection.");
            return;
        }

        let tempState = this.state || this.defaultState();
        tempState.error = null;
        tempState.betweenNames = betweenNames;
        tempState.notablesBetween = notablesBetween;
        tempState.validEnchants = validEnchants;
        tempState.notable1 = notable1;
        tempState.notable3 = notable3;
        this.setState(tempState);
    }

    getValidEnchants(notable1, notable3) {
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

        return validEnchants;
    }

    setError(errorString) {
        this.setState({...this.state, error: errorString});
    }

    render() {
        return (
            <div>
				<div style={{color:"#222", textAlign: "right"}}>
				**This is a 3rd party tool with no affiliation to Grinding Gear Games or Path of Exile.
				</div>
                <h2>3 Notables, 2 Desired</h2>
				<div>
					<div>Calculator for possible 'middle' notables on Large Cluster Jewels for when you want to allocate two desirable notables, but don't want to allocate the third. </div>
					<div>In the diagram, positions 1 and 3 correspond to the two selected desirable notables, and position 2 is the undesired third.</div>
					<div style={{"marginBottom": "10px"}}>If you don't fully understand the purpose of only using only two out of three notables, I recommend watching a guide on youtube about Large Cluster Jewels.</div>
                </div>
				<img style={{display: "inline-block"}} src={diagram} alt=""/>
				<div style={{"verticalAlign": "top", display: "inline-block", "marginLeft": "3px"}} >
					<CalculatorInput sortOrderMap={sortOrderMap} calculateCallback={this.calculateCallback.bind(this)}/>
					<CalculatorOutput 
						error={this.state.error}
						validEnchants={this.state.validEnchants}
						notablesBetween={this.state.notablesBetween}
						notableName1={this.state.notableName1}
						notableName3={this.state.notableName3}
					/>
				</div>
            </div>
        );
    }

    
}

export var sortOrderMap;
// var megaStruct;
export var enchantMap;

function initData() {
    createSortOrderMaps();
    createEnchantMap();
}

function createSortOrderMaps() {
	sortOrderMap = {};
	for (const s in megaStruct.Notables) {
		if (s !== "Large") {
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
		if (s !== "Large") {
			continue;
		}
		let sObj = megaStruct.Notables[s];
		for (const notableName in sObj) {
			let nObj = sObj[notableName];
			for (let i = 0; i < nObj.Enchantments.length; i++) {
				let enchantment = nObj.Enchantments[i];
				let enchantKey = getEnchantKey(enchantment);
				let enchantValue = determineEnchantValue(enchantment);
				enchantMap[enchantKey] = enchantValue;
			}
		}
	}
}

export function getEnchantKey(enchantment) {
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
					if (l === i) {
						continue;
					}
					let enchantLineL = enchantment[l];
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
		if (Object.keys(tradeOptions).length === 1) {
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
		if (word === "%") {
			return false;
		}
		if (word === "and") {
			return false;
		}
		if (word === "a") {
			return false;
		}
		if (word === "base") {
			return false;
		}
		if (word === "damage") {
			return false;
		}
		if (word === "to") {
			return false;
		}
		if (word === "rating") {
			return false;
		}
		if (word === "additional") {
			return false;
		}
		return true;
	});
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
		&& not2.Mod.CorrectGroup !== not1.Mod.CorrectGroup 
		&& not2.Mod.CorrectGroup !== not3.Mod.CorrectGroup;
	
}

function isSuffix(notable) {
	return notable.Mod.CorrectGroup.includes("Suffix");
}

export function includesEnchant(l1, l2) {
	return l1.filter(lv => enchantEquals(lv, l2)).length > 0;
}

function enchantEquals(e1, e2) {
	if (e1.length !== e2.length) {
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
	return (l1.Description === l2.Description) && (l1.Value === l2.Value);
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


export default Calculator;