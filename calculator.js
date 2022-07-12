
function calculate3n2d(event, inid1, inid3) {
	var in1 = getElement(inid1).value;
	var in3 = getElement(inid3).value;
	console.log(in1);
	console.log(in3);
	var text = "";
	var between = [];
	for (const num in sortOrderReverseMap) {
		if (isBetween(in1, in3, num)) {
			console.log(num);
			between.push(sortOrderReverseMap[num]);
			text = text + sortOrderReverseMap[num] + ", ";
		}
	} 

	desired = [sortOrderReverseMap[in1], sortOrderReverseMap[in3]]
	var url = getSearchUrl(generateBody3n2d(desired, between));

	text = text + createSearchLink(url);

	var output = getElement("output3n2d");
	writeToOutput(output, text);
}



// returns true if between is between val1 and val3. there cannot be overlap in notables, so no equals comparison
function isBetween(val1, val3, between) {
	if (val1 < val3) {
		return (val1 < between) && (val3 > between);
	} else {
		return (val3 < between) && (val1 > between);
	}
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