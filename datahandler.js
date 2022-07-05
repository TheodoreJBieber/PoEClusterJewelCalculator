var sortOrderMap;
var sortOrderReverseMap;

function initData(sortOrderPath) {
	fetch(sortOrderPath)
	.then(response => {
		return response.json();
	})
	.then(jsondata => {
		sortOrderMap = jsondata;
		sortOrderReverseMap = {};
		for (const notable in sortOrderMap) {
		    sortOrderReverseMap[sortOrderMap[notable]] = notable;
		}
		fillindropdowns();
	});
}

function fillindropdowns() {
	let dropDownIds = ["select3n2dn1", "select3n2dn3"];
	for (const index in dropDownIds) {
		let id = dropDownIds[index];
		let dropDown = document.getElementById(id);
		for (const notable in sortOrderMap) {
			let option = createOption(notable, sortOrderMap[notable]);
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