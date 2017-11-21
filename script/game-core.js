var counter_text_left;
var counter_label_left;
var counter_text_right;
var counter_label_right;

var game_phase = 0;
var GAME_PHASE_SHIP_PLACEMENT = 0;
var GAME_PAHSE_AERIAL_COMBAT = 1;
var GAME_PHASE_COMBAT = 2;

var grid_size;
var map_size;

var SHIP_COURSE_VERTICAL = 0;
var SHIP_COURSE_HORIZONTAL = 1;

var FLEET_SPEED_FAST = 0;
var FLEET_SPEED_SLOW = 1;

var ENGAGEMENT_FORM_PARALLEL = 0;
var ENGAGEMENT_FORM_HEADON = 1;
var ENGAGEMENT_FORM_T_ADV = 2;
var ENGAGEMENT_FORM_T_DIS = 3;

var SHIP_CLASS_BB = 0;
var SHIP_CLASS_CV = 1;
var SHIP_CLASS_CA = 2;
var SHIP_CLASS_DD = 3;
var SHIP_CLASS_AP = 4;

var SHIP_STATUS_INTACT = 0;
var SHIP_STATUS_HIT = 1;
var SHIP_STATUS_DESTROYED = 2;

var max_ship_count;
var max_bb_count;
var max_cv_count;
var max_ca_count;
var max_dd_count;
var max_ap_count;

var ship_class_placing;
var ship_course_placing = 0;
var ship_size_placing;
var ship_class_target;

var ship_class_acting;

var acting_player;
var PLAYER_1 = 0;
var PLAYER_2 = 1;

var player_1_first_act_complete = false;
var player_2_first_act_complete = false;
var total_turn_counter = 0;
var max_turn_intercept_breakthrough;

//game stats field for each player
var player_1_ship_set = 0;
var player_1_ships_count = [0, 0, 0, 0, 0];
var player_1_fleet_course = 0;
var player_1_fleet_speed;
var player_1_engagement_form; //Form Of Engagement
var player_1_attack_count;
var player_1_turn_counter = 0;
var player_1_acted = false;

var player_2_ship_set = 0;
var player_2_ships_count = [0, 0, 0, 0, 0];
var player_2_fleet_course = 0;
var player_2_fleet_speed;
var player_2_engagement_form;
var player_2_attack_count;
var player_2_turn_counter = 0;
var player_2_acted = false;

//SFXs
var gun_fire_sound;
var plane_attack_sound;
var attack_hit_sound;
var attack_miss_sound;
var attack_hit_sound_distant;

/**
 * Set up the basic ui for the game
 */
function readyGame() {
	//load the sound first
	if (SOUND_ENABLED) {
		gun_fire_sound = new Audio(sfx_url.gun_fire);
		plane_attack_sound = new Audio(sfx_url.plane_attack);
		attack_hit_sound = new Audio(sfx_url.explosion);
		attack_miss_sound = new Audio(sfx_url.explosion_water);
		attack_hit_sound_distant = new Audio(sfx_url.explosion_distant);
	}
	document.getElementById("gameTitle").innerHTML = string.game_title;
	//set up the main moniters
	var monitors = document.querySelectorAll('.Monitor');
	if (game_mode === GAME_MODE_CLASSIC) {
		map_size = 10;
		grid_size = Math.floor(DEFAULT_GRID_SIZE * DEFAULT_MAP_SIZE / map_size);
	} else {
		if (RANDOM_MAP_SIZE) {
			map_size = RNG(RANDOM_MAP_SIZE_MIN, RANDOM_MAP_SIZE_MAX);
			grid_size = Math.floor(DEFAULT_GRID_SIZE * DEFAULT_MAP_SIZE / map_size);
		} else {
			map_size = DEFAULT_MAP_SIZE;
			grid_size = DEFAULT_GRID_SIZE;
		}
	}
	if (game_mode === GAME_MODE_INTERCEPT || game_mode === GAME_MODE_BREAKTHROUGH || game_mode === GAME_MODE_CONVOY) {
		if (RANDOM_TIME_INTERCEPT_BREAKTHROUGH) {
			max_turn_intercept_breakthrough = RNG(MAX_TURN_INTERCEPT_MIN, MAX_TURN_INTERCEPT_MAX)
		} else {
			max_turn_intercept_breakthrough = MAX_TURN_INTERCEPT_DEFAULT;
		}
	}
	for (var i = 0; i < monitors.length; i++) {
		//set the map size
		monitors[i].style.width = grid_size * map_size + 2 + "px";
		monitors[i].style.height = grid_size * map_size + 2 + "px";
		//create a grid of map_size * map_size
		for (var j = 0; j < map_size; j++) {
			for (var k = 0; k < map_size; k++) {
				var grid = document.createElement('div');
				grid.style.height = grid_size + 'px';
				grid.style.width = grid_size + 'px';
				grid.setAttribute('x', j);
				grid.setAttribute('y', k);
				grid.setAttribute('class', 'MonitorGrid');
				var topPosition = j * grid_size;
				var leftPosition = k * grid_size;
				grid.style.top = topPosition + 'px';
				grid.style.left = leftPosition + 'px';
				var grid_canvas = document.createElement('canvas');
				grid_canvas.style.height = grid_size + 'px';
				grid_canvas.style.width = grid_size + 'px';
				grid_canvas.setAttribute('c-x', j);
				grid_canvas.setAttribute('c-y', k);
				grid_canvas.setAttribute('class', 'GridCanvas');
				grid_canvas.style.top = topPosition + 'px';
				grid_canvas.style.left = leftPosition + 'px';
				grid.appendChild(grid_canvas);
				monitors[i].appendChild(grid);
			}
		}
	}
	//upper panel
	document.getElementById("objective").innerHTML = string.game_objective_label;
	var objective = document.getElementById("objectiveList");
	var game_mode_label = document.getElementById("gameModeLabel");
	game_mode_label.innerHTML = string.game_mode_label;
	var game_mode_display = document.getElementById("gameMode");
	game_mode_display.innerHTML = string.game_mode[game_mode];
	switch (game_mode) {
		case GAME_MODE_SKIRMISH:
		case GAME_MODE_INTERCEPT:
		case GAME_MODE_BREAKTHROUGH:
			var o = document.createElement('li');
			o.innerHTML = string.game_objective_loading;
			objective.appendChild(o);
			max_ship_count = MAX_SHIP_COUNT_STANDARD;
			max_cv_count = MAX_CV_COUNT_STANDARD;
			max_bb_count = MAX_BB_COUNT_STANDARD;
			max_ca_count = MAX_CA_COUNT_STANDARD;
			max_dd_count = MAX_DD_COUNT_STANDARD;
			break;
		case GAME_MODE_CLASSIC:
			var o = document.createElement('li');
			o.innerHTML = string.game_objective_standard;
			objective.appendChild(o);
			max_ship_count = MAX_SHIP_COUNT_CLASSIC;
			max_cv_count = MAX_CV_COUNT_CLASSIC;
			max_bb_count = MAX_BB_COUNT_CLASSIC;
			max_ca_count = MAX_CA_COUNT_CLASSIC;
			max_dd_count = MAX_DD_COUNT_CLASSIC;
			break;
		case GAME_MODE_CONVOY:
			var o = document.createElement('li');
			o.innerHTML = string.game_objective_loading;
			objective.appendChild(o);
			max_ship_count = MAX_SHIP_COUNT_STANDARD;
			max_cv_count = MAX_CV_COUNT_STANDARD;
			max_bb_count = MAX_BB_COUNT_STANDARD;
			max_ca_count = MAX_CA_COUNT_STANDARD;
			max_dd_count = MAX_DD_COUNT_STANDARD;
			max_ap_count = AP_COUNT_CONVOY;
			break;
	}

	//set up the data Panel
	document.getElementById("dataPanelLeft").style.height = grid_size * map_size + 2 + "px";
	document.getElementById("dataPanelRight").style.height = grid_size * map_size + 2 + "px";

	//left panel
	var rButton = document.getElementById('rbutton');
	rButton.innerHTML = string.rotate;
	//rButton.setAttribute('class', 'Button');
	rButton.style.display = 'none';
	var label = document.createElement('p');
	label.innerHTML = string.ship_placement_remaining;
	label.setAttribute('id', 'counterLabelLeft');
	counter_label_left = label;
	document.getElementById("dataPanelContentLeft").appendChild(label);
	var counter = document.createElement('p');
	counter.innerHTML = max_ship_count;
	counter.setAttribute('class', 'Counter');
	counter.setAttribute('id', 'counterLeft');
	counter_text_left = counter;
	document.getElementById("dataPanelContentLeft").appendChild(counter);
	//determine the ship iocn set to be used by each player
	var shipset = RNG(0, 3);
	player_1_ship_set = shipset;
	switch (game_mode) {
		case GAME_MODE_SKIRMISH:
		case GAME_MODE_INTERCEPT:
		case GAME_MODE_BREAKTHROUGH:
		case GAME_MODE_CLASSIC:
			for (var i = 0; i <= SHIP_CLASS_DD; i++) {
				var sLabel = document.createElement('p');
				sLabel.setAttribute('class', 'ShipClassLabel');
				sLabel.innerHTML = string.ship_classes[i];
				document.getElementById("dataPanelContentLeft").appendChild(sLabel);
				var sIcon = document.createElement('img');
				var classes;
				switch (i) {
					case SHIP_CLASS_BB:
					case SHIP_CLASS_CV:
						classes = 'ShipIcons';
						break;
					case SHIP_CLASS_CA:
						classes = 'ShipIcons ShipIconsCA';
						break;
					case SHIP_CLASS_DD:
						classes = 'ShipIcons ShipIconsDD';
						break;
				}
				sIcon.setAttribute('class', classes);
				sIcon.setAttribute('id', i);
				sIcon.setAttribute('src', img_url.ship_icons[player_1_ship_set][i]);
				document.getElementById("dataPanelContentLeft").appendChild(sIcon);
			}
			break;
		case GAME_MODE_CONVOY:
			for (var i = 0; i <= SHIP_CLASS_AP; i++) {
				var sLabel = document.createElement('p');
				sLabel.setAttribute('class', 'ShipClassLabel');
				sLabel.innerHTML = string.ship_classes[i];
				document.getElementById("dataPanelContentLeft").appendChild(sLabel);
				var sIcon = document.createElement('img');
				var classes;
				switch (i) {
					case SHIP_CLASS_BB:
					case SHIP_CLASS_CV:
						classes = 'ShipIcons';
						break;
					case SHIP_CLASS_CA:
						classes = 'ShipIcons ShipIconsCA';
						break;
					case SHIP_CLASS_DD:
						classes = 'ShipIcons ShipIconsDD';
						break;
					case SHIP_CLASS_AP:
						classes = 'ShipIcons ShipIconsCA';
						break;
				}
				sIcon.setAttribute('class', classes);
				sIcon.setAttribute('id', i);
				sIcon.setAttribute('src', img_url.ship_icons[player_1_ship_set][i]);
				document.getElementById("dataPanelContentLeft").appendChild(sIcon);
			}
			break;
	}

	document.getElementById("apLeft").innerHTML = string.action_prompt_enemy;

	//right Panel
	var label2 = document.createElement('p');
	label2.innerHTML = string.ship_placement_remaining;
	counter_label_right = label2;
	document.getElementById("dataPanelContentRight").appendChild(label2);
	var counter2 = document.createElement('p');
	counter2.innerHTML = max_ship_count;
	counter2.setAttribute('class', 'Counter');
	counter2.setAttribute('id', 'counterRight');
	counter_text_right = counter2;
	document.getElementById("dataPanelContentRight").appendChild(counter2);
	//use a different ship icon set than player 1
	while (player_2_ship_set === player_1_ship_set) {
		var shipset = RNG(0, 2);
		player_2_ship_set = shipset;
	}
	for (var i = 0; i <= SHIP_CLASS_DD; i++) {
		var sLabel2 = document.createElement('p');
		sLabel2.setAttribute('class', 'ShipClassLabel');
		sLabel2.innerHTML = string.ship_classes[i];
		document.getElementById("dataPanelContentRight").appendChild(sLabel2);
		var sIcon2 = document.createElement('img');
		var classes;
		switch (i) {
			case SHIP_CLASS_BB:
			case SHIP_CLASS_CV:
				classes = 'ShipIconsEnemy ShipIcons';
				break;
			case SHIP_CLASS_CA:
				classes = 'ShipIconsEnemy ShipIcons ShipIconsCA';
				break;
			case SHIP_CLASS_DD:
				classes = 'ShipIconsEnemy ShipIcons ShipIconsDD';
				break;
		}
		sIcon2.setAttribute('class', classes);
		sIcon2.setAttribute('src', img_url.ship_icons[player_2_ship_set][i]);
		document.getElementById("dataPanelContentRight").appendChild(sIcon2);

	}
	document.getElementById("apRight").innerHTML = string.action_prompt_player;
	//main button
	var mainButton = document.getElementById("mainButton");
	mainButton.innerHTML = string.assemble_fleet;
	mainButton.addEventListener('click', startShipPlacement, false);
	//show all stuff
	document.getElementById("content").style.visibility = "visible";
	document.getElementById('settingBox').style.display = "none";


}

function startShipPlacement() {
	//hide the panel for player 2 first
	document.getElementById("dataPanelContentRight").style.display = 'none';
	var p = document.createElement('p');
	p.innerHTML = string.pending;
	p.setAttribute('class', 'DataPanelOverlay');
	p.setAttribute('id', 'pending');
	document.getElementById("dataPanelRight").appendChild(p);
	//add onclicklistener for the ship icons
	var ships = document.getElementById("dataPanelContentLeft").querySelectorAll('.ShipIcons');
	for (var i = 0; i < ships.length; i++) {
		var classes = ships[i].getAttribute('class');
		classes = classes + " ShipIconsSelectable";
		ships[i].setAttribute('class', classes);
	}
	var ships = document.querySelectorAll('.ShipIconsSelectable');
	for (var i = 0; i < ships.length; i++) {
		var t = i;
		ships[i].addEventListener("click", onShipIconSelected, false);
	}
	document.getElementById('rbutton').addEventListener('click', function () {
		if (ship_course_placing === SHIP_COURSE_VERTICAL) {
			ship_course_placing = SHIP_COURSE_HORIZONTAL;
		} else {
			ship_course_placing = SHIP_COURSE_VERTICAL;
		}
	}, false);
	//prepare button for next page
	var mainButton = document.getElementById("mainButton");
	mainButton.innerHTML = string.start_battle;
	mainButton.removeEventListener('click', startShipPlacement, false);
	mainButton.addEventListener('click',
		startGame, false);
}

function onShipIconSelected(evt) {
	ship_class_placing = parseInt(evt.target.id);
	//set eventlistener for all the moniter grids
	var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].addEventListener('click', placeShip, false);
		grids[i].addEventListener('mouseover', projectShip, false);
		grids[i].addEventListener('mouseout', unProjectShip, false);
		grids[i].addEventListener('contextmenu', changeShipCourse, false);
	}
	window.oncontextmenu = function () {
		return false;
	};
	document.getElementById("rbutton").style.display = 'inline';

}

/**
 * Check if a ship can be placed in the given coordinate
 */
function shipPlaceable(x, y) {
	ship_size_placing = SHIP_SIZE[ship_class_placing];
	if (ship_course_placing === SHIP_COURSE_VERTICAL) {
		//check if over edge of map
		if ((x + ship_size_placing) <= map_size && y <= map_size) {
			//check if another ship already exist
			for (var i = 0; i < ship_size_placing; i++) {
				if (document.querySelector("[x='" + (x + i) + "'][y='" + y + "']").hasAttribute("placed")) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	} else if (ship_course_placing === SHIP_COURSE_HORIZONTAL) {
		if ((y + ship_size_placing) <= map_size && x <= map_size) {
			for (var i = 0; i < ship_size_placing; i++) {
				if (document.querySelector("[y='" + (y + i) + "'][x='" + x + "']").hasAttribute("placed")) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

}

/**
 * creates a "projection" of a ship on the moniter to indicate this is possible to place a ship
 */
function projectShip(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlaceable(targetX, targetY)) {
		if (ship_course_placing === SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[x='" + (targetX + i) + "'][y='" + targetY + "']");
				tGrid.style.backgroundImage = "url('" + getShipTileImagesURL(player_1_ship_set, ship_class_placing, SHIP_STATUS_INTACT)[i] + "')";
			}
		} else if (ship_course_placing === SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[y='" + (targetY + i) + "'][x='" + targetX + "']");
				tGrid.style.backgroundImage = "url('" + getShipTileImagesURL(player_1_ship_set, ship_class_placing, SHIP_STATUS_INTACT)[i] + "')";
				tGrid.classList.add("ShipsTileHorizontal");
			}
		}
	}
}

/**
 * remove the ship projection left by player
 */
function unProjectShip(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlaceable(targetX, targetY)) {
		if (ship_course_placing === SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[x='" + (targetX + i) + "'][y='" + targetY + "']");
				tGrid.style.backgroundImage = "";
			}
		} else if (ship_course_placing === SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = document.querySelector("[y='" + (targetY + i) + "'][x='" + targetX + "']");
				tGrid.style.backgroundImage = "";
				tGrid.classList.remove("ShipsTileHorizontal");
			}
		}
	}
}

function changeShipCourse(evt) {
	unProjectShip(evt);
	if (ship_course_placing === SHIP_COURSE_VERTICAL) {
		ship_course_placing = SHIP_COURSE_HORIZONTAL;
	} else {
		ship_course_placing = SHIP_COURSE_VERTICAL;
	}
	projectShip(evt);
}

function placeShip(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (shipPlaceable(targetX, targetY)) {
		if (ship_course_placing === SHIP_COURSE_VERTICAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = getMonitorGrid("monitorLeft", (targetX + i), targetY);
				tGrid.style.backgroundImage = "url('" + getShipTileImagesURL(player_1_ship_set, ship_class_placing, SHIP_STATUS_INTACT)[i] + "')";
				var classes = tGrid.getAttribute('class');
				classes = classes + " ShipsTile";
				tGrid.setAttribute('class', classes);
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", ship_class_placing);
				tGrid.setAttribute("ship-bearing", ship_course_placing);
				tGrid.setAttribute("sector", i);
				tGrid.setAttribute("head-x", targetX);
				tGrid.setAttribute("head-y", targetY);
				tGrid.style.backgroundColor = '';
				tGrid.removeEventListener('click', placeShip, false);
				tGrid.removeEventListener('mouseover', projectShip, false);
				tGrid.removeEventListener('mouseout', unProjectShip, false);
			}
		} else if (ship_course_placing === SHIP_COURSE_HORIZONTAL) {
			for (var i = 0; i < ship_size_placing; i++) {
				var tGrid = getMonitorGrid("monitorLeft", targetX, (targetY + i));
				tGrid.style.backgroundImage = "url('" + getShipTileImagesURL(player_1_ship_set, ship_class_placing, SHIP_STATUS_INTACT)[i] + "')";
				var classes = tGrid.getAttribute('class');
				classes = classes + " ShipsTileHorizontal";
				tGrid.setAttribute('class', classes);
				tGrid.removeEventListener('click', placeShip, false);
				tGrid.setAttribute("placed", "true");
				tGrid.setAttribute("ship-class", ship_class_placing);
				tGrid.setAttribute("ship-bearing", ship_course_placing);
				tGrid.setAttribute("sector", i);
				tGrid.setAttribute("head-x", targetX);
				tGrid.setAttribute("head-y", targetY);
				tGrid.style.backgroundColor = '';
				tGrid.removeEventListener('mouseover', projectShip, false);
				tGrid.removeEventListener('mouseout', unProjectShip, false);
			}
		}
		player_1_fleet_course = player_1_fleet_course + ship_course_placing;
		document.getElementById("counterLeft").innerHTML = parseInt(counter_text_left.innerHTML) - 1;
		//check for ship class limit
		switch (ship_class_placing) {
			case SHIP_CLASS_BB:
				player_1_ships_count[SHIP_CLASS_BB] = player_1_ships_count[SHIP_CLASS_BB] + 1;
				if (player_1_ships_count[SHIP_CLASS_BB] >= max_bb_count) {
					var ships = document.querySelectorAll('.ShipIcons');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					//stops player from placing more ships
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
						grids[i].removeEventListener('contextmenu', changeShipCourse, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
			case SHIP_CLASS_CV:
				player_1_ships_count[SHIP_CLASS_CV] = player_1_ships_count[SHIP_CLASS_CV] + 1;
				if (player_1_ships_count[SHIP_CLASS_CV] >= max_cv_count) {
					var ships = document.querySelectorAll('.ShipIcons');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
						grids[i].removeEventListener('contextmenu', changeShipCourse, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
			case SHIP_CLASS_CA:
				player_1_ships_count[SHIP_CLASS_CA] = player_1_ships_count[SHIP_CLASS_CA] + 1;
				if (player_1_ships_count[SHIP_CLASS_CA] >= max_ca_count) {
					var ships = document.querySelectorAll('.ShipIcons');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
						grids[i].removeEventListener('contextmenu', changeShipCourse, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}

				break;
			case SHIP_CLASS_DD:
				player_1_ships_count[SHIP_CLASS_DD] = player_1_ships_count[SHIP_CLASS_DD] + 1;
				if (player_1_ships_count[SHIP_CLASS_DD] >= max_dd_count) {
					var ships = document.querySelectorAll('.ShipIcons');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
						grids[i].removeEventListener('contextmenu', changeShipCourse, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
			case SHIP_CLASS_AP:
				player_1_ships_count[SHIP_CLASS_AP] = player_1_ships_count[SHIP_CLASS_AP] + 1;
				if (player_1_ships_count[SHIP_CLASS_AP] >= max_ap_count) {
					var ships = document.querySelectorAll('.ShipIcons');
					var classes = ships[ship_class_placing].getAttribute('class');
					classes = classes.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
					ships[ship_class_placing].setAttribute('class', classes);
					ships[ship_class_placing].removeEventListener("click", onShipIconSelected, false);
					var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
					for (var i = 0; i < grids.length; i++) {
						grids[i].removeEventListener('click', placeShip, false);
						grids[i].removeEventListener('mouseover', projectShip, false);
						grids[i].removeEventListener('mouseout', unProjectShip, false);
						grids[i].removeEventListener('contextmenu', changeShipCourse, false);
					}
					document.getElementById("rbutton").style.display = 'none';
				}
				break;
		}
		if (getPlayerShipCount(PLAYER_1) >= max_ship_count) {
			stopPlayerShipPlacement();
		}
		//enforce total number of transports
		if (game_mode === GAME_MODE_CONVOY) {
			if ((max_ship_count - getPlayerShipCount(PLAYER_1)) <= (max_ap_count - player_1_ships_count[SHIP_CLASS_AP]) && getPlayerShipCount(PLAYER_1) < max_ship_count && ship_class_placing !== SHIP_CLASS_AP) {
				var allShips = document.querySelectorAll('.ShipIcons');
				for (var n = 0; n < allShips.length; n++) {
					if (n !== SHIP_CLASS_AP) {
						var c = allShips[n].getAttribute('class');
						c = c.replace(' ShipIconsSelectable', ' ShipIconsUnSelectable');
						allShips[n].setAttribute('class', c);
						allShips[n].removeEventListener("click", onShipIconSelected, false);
						var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
						for (var m = 0; m < grids.length; m++) {
							grids[m].removeEventListener('click', placeShip, false);
							grids[m].removeEventListener('mouseover', projectShip, false);
							grids[m].removeEventListener('mouseout', unProjectShip, false);
							grids[i].removeEventListener('contextmenu', changeShipCourse, false);
						}
						document.getElementById("rbutton").style.display = 'none';
					}
				}
			}
		}
	}

}

/**
 * end the ship placing and prompt ai to place ship if possible
 */
function stopPlayerShipPlacement() {
	//disable ship selector
	var ships = document.querySelectorAll('.ShipIcons');
	window.oncontextmenu = function () {
		return true;
	};
	for (var i = 0; i < ships.length; i++) {
		var t = i;
		ships[i].removeEventListener("click", onShipIconSelected, false);
		//remove hover effect
		var classes = ships[i].getAttribute('class');
		classes = classes.replace(' ShipIconsSelectable', '');
		classes = classes.replace(' ShipIconsUnSelectable', '');
		ships[i].setAttribute('class', classes);
	}
	//disable grids
	var grids = document.getElementById("monitorLeft").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].removeEventListener('click', placeShip, false);
		grids[i].removeEventListener('mouseover', projectShip, false);
		grids[i].removeEventListener('mouseout', unProjectShip, false);
		grids[i].removeEventListener('contextmenu', changeShipCourse, false);
	}
	//delete the button if it still exsists
	if (document.getElementById("rbutton") !== null) {
		var button = document.getElementById("rbutton");
		button.parentNode.removeChild(button);
	}
	if (getPlayerShipCount(PLAYER_2) < max_ship_count) {
		shipPlacementMain();
	}

}

function getPlayerShipCount(player) {
	if (player === PLAYER_1) {
		return player_1_ships_count.reduce(function (a, b) {
			return a + b;
		}, 0);
	} else {
		return player_2_ships_count.reduce(function (a, b) {
			return a + b;
		}, 0);
	}
}

function startGame() {
	if (getPlayerShipCount(PLAYER_1) <= 0) {
		//TODO change this to html overl;ay dialog
		alert(string.no_ship_prompt);
	} else if (game_mode === GAME_MODE_CONVOY && player_1_ships_count[SHIP_CLASS_AP] < max_ap_count) {
		alert(string.no_ap_prompt);
	} else {
		stopPlayerShipPlacement(); //just in case
		var mainButton = document.getElementById("mainButton");
		mainButton.innerHTML = string.surrender;
		mainButton.removeEventListener('click', startGame, false);
		mainButton.addEventListener('click', surrender, false);
		//display info for both players
		var labels = document.getElementById("dataPanelContentLeft").querySelectorAll('.ShipClassLabel');
		for (var i = 0; i < labels.length; i++) {
			labels[i].innerHTML = labels[i].innerHTML + " : " + player_1_ships_count[i];
		}
		document.getElementById("counterLeft").innerHTML = getPlayerShipCount(PLAYER_1);
		//player 2
		//unhide the panel
		document.getElementById("dataPanelContentRight").style.display = '';
		var overlay = document.getElementById('pending');
		overlay.parentNode.removeChild(overlay);
		var labels = document.getElementById("dataPanelContentRight").querySelectorAll('.ShipClassLabel');
		if (!FOG_OF_WAR) {
			//show number of enemy ships by class
			for (var i = 0; i < labels.length; i++) {
				labels[i].innerHTML = labels[i].innerHTML + " : " + player_2_ships_count[i];
			}
		} else {
			for (var i = 0; i < labels.length; i++) {
				labels[i].innerHTML = labels[i].innerHTML + " : " + "???";
			}
		}
		document.getElementById("counterRight").innerHTML = getPlayerShipCount(PLAYER_2);
		switch (game_mode) {
			case GAME_MODE_SKIRMISH:
				//calculate the stats for each fleet
				//speed
				if (player_1_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_1_fleet_speed = FLEET_SPEED_FAST;
				}
				if (player_2_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_2_fleet_speed = FLEET_SPEED_FAST;
				}
				//course
				if (player_1_fleet_course >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_1_fleet_course = SHIP_COURSE_VERTICAL;
				}
				if (player_2_fleet_course >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_2_fleet_course = SHIP_COURSE_VERTICAL;
				}
				var objective = document.getElementById("objectiveList");
				var o = document.createElement('li');
				o.innerHTML = string.game_objective_standard;
				objective.innerHTML = "";
				objective.appendChild(o);
				aerialCombat();
				break;
			case GAME_MODE_INTERCEPT:
				//ditto
				if (player_1_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_1_fleet_speed = FLEET_SPEED_FAST;
				}
				if (player_2_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_2_fleet_speed = FLEET_SPEED_FAST;
				}
				//course
				if (player_1_fleet_course >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_1_fleet_course = SHIP_COURSE_VERTICAL;
				}
				if (player_2_fleet_course >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_2_fleet_course = SHIP_COURSE_VERTICAL;
				}
				if (SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH) {
					if (player_2_ships_count[SHIP_CLASS_CV] > 0 && player_2_ships_count[SHIP_CLASS_BB] > 0) {
						ship_class_target = RNG(SHIP_CLASS_BB, SHIP_CLASS_CV);

					} else if (player_2_ships_count[SHIP_CLASS_BB] > 0) {
						ship_class_target = SHIP_CLASS_BB;
					} else if (player_2_ships_count[SHIP_CLASS_CV] > 0) {
						ship_class_target = SHIP_CLASS_CV;
					} else {
						//nothing of interest.
						SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH = false;//kill'em all.
					}
				}
				var objective = document.getElementById("objectiveList");
				var o = document.createElement('li');
				if (SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH) {
					if (ship_class_target === SHIP_CLASS_BB) {
						o.innerHTML = string.game_objective_intercept_bb;
					} else {
						o.innerHTML = string.game_objective_intercept_cv;
					}
				} else {
					o.innerHTML = string.game_objective_standard;
				}

				objective.innerHTML = "";
				objective.appendChild(o);
				document.getElementById("TurnCounterField").style.visibility = "visible";
				document.getElementById("TurnCounterLabel").innerHTML = string.turn_counter_label;
				document.getElementById("TurnCounter").innerHTML = (max_turn_intercept_breakthrough - total_turn_counter);
				aerialCombat();
				break;
			case GAME_MODE_BREAKTHROUGH:
				//ditto
				if (player_1_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_1_fleet_speed = FLEET_SPEED_FAST;
				}
				if (player_2_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_2_fleet_speed = FLEET_SPEED_FAST;
				}
				//course
				if (player_1_fleet_course >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_1_fleet_course = SHIP_COURSE_VERTICAL;
				}
				if (player_2_fleet_course >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_2_fleet_course = SHIP_COURSE_VERTICAL;
				}
				if (SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH) {
					if (player_1_ships_count[SHIP_CLASS_CV] > 0 && player_1_ships_count[SHIP_CLASS_BB] > 0) {
						ship_class_target = RNG(SHIP_CLASS_BB, SHIP_CLASS_CV);

					} else if (player_1_ships_count[SHIP_CLASS_BB] > 0) {
						ship_class_target = SHIP_CLASS_BB;
					} else if (player_1_ships_count[SHIP_CLASS_CV] > 0) {
						ship_class_target = SHIP_CLASS_CV;
					} else {
						//nothing of interest.
						SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH = false;//kill'em all.
					}
				}
				var objective = document.getElementById("objectiveList");
				var o = document.createElement('li');
				if (SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH) {
					if (ship_class_target === SHIP_CLASS_BB) {
						o.innerHTML = string.game_objective_breakthrough_bb;
					} else {
						o.innerHTML = string.game_objective_breakthrough_cv
					}
				} else {
					o.innerHTML = string.game_objective_breakthrough;
				}

				objective.innerHTML = "";
				objective.appendChild(o);
				document.getElementById("TurnCounterField").style.visibility = "visible";
				document.getElementById("TurnCounterLabel").innerHTML = string.turn_counter_label;
				document.getElementById("TurnCounter").innerHTML = (max_turn_intercept_breakthrough - total_turn_counter);
				aerialCombat();
				break;
			case GAME_MODE_CONVOY:
				//ditto
				if (player_1_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_1_fleet_speed = FLEET_SPEED_FAST;
				}
				if (player_2_ships_count[SHIP_CLASS_BB] >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_speed = FLEET_SPEED_SLOW;
				} else {
					player_2_fleet_speed = FLEET_SPEED_FAST;
				}
				//course
				if (player_1_fleet_course >= Math.round(getPlayerShipCount(PLAYER_1) / 2)) {
					player_1_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_1_fleet_course = SHIP_COURSE_VERTICAL;
				}
				if (player_2_fleet_course >= Math.round(getPlayerShipCount(PLAYER_2) / 2)) {
					player_2_fleet_course = SHIP_COURSE_HORIZONTAL;
				} else {
					player_2_fleet_course = SHIP_COURSE_VERTICAL;
				}
				var objective = document.getElementById("objectiveList");
				var o = document.createElement('li');
				o.innerHTML = string.game_objective_convoy;
				objective.innerHTML = "";
				objective.appendChild(o);
				document.getElementById("TurnCounterField").style.visibility = "visible";
				document.getElementById("TurnCounterLabel").innerHTML = string.turn_counter_label;
				document.getElementById("TurnCounter").innerHTML = (max_turn_intercept_breakthrough - total_turn_counter);
				aerialCombat();
				break;
			case GAME_MODE_CLASSIC:
				//DO NOTHING
				//no aerial combat, too.
				startFleetCombat();
				break;
		}

	}
}

/**
 * start the aerial combat phase
 */
function aerialCombat() {
	game_phase = GAME_PAHSE_AERIAL_COMBAT;
	ship_class_acting = SHIP_CLASS_CV;
	document.getElementById("stage").innerHTML = string.game_stage_aerial;
	//determine who will go first
	var first = RNG(PLAYER_1, PLAYER_2);
	if (first === PLAYER_1) {
		acting_player = PLAYER_1;
		promptAction();
		showStageBox(string.game_stage_aerial_prompt_player);
		player_1_attack_count = player_1_ships_count[SHIP_CLASS_CV] * 2;
		if (player_1_attack_count > 0) {
			beginTargeting();
		} else {
			//no CVs
			nextPlayer();
		}
	} else {
		acting_player = PLAYER_2;
		promptAction();
		showStageBox(string.game_stage_aerial_prompt_enemy);
		player_2_attack_count = player_2_ships_count[SHIP_CLASS_CV] * 2;
		if (player_2_attack_count > 0) {
			attackMain();
		} else {
			//no CVs
			nextPlayer();
		}
	}
}

function startFleetCombat() {
	game_phase = GAME_PHASE_COMBAT;
	document.getElementById("stage").innerHTML = string.game_stage_artillery;
	showStageBox(string.game_stage_artillery_prompt);
	switch (game_mode) {
		case GAME_MODE_SKIRMISH:
		case GAME_MODE_INTERCEPT:
		case GAME_MODE_BREAKTHROUGH:
		case GAME_MODE_CONVOY:
			//first decide the engagement form
			if (player_1_fleet_course === player_2_fleet_course) {
				player_1_engagement_form = RNG(ENGAGEMENT_FORM_PARALLEL, ENGAGEMENT_FORM_HEADON);
				player_2_engagement_form = player_1_engagement_form;
			} else {
				if (player_1_fleet_speed !== player_2_fleet_speed) {
					if (player_1_fleet_speed === FLEET_SPEED_SLOW) {
						player_1_engagement_form = ENGAGEMENT_FORM_T_DIS;
						player_2_engagement_form = ENGAGEMENT_FORM_T_ADV;
					} else if (player_2_fleet_speed === FLEET_SPEED_SLOW) {
						player_1_engagement_form = ENGAGEMENT_FORM_T_ADV;
						player_2_engagement_form = ENGAGEMENT_FORM_T_DIS;
					}
				} else {
					player_1_engagement_form = RNG(ENGAGEMENT_FORM_T_ADV, ENGAGEMENT_FORM_T_DIS);
					if (player_1_engagement_form === ENGAGEMENT_FORM_T_DIS) {
						player_2_engagement_form = ENGAGEMENT_FORM_T_ADV;
					} else {
						player_2_engagement_form = ENGAGEMENT_FORM_T_DIS;
					}
				}
			}
			break;
		case GAME_MODE_CLASSIC:
			//DO NOTHING
			break;
	}

	//TODO sound fx and animation
	if (!FOG_OF_WAR) {
		document.getElementById("FoELabel").innerHTML = string.form_of_engagement_label;
		document.getElementById("FoE").innerHTML = string.form_of_engagement[player_1_engagement_form];
	}
	player_1_acted = false;
	player_2_acted = false;
	//determine who will go first
	var first = RNG(PLAYER_1, PLAYER_2);
	if (first === PLAYER_1) {
		acting_player = PLAYER_1;
		switch (game_mode) {
			case GAME_MODE_SKIRMISH:
			case GAME_MODE_INTERCEPT:
				//let's see what type of ships we have.
				if (player_1_turn_counter <= player_1_ships_count[SHIP_CLASS_BB]) {
					ship_class_acting = SHIP_CLASS_BB;
					player_1_attack_count = BB_ATTACK_COUNT[player_1_engagement_form];
				}
				break;
			case GAME_MODE_CLASSIC:
				if (getPlayerShipCount(PLAYER_1) > 0) {
					player_1_attack_count = 1;
				}
				break;
		}
		if (player_1_attack_count > 0) {
			player_1_turn_counter = player_1_turn_counter + 1;
			beginTargeting();
		} else {
			nextPlayer();
		}

	} else {
		acting_player = PLAYER_2;
		switch (game_mode) {
			case GAME_MODE_SKIRMISH:
				//let's see what type of ships we have.
				if (player_2_turn_counter <= player_2_ships_count[SHIP_CLASS_BB]) {
					ship_class_acting = SHIP_CLASS_BB;
					player_2_attack_count = BB_ATTACK_COUNT[player_2_engagement_form];
				}

				break;
			case GAME_MODE_CLASSIC:
				if (getPlayerShipCount(PLAYER_2) > 0) {
					player_2_attack_count = 1;
				}
				break;
		}
		if (player_2_attack_count > 0) {
			player_2_turn_counter = player_2_turn_counter + 1;
			promptAction();
			attackMain();
		} else {
			nextPlayer();
		}
	}
}

/**
 * allow the player to select a squre to fire on
 */
function beginTargeting() {
	promptAction();
	document.getElementById("counterLeft").innerHTML = player_1_attack_count;
	document.getElementById("counterLabelLeft").innerHTML = string.attack_remaining;
	var grids = document.getElementById("monitorRight").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		if (!grids[i].hasAttribute("sunk")) {
			grids[i].addEventListener('click', fire, false);
		}
		if (!grids[i].hasAttribute("sunk") && !grids[i].hasAttribute("hit_count")) {
			grids[i].addEventListener('mouseover', lockOnSector, false);
			grids[i].addEventListener('mouseout', unLockOnSector, false);
		}
	}
}

function fire(evt) {
	var targetGrid = evt.target;
	var targetX = parseInt(targetGrid.getAttribute('x'));
	var targetY = parseInt(targetGrid.getAttribute('y'));
	if (acting_player === PLAYER_1) {
		player_1_attack_count = player_1_attack_count - 1;
		document.getElementById("counterLeft").innerHTML = player_1_attack_count;
	} else if (acting_player === PLAYER_2) {
		player_2_attack_count = player_2_attack_count - 1;
	}
	stopTargeting();
	if (ship_class_acting === SHIP_CLASS_CV) {
		airStrike(targetX, targetY);
	} else {
		artilleryStrike(targetX, targetY);
	}
}

function airStrike(x, y) {
	if (SOUND_ENABLED) {
		plane_attack_sound.play();
		setTimeout(function () {
			onAttackLanded(x, y);
		}, plane_attack_sound.duration * 1000 + 800);
	} else {
		onAttackLanded(x, y);
	}
}

function artilleryStrike(x, y) {
	if (SOUND_ENABLED && acting_player === PLAYER_1) {
		gun_fire_sound.play();
		setTimeout(function () {
			onAttackLanded(x, y);
		}, gun_fire_sound.duration * 1000 + 800);
	} else {
		onAttackLanded(x, y);
	}
}

//determine if the attack hit and its consequences
function onAttackLanded(x, y) {
	if (acting_player === PLAYER_1) {
		var tGrid = getMonitorGrid("monitorRight", x, y);
		if (tGrid.hasAttribute("hit_count")) {
			var hit = parseInt(tGrid.getAttribute("hit_count"));
			tGrid.setAttribute("hit_count", hit + 1);
		} else {
			tGrid.setAttribute("hit_count", "1");
		}
		tGrid.style.backgroundColor = 'navy';
		tGrid.style.backgroundImage = "";
		//see if we hit a ship
		if (tGrid.hasAttribute("placed")) {
			showHitEffect(tGrid);
			//see if we sunk it
			if (shipDestroyed("monitorRight", x, y)) {
				//TODO add instant win determiner
				//mark the ships as destroyed
				var tx = parseInt(tGrid.getAttribute("head-x"));
				var ty = parseInt(tGrid.getAttribute("head-y"));
				var tclass = parseInt(tGrid.getAttribute("ship-class"));
				var tbearing = parseInt(tGrid.getAttribute("ship-bearing"));
				var ship_size = SHIP_SIZE[tclass];
				player_2_ships_count[tclass] = player_2_ships_count[tclass] - 1;
				if (!FOG_OF_WAR) {
					refreshEnemyPanel();
				} else {
					document.getElementById("counterRight").innerHTML = getPlayerShipCount(PLAYER_2);
				}
				if (tbearing === SHIP_COURSE_VERTICAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = getMonitorGrid("monitorRight", (tx + i), ty);
						if (!FOG_OF_WAR) {
							Grid.style.backgroundImage = "url('" + getShipTileImagesURL(player_2_ship_set, tclass, SHIP_STATUS_DESTROYED)[i] + "')";
						} else {
							Grid.style.backgroundColor = "#990000";
						}
						Grid.setAttribute("sunk", "true");
						var effectId = parseInt(Grid.getAttribute("effectId"));
						clearInterval(effectId);
						var c = Grid.firstElementChild; //stop displaying effect for submerged ships
						clearCanvas(c);
						Grid.removeEventListener('click', fire, false);
					}

				} else if (tbearing === SHIP_COURSE_HORIZONTAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = getMonitorGrid("monitorRight", tx, (ty + i));
						if (!FOG_OF_WAR) {
							Grid.style.backgroundImage = "url('" + getShipTileImagesURL(player_2_ship_set, tclass, SHIP_STATUS_DESTROYED)[i] + "')";
						} else {
							Grid.style.backgroundColor = "#990000";
						}
						Grid.setAttribute("sunk", "true");
						var effectId = parseInt(Grid.getAttribute("effectId"));
						clearInterval(effectId);
						var c = Grid.firstElementChild; //stop displaying effect for submerged ships
						clearCanvas(c);
						Grid.removeEventListener('click', fire, false);
					}
				}
			}
			if (SOUND_ENABLED) {
				attack_hit_sound_distant.play();
				setTimeout(function () {
					if (player_1_attack_count > 0) {
						beginTargeting();
					} else {
						nextPlayer();
					}
				}, attack_hit_sound_distant.duration * 1000 + 800);
			} else {
				setTimeout(function () {
					if (player_1_attack_count > 0) {
						beginTargeting();
					} else {
						nextPlayer();
					}
				}, 1200);
			}
		} else {
			var sid = showWaterSplash(tGrid);
			if (SOUND_ENABLED) {
				attack_miss_sound.play();
				setTimeout(function () {
					clearInterval(sid);
					if (player_1_attack_count > 0) {
						beginTargeting();
					} else {
						nextPlayer();
					}
				}, attack_miss_sound.duration * 1000 + 800);
			} else {
				setTimeout(function () {
					clearInterval(sid);
					if (player_1_attack_count > 0) {
						beginTargeting();
					} else {
						nextPlayer();
					}
				}, 3000);
			}
		}
	} else if (acting_player === PLAYER_2) {
		var tGrid = getMonitorGrid("monitorLeft", x, y);
		if (tGrid.hasAttribute("hit_count")) {
			var hit = parseInt(tGrid.getAttribute("hit_count"));
			tGrid.setAttribute("hit_count", hit + 1);
		} else {
			tGrid.setAttribute("hit_count", "1");
		}
		tGrid.style.backgroundColor = 'navy';
		//see if we hit a ship
		if (tGrid.hasAttribute("placed")) {
			showHitEffect(tGrid);
			//see if we sunk it
			if (shipDestroyed("monitorLeft", x, y)) {
				var tx = parseInt(tGrid.getAttribute("head-x"));
				var ty = parseInt(tGrid.getAttribute("head-y"));
				var tclass = parseInt(tGrid.getAttribute("ship-class"));
				var tbearing = parseInt(tGrid.getAttribute("ship-bearing"));
				//mark the ships as destroyed
				var ship_size = SHIP_SIZE[tclass];
				player_1_ships_count[tclass] = player_1_ships_count[tclass] - 1;
				refreshPlayerPanel();
				if (tbearing === SHIP_COURSE_VERTICAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = getMonitorGrid("monitorLeft", (tx + i), ty);
						Grid.style.backgroundImage = "url('" + getShipTileImagesURL(player_1_ship_set, tclass, SHIP_STATUS_DESTROYED)[i] + "')";
						var effectId = parseInt(Grid.getAttribute("effectId"));
						clearInterval(effectId);
						var c = Grid.firstElementChild; //stop displaying effect for submerged ships
						clearCanvas(c);
						Grid.setAttribute("sunk", "true");

					}
				} else if (tbearing === SHIP_COURSE_HORIZONTAL) {
					for (var i = 0; i < ship_size; i++) {
						var Grid = getMonitorGrid("monitorLeft", tx, (ty + i));
						Grid.style.backgroundImage = "url('" + getShipTileImagesURL(player_1_ship_set, tclass, SHIP_STATUS_DESTROYED)[i] + "')";
						var effectId = parseInt(Grid.getAttribute("effectId"));
						clearInterval(effectId);
						var c = Grid.firstElementChild; //stop displaying effect for submerged ships
						clearCanvas(c);
						Grid.setAttribute("sunk", "true");

					}
				}
			}
			onAttackResult(true);
			if (SOUND_ENABLED) {
				attack_hit_sound.play();
				setTimeout(function () {
					if (player_2_attack_count > 0) {
						attackMain();
					} else {
						nextPlayer();
					}
				}, attack_hit_sound.duration * 1000 + 800);
			} else {
				setTimeout(function () {
					clearInterval(sid);
					if (player_2_attack_count > 0) {
						attackMain();
					} else {
						nextPlayer();
					}
				}, 1200);
			}
		} else {
			var sid = showWaterSplash(tGrid);
			onAttackResult(false);
			if (SOUND_ENABLED) {
				attack_miss_sound.play();
				setTimeout(function () {
					clearInterval(sid);
					if (player_2_attack_count > 0) {
						attackMain();
					} else {
						nextPlayer();
					}
				}, attack_miss_sound.duration * 1000 + 800);
			} else {
				setTimeout(function () {
					clearInterval(sid);
					if (player_2_attack_count > 0) {
						attackMain();
					} else {
						nextPlayer();
					}
				}, 3000);
			}

		}
	}
}

//given a coordinate, check if the ship is destroyed.
function shipDestroyed(map, x, y) {
	var tGrid = getMonitorGrid(map, x, y);
	var tx = parseInt(tGrid.getAttribute("head-x"));
	var ty = parseInt(tGrid.getAttribute("head-y"));
	var sClass = parseInt(tGrid.getAttribute("ship-class"));
	var bearing = parseInt(tGrid.getAttribute("ship-bearing"));
	var ship_size = SHIP_SIZE[sClass];
	var criticalDamage = getShipCriticalDamage(sClass);
	if (bearing === SHIP_COURSE_VERTICAL) {
		for (var i = 0; i < ship_size; i++) {
			var Grid = getMonitorGrid(map, (tx + i), ty);
			if (Grid.hasAttribute("hit_count")) {
				if (parseInt(Grid.getAttribute("hit_count")) >= criticalDamage) {
					if (i === (ship_size - 1)) {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	} else if (bearing === SHIP_COURSE_HORIZONTAL) {
		for (var i = 0; i < ship_size; i++) {
			var Grid = getMonitorGrid(map, tx, (ty + i));
			if (Grid.hasAttribute("hit_count")) {
				if (parseInt(Grid.getAttribute("hit_count")) >= criticalDamage) {
					if (i === (ship_size - 1)) {
						return true;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	}
}

function getShipCriticalDamage(shipClass) {//TODO section specific critical damage
	if (game_mode === GAME_MODE_CLASSIC) {
		return 1;
	} else {
		return CRITICAL_DAMAGE[shipClass];
	}
}


function lockOnSector(evt) {
	var targetGrid = evt.target;
	var sIcon = document.createElement('img');
	sIcon.setAttribute('src', img_url.crosshair);
	sIcon.setAttribute('class', "Crosshair");
	targetGrid.appendChild(sIcon);


}

function unLockOnSector(evt) {
	var targetGrid = evt.target;
	if (targetGrid.childNodes[targetGrid.childNodes.length - 1].getAttribute("class") === "Crosshair") {
		targetGrid.removeChild(targetGrid.childNodes[targetGrid.childNodes.length - 1]);
	}

}

function stopTargeting() {
	hideActionPrompt();
	document.getElementById("counterLeft").innerHTML = getPlayerShipCount(PLAYER_1);
	document.getElementById("counterLabelLeft").innerHTML = string.ship_placement_remaining;
	var grids = document.getElementById("monitorRight").getElementsByClassName("MonitorGrid");
	for (var i = 0; i < grids.length; i++) {
		grids[i].removeEventListener('click', fire, false);
		grids[i].removeEventListener('mouseover', lockOnSector, false);
		//grids[i].removeEventListener('mouseout', unLockOnSector, false);
	}
}

function promptAction() {
	var ap;
	if (acting_player === PLAYER_1) {
		document.getElementById("apRight").style.visibility = "visible";
	} else {
		document.getElementById("apLeft").style.visibility = "visible";
	}

}

function hideActionPrompt() {
	if (acting_player === PLAYER_1) {
		document.getElementById("apRight").style.visibility = "hidden";
	} else {
		document.getElementById("apLeft").style.visibility = "hidden";
	}

}

//refredh the number of ship displayed for player
function refreshPlayerPanel() {
	document.getElementById("counterLeft").innerHTML = getPlayerShipCount(PLAYER_1);
	var labels = document.getElementById("dataPanelContentLeft").querySelectorAll('.ShipClassLabel');
	for (var i = 0; i < labels.length; i++) {
		switch (i) {
			case SHIP_CLASS_BB:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_ships_count[SHIP_CLASS_BB];
				break;
			case SHIP_CLASS_CV:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_ships_count[SHIP_CLASS_CV];
				break;
			case SHIP_CLASS_CA:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_ships_count[SHIP_CLASS_CA];
				break;
			case SHIP_CLASS_DD:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_1_ships_count[SHIP_CLASS_DD];
				break;
		}
	}
}

function refreshEnemyPanel() {
	document.getElementById("counterRight").innerHTML = getPlayerShipCount(PLAYER_2);
	var labels = document.getElementById("dataPanelContentRight").querySelectorAll('.ShipClassLabel');
	for (var i = 0; i < labels.length; i++) {
		switch (i) {
			case SHIP_CLASS_BB:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_ships_count[SHIP_CLASS_BB];
				break;
			case SHIP_CLASS_CV:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_ships_count[SHIP_CLASS_CV];
				break;
			case SHIP_CLASS_CA:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_ships_count[SHIP_CLASS_CA];
				break;
			case SHIP_CLASS_DD:
				labels[i].innerHTML = string.ship_classes[i] + " : " + player_2_ships_count[SHIP_CLASS_DD];
				break;
		}
	}
}

function nextPlayer() {
	if (gameEnded()) {
		refreshPlayerPanel();
		refreshEnemyPanel();
		hideActionPrompt();
		var mainButton = document.getElementById("mainButton");
		mainButton.innerHTML = string.new_game;
		mainButton.removeEventListener('click', surrender, false);
		mainButton.addEventListener('click', newGame, false);
	} else if (acting_player === PLAYER_1) {
		hideActionPrompt();
		acting_player = PLAYER_2;
		promptAction();
		switch (game_mode) {
			case GAME_MODE_SKIRMISH:
			case GAME_MODE_INTERCEPT:
			case GAME_MODE_CONVOY:
			case GAME_MODE_BREAKTHROUGH:
				if (game_phase === GAME_PAHSE_AERIAL_COMBAT) {
					player_1_acted = true;
					player_2_attack_count = player_2_ships_count[SHIP_CLASS_CV] * 2;
					if (player_2_attack_count > 0 && !player_2_acted) {
						showStageBox(string.game_stage_aerial_prompt_enemy);
						attackMain();
					} else {
						//well both acted. let's move to next stage.
						startFleetCombat();
					}
				} else if (game_phase === GAME_PHASE_COMBAT) {
					if (!player_2_first_act_complete) {
						if (player_2_turn_counter >= getPlayerShipCount(PLAYER_2)) {
							player_2_first_act_complete = true;
						}
						if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_BB;
							player_2_attack_count = BB_ATTACK_COUNT[player_2_engagement_form];

							if (player_2_attack_count > 0) {
								player_2_turn_counter = player_2_turn_counter + 1;
								attackMain();
							}
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_BB]) {
							//the opponent still have BBs yet.skip this turn directly.
							nextPlayer();
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CA;
							player_2_attack_count = CA_ATTACK_COUNT[player_2_engagement_form];

							if (player_2_attack_count > 0) {
								player_2_turn_counter = player_2_turn_counter + 1;
								attackMain();
							} else {
								//extra code for cCA under t-dis(0 atk chance)
								player_2_turn_counter = player_2_turn_counter + 1;
								nextPlayer();
							}
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							//ditto
							nextPlayer();
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_DD] + player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_DD;
							player_2_attack_count = DD_ATTACK_COUNT[player_2_engagement_form];

							if (player_2_attack_count > 0) {
								player_2_turn_counter = player_2_turn_counter + 1;
								attackMain();
							} else {
								//extra code for cCA under t-dis(0 atk chance)
								player_2_turn_counter = player_2_turn_counter + 1;
								nextPlayer();
							}
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_DD] + player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							//ditto
							nextPlayer();
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_CV] + player_2_ships_count[SHIP_CLASS_DD] + player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CV;
							player_2_attack_count = CV_ATTACK_COUNT[player_2_engagement_form];
							if (player_2_attack_count > 0) {
								player_2_turn_counter = player_2_turn_counter + 1;
								attackMain();
							}
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_CV] + player_1_ships_count[SHIP_CLASS_DD] + player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							//ditto
							nextPlayer();
						} else {
							nextPlayer();
						}
					} else {
						if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_BB;
							player_2_attack_count = BB_ATTACK_COUNT[player_2_engagement_form];
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CA;
							player_2_attack_count = CA_ATTACK_COUNT[player_2_engagement_form];
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_DD] + player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_DD;
							player_2_attack_count = DD_ATTACK_COUNT[player_2_engagement_form];
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_CV] + player_2_ships_count[SHIP_CLASS_DD] + player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CV;
							player_2_attack_count = CV_ATTACK_COUNT[player_2_engagement_form];
						}
						player_2_turn_counter = player_2_turn_counter + 1;
						if (player_2_turn_counter > getPlayerShipCount(PLAYER_2) - player_2_ships_count[SHIP_CLASS_AP]) {
							player_2_acted = true;
						}
						if (player_2_acted && player_1_acted) {
							player_2_turn_counter = 0;
							player_1_turn_counter = 0;
							total_turn_counter = total_turn_counter + 1;
							if (game_mode === GAME_MODE_INTERCEPT || game_mode === GAME_MODE_CONVOY || game_mode === GAME_MODE_BREAKTHROUGH) {
								updateTurnCounter();
							}
							player_2_acted = false;
							player_1_acted = false;
						}
						if (player_2_attack_count > 0) {
							attackMain();
						} else {
							nextPlayer();
						}
					}
				}
				break;
			case GAME_MODE_CLASSIC:
				if (getPlayerShipCount(PLAYER_2) > 0) {
					player_2_attack_count = 1;
				}
				if (player_2_attack_count > 0) {
					player_2_turn_counter = player_2_turn_counter + 1;
					attackMain();
				} else {
					nextPlayer();
				}
				break;
		}

	} else {
		hideActionPrompt();
		acting_player = PLAYER_1;
		switch (game_mode) {
			case GAME_MODE_SKIRMISH:
			case GAME_MODE_INTERCEPT:
			case GAME_MODE_CONVOY:
			case GAME_MODE_BREAKTHROUGH:
				if (game_phase === GAME_PAHSE_AERIAL_COMBAT) {
					player_2_acted = true;
					player_1_attack_count = player_1_ships_count[SHIP_CLASS_CV] * 2;
					if (player_1_attack_count > 0 && !player_1_acted) {
						showStageBox(string.game_stage_aerial_prompt_player);
						beginTargeting();
					} else {
						startFleetCombat();
					}
				} else if (game_phase === GAME_PHASE_COMBAT) {
					if (!player_1_first_act_complete) {
						if (player_1_turn_counter >= getPlayerShipCount(PLAYER_1) - player_1_ships_count[SHIP_CLASS_AP]) {
							player_1_first_act_complete = true;
						}
						if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_BB;
							player_1_attack_count = BB_ATTACK_COUNT[player_1_engagement_form];
							if (player_1_attack_count > 0) {
								player_1_turn_counter = player_1_turn_counter + 1;
								beginTargeting();
							}
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_BB]) {
							//the opponent still have BBs yet.skip this turn directly.
							nextPlayer();
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CA;
							player_1_attack_count = CA_ATTACK_COUNT[player_1_engagement_form];
							if (player_1_attack_count > 0) {
								player_1_turn_counter = player_1_turn_counter + 1;
								beginTargeting();
							} else {
								//extra code for CA under t-dis(0 atk chance)
								player_1_turn_counter = player_1_turn_counter + 1;
								nextPlayer();
							}
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							//ditto
							nextPlayer();
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_DD] + player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_DD;
							player_1_attack_count = DD_ATTACK_COUNT[player_1_engagement_form];
							if (player_1_attack_count > 0) {
								player_1_turn_counter = player_1_turn_counter + 1;
								beginTargeting();
							} else {
								//extra code for DD under t-dis(0 atk chance)
								player_1_turn_counter = player_1_turn_counter + 1;
								nextPlayer();
							}
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_DD] + player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							//ditto
							nextPlayer();
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_CV] + player_1_ships_count[SHIP_CLASS_DD] + player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CV;
							player_1_attack_count = CV_ATTACK_COUNT[player_1_engagement_form];
							if (player_1_attack_count > 0) {
								player_1_turn_counter = player_1_turn_counter + 1;
								beginTargeting();
							}
						} else if (player_2_turn_counter < player_2_ships_count[SHIP_CLASS_CV] + player_2_ships_count[SHIP_CLASS_DD] + player_2_ships_count[SHIP_CLASS_CA] + player_2_ships_count[SHIP_CLASS_BB]) {
							//ditto
							nextPlayer();
						} else {
							nextPlayer();
						}
					} else {
						if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_BB;
							player_1_attack_count = BB_ATTACK_COUNT[player_1_engagement_form];
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CA;
							player_1_attack_count = CA_ATTACK_COUNT[player_1_engagement_form];
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_DD] + player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_DD;
							player_1_attack_count = DD_ATTACK_COUNT[player_1_engagement_form];
						} else if (player_1_turn_counter < player_1_ships_count[SHIP_CLASS_CV] + player_1_ships_count[SHIP_CLASS_DD] + player_1_ships_count[SHIP_CLASS_CA] + player_1_ships_count[SHIP_CLASS_BB]) {
							ship_class_acting = SHIP_CLASS_CV;
							player_1_attack_count = CV_ATTACK_COUNT[player_1_engagement_form];
						}
						player_1_turn_counter = player_1_turn_counter + 1;
						if (player_1_turn_counter > getPlayerShipCount(PLAYER_1) - player_1_ships_count[SHIP_CLASS_AP]) {
							player_1_acted = true;
						}
						if (player_2_acted && player_1_acted) {
							player_2_turn_counter = 0;
							player_1_turn_counter = 0;
							total_turn_counter = total_turn_counter + 1;
							if (game_mode === GAME_MODE_INTERCEPT || game_mode === GAME_MODE_CONVOY || game_mode === GAME_MODE_BREAKTHROUGH) {
								updateTurnCounter();
							}
							player_2_acted = false;
							player_1_acted = false;
						}
						if (player_1_attack_count > 0) {
							beginTargeting();
						} else {
							nextPlayer();
						}
					}
				}
				break;
			case GAME_MODE_CLASSIC:
				if (getPlayerShipCount(PLAYER_1) > 0) {
					player_1_attack_count = 1;
				}
				if (player_1_attack_count > 0) {
					player_1_turn_counter = player_1_turn_counter + 1;
					beginTargeting();
				} else {
					nextPlayer();
				}
				break;
		}
	}
}

function updateTurnCounter() {
	document.getElementById("TurnCounter").innerHTML = (max_turn_intercept_breakthrough - total_turn_counter);
}

function gameEnded() {
	//see if any one fleet lose all their ships
	if (getPlayerShipCount(PLAYER_1) <= 0) {
		//TODO maybe using graphics to display the dialog?
		showEndGameDialog(string.defeat, string.defeat_description_standard);
		return true;
	} else if (getPlayerShipCount(PLAYER_2) <= 0) {
		showEndGameDialog(string.victory, string.victory_description_standard);
		return true;
	} else if (game_mode === GAME_MODE_INTERCEPT) {
		if (total_turn_counter >= max_turn_intercept_breakthrough) {
			showEndGameDialog(string.defeat, string.defeat_description_intercept);
			return true;
		}
		if (SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH) {
			if (player_2_ships_count[ship_class_target] <= 0) {
				showEndGameDialog(string.victory, string.victory_description_intercept);
				return true;
			}
		}
	} else if (game_mode === GAME_MODE_BREAKTHROUGH) {
		if (total_turn_counter >= max_turn_intercept_breakthrough) {
			showEndGameDialog(string.victory, string.victory_description_breakthrough);
			return true;
		}
		if (SPECIFIC_CLASS_INTERCEPT_BREAKTHROUGH) {
			if (player_1_ships_count[ship_class_target] <= 0) {
				showEndGameDialog(string.defeat, string.defeat_description_breakthrough);
				return true;
			}
		}
	} else if (game_mode === GAME_MODE_CONVOY) {
		if (total_turn_counter >= max_turn_intercept_breakthrough) {
			showEndGameDialog(string.victory, string.victory_description_convoy);
			return true;
		}
		if (player_1_ships_count[SHIP_CLASS_AP] <= 0) {
			showEndGameDialog(string.defeat, string.defeat_description_convoy);
			return true;
		}
		//TODO Destruction of marked target
	} else {
		return false;
	}
}

function showEndGameDialog(title, description) {

	document.getElementById('EndingTitle').innerHTML = title;
	document.getElementById('EndingDescription').innerHTML = description;
	document.getElementById('endGameBox').style.display = "table";
	setTimeout(function () {
		window.onclick = function (event) {
			document.getElementById('endGameBox').style.display = "none";

		}
	}, 3000);
}

function showStageBox(stageText, duration) {
	if (!duration) {
		duration = 3500;
	}
	document.getElementById('info-text').innerHTML = stageText;
	document.getElementById('stage-box').style.height = "100vh";
	document.getElementById('stage-box').style.display = "table";
	document.getElementById("stage-box-content").style.top = "0";
	setTimeout(function () {
		document.getElementById("stage-box-content").style.top = "-500px";
	}, duration);
	setTimeout(function () {
		document.getElementById('stage-box').style.display = "block";
		document.getElementById('stage-box').style.height = "0";
	}, duration + 2000);
}

function surrender() {
	//TODO replace confirm with html 5 dialog
	if (confirm(string.surrender_confirm)) {
		//scuttle all ships to trigger lose effect
		for (var i = 0; i < player_1_ships_count.length; i++) {
			player_1_ships_count[i] = 0;
		}
		nextPlayer();
	} else {
		//do nothing
	}
}

function newGame(evt) {
	//TODO replace confirm with html 5 dialog
	if (confirm(string.new_game_confirm)) {
		location.reload();
	} else {
		//do nothing
	}
}
