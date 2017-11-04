/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function RNG(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMonitorGrid(monitor, x, y) {
	return document.getElementById(monitor).querySelector("[y='" + y + "'][x='" + x + "']");
}

function onConfigError() {
	alert(string.game_config_error);
	location.reload();
}
