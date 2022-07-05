
function calculate3n2d(event) {
	var output = getOutput("output3n2d");
	writeToOutput(output, "testText");
}

function getOutput(id) {
	return document.getElementById(id);
}

function writeToOutput(output, text) {
	output.innerHTML = text;
}