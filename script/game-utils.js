/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function RNG(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItemFromArray(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function getMonitorGrid(monitor, x, y) {
	return document.getElementById(monitor).querySelector("[y='" + y + "'][x='" + x + "']");
}

function getShipClass(Grid) {
	return parseInt(Grid.getAttribute("ship-class"));
}

function onConfigError() {
	alert(string.game_config_error);
	location.reload();
}
