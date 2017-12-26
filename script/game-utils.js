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

function getShipTileImagesURL(shipsSet, classActing, status) {
	if (img_url.ship_tiles_nation[shipsSet] !== undefined && img_url.ship_tiles_nation[shipsSet].length > 0 && img_url.ship_tiles_nation[shipsSet][classActing][status].length > 0) {
		return img_url.ship_tiles_nation[shipsSet][classActing][status];
	} else {
		return img_url.ship_tiles_default[classActing][status];
	}
}

function onConfigError() {
	alert(string.game_config_error);
	location.reload();
}
