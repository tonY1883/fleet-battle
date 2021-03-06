// global variable for game resources, in form of javascript json.
//string resources
var string = {
	"game_config_error": "Game not properly configured. Check your configuration file.",
	"game_mode_label": "Scenario :",
	"game_mode": [
		"Skirmish",
		"Classic",
		"Interception",
		"Breakthrough",
		"Convoy"
	],
	"currenlt_stage": "Current Stage",
	"ship_placement_remaining": "Remaining ship",
	"ship_classes": [
		"Battleship",
		"Aircraft Carrier",
		"Cruiser",
		"Destroyer",
		"Transport"
	],
	"pending": "Pending...",
	"rotate": "Rotate ship",
	"assemble_fleet": "Assemble Fleet",
	"start_battle": "Start Battle!",
	"no_ship_prompt": "You cannot enter a battle with a ghost fleet!",
	"no_ap_prompt": "You must bring all your transport ships with you!",
	"surrender": "Surrender your ships",
	"game_objective_label": "Objective : ",
	"game_objective_loading": "Waiting for briefing",
	"game_objective_standard": "Destroy all enemy vessels",
	"game_objective_intercept_bb": "Destroy enemy battleships",
	"game_objective_intercept_cv": "Destroy enemy aircraft carriers",
	"game_objective_breakthrough_bb": "Protect your battleships to break through enemy resistance",
	"game_objective_breakthrough_cv": "Protect your aircraft carriers to break through enemy resistance",
	"game_objective_breakthrough": "Break through enemy resistance",
	"game_objective_convoy": "Escort the transport ships to their destination",
	"game_stage_aerial": "AERIAL COMBAT",
	"game_stage_aerial_prompt_player": "Attack wing, ready to launch!",
	"game_stage_aerial_prompt_enemy": "Enemy aircraft sighted!",
	"game_stage_artillery": "FLEET ACTION",
	"game_stage_artillery_prompt": "Enemy in range!",
	"form_of_engagement_label": "Form of Engagement",
	"form_of_engagement": [
		"Parallel",
		"Head On",
		"T - Advantage",
		"T - Disadvantage"
	],
	"turn_counter_label": "Time Remaining: ",
	"attack_remaining": "Attack Remaining",
	"surrender_confirm": "Are you sure you want to surrender your ships? You will be treated as defeated!",
	"victory": "VICTORY",
	"victory_description_standard": "All enemy vessels destroyed!",
	"victory_description_intercept": "Target vessel destroyed!",
	"victory_description_breakthrough": "You have arrived at your destination.",
	"victory_description_convoy": "The transport ships have arrived at their destination.",
	"defeat": "DEFEAT",
	"defeat_description_standard": "Your fleet was annihilated.",
	"defeat_description_intercept": "The enemy had reached their destination.",
	"defeat_description_breakthrough": "You failed to protect your ships.",
	"defeat_description_convoy": "The transport ships are destroyed.",
	"new_game": "Proceed into next battle",
	"new_game_confirm": "Are you sure you want to start a new battle?",
	"action_prompt_player": "Awaiting Orders",
	"action_prompt_enemy": "INCOMING",
	"ready": "Ready",
	"tutorial_confirm": "Greetings commander.<br>It seems that this is the first time you get hold of a fleet.<br>Would you like to read the manual first?",
	"tutorial_confirm_yes": "Of course.",
	"tutorial_confirm_no": "No, thanks.",
    "version_code": "Version 0.9.0",
	"github_link_text": "Source code, guides and other materials are available on",
	"game_title": "Warships: Line of Battle"
};


//image resources
var img_url = {
	"crosshair": "img/tiles/crosshair.png",
	"ship_icons": [

		["img/ships/jp/BB.png",
			"img/ships/jp/CV.png",
			"img/ships/jp/CA.png",
			"img/ships/jp/DD.png",
			"img/ships/jp/AP.svg"
		],

		["img/ships/us/BB.png",
			"img/ships/us/CV.png",
			"img/ships/us/CA.png",
			"img/ships/us/DD.png",
			"img/ships/us/AP.svg"
		],

		["img/ships/uk/BB.png",
			"img/ships/uk/CV.png",
			"img/ships/uk/CA.png",
			"img/ships/uk/DD.png",
			"img/ships/uk/AP.svg"
		],
		["img/ships/de/BB.png",
			"img/ships/de/CV.png",
			"img/ships/de/CA.png",
			"img/ships/de/DD.png",
			"img/ships/de/AP.svg"
		]


	],
	"ship_tiles_default": [
		[
			[
				"img/tiles/default/BB/sector_1_normal.png",
				"img/tiles/default/BB/sector_2_normal.png",
				"img/tiles/default/BB/sector_3_normal.png",
				"img/tiles/default/BB/sector_4_normal.png"
			],
			[
				"img/tiles/default/BB/sector_1_hit.png",
				"img/tiles/default/BB/sector_2_hit.png",
				"img/tiles/default/BB/sector_3_hit.png",
				"img/tiles/default/BB/sector_4_hit.png"
			],
			[
				"img/tiles/default/BB/sector_1_sunk.png",
				"img/tiles/default/BB/sector_2_sunk.png",
				"img/tiles/default/BB/sector_3_sunk.png",
				"img/tiles/default/BB/sector_4_sunk.png"
			]
		],
		[
			[
				"img/tiles/default/CV/sector_1_normal.png",
				"img/tiles/default/CV/sector_2_normal.png",
				"img/tiles/default/CV/sector_3_normal.png",
				"img/tiles/default/CV/sector_4_normal.png"
			],
			[
				"img/tiles/default/CV/sector_1_hit.png",
				"img/tiles/default/CV/sector_2_hit.png",
				"img/tiles/default/CV/sector_3_hit.png",
				"img/tiles/default/CV/sector_4_hit.png"
			],
			[
				"img/tiles/default/CV/sector_1_sunk.png",
				"img/tiles/default/CV/sector_2_sunk.png",
				"img/tiles/default/CV/sector_3_sunk.png",
				"img/tiles/default/CV/sector_4_sunk.png"
			]
		],
		[
			[
				"img/tiles/default/CA/sector_1_normal.png",
				"img/tiles/default/CA/sector_2_normal.png",
				"img/tiles/default/CA/sector_3_normal.png"
			],
			[
				"img/tiles/default/CA/sector_1_hit.png",
				"img/tiles/default/CA/sector_2_hit.png",
				"img/tiles/default/CA/sector_3_hit.png"
			],
			[
				"img/tiles/default/CA/sector_1_sunk.png",
				"img/tiles/default/CA/sector_2_sunk.png",
				"img/tiles/default/CA/sector_3_sunk.png"
			]
		],
		[
			[
				"img/tiles/default/DD/sector_1_normal.png",
				"img/tiles/default/DD/sector_2_normal.png"
			],
			[
				"img/tiles/default/DD/sector_1_hit.png",
				"img/tiles/default/DD/sector_2_hit.png"
			],
			[
				"img/tiles/default/DD/sector_1_sunk.png",
				"img/tiles/default/DD/sector_2_sunk.png"
			]

		],
		[
			[
				"img/tiles/default/AP/sector_1_normal.png",
				"img/tiles/default/AP/sector_2_normal.png",
				"img/tiles/default/AP/sector_3_normal.png"
			],
			[
				"img/tiles/default/AP/sector_1_hit.png",
				"img/tiles/default/AP/sector_2_hit.png",
				"img/tiles/default/AP/sector_3_hit.png"
			],
			[
				"img/tiles/default/AP/sector_1_sunk.png",
				"img/tiles/default/AP/sector_2_sunk.png",
				"img/tiles/default/AP/sector_3_sunk.png"
			]
		]
	],
	"ship_tiles_nation": [
		[
			[
				[
					"img/tiles/jp/BB/sector_1_normal.png",
					"img/tiles/jp/BB/sector_2_normal.png",
					"img/tiles/jp/BB/sector_3_normal.png",
					"img/tiles/jp/BB/sector_4_normal.png"
				],
				[
					"img/tiles/jp/BB/sector_1_hit.png",
					"img/tiles/jp/BB/sector_2_hit.png",
					"img/tiles/jp/BB/sector_3_hit.png",
					"img/tiles/jp/BB/sector_4_hit.png"
				],
				[
					"img/tiles/jp/BB/sector_1_sunk.png",
					"img/tiles/jp/BB/sector_2_sunk.png",
					"img/tiles/jp/BB/sector_3_sunk.png",
					"img/tiles/jp/BB/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/jp/CV/sector_1_normal.png",
					"img/tiles/jp/CV/sector_2_normal.png",
					"img/tiles/jp/CV/sector_3_normal.png",
					"img/tiles/jp/CV/sector_4_normal.png"
				],
				[
					"img/tiles/jp/CV/sector_1_hit.png",
					"img/tiles/jp/CV/sector_2_hit.png",
					"img/tiles/jp/CV/sector_3_hit.png",
					"img/tiles/jp/CV/sector_4_hit.png"
				],
				[
					"img/tiles/jp/CV/sector_1_sunk.png",
					"img/tiles/jp/CV/sector_2_sunk.png",
					"img/tiles/jp/CV/sector_3_sunk.png",
					"img/tiles/jp/CV/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/jp/CA/sector_1_normal.png",
					"img/tiles/jp/CA/sector_2_normal.png",
					"img/tiles/jp/CA/sector_3_normal.png"
				],
				[
					"img/tiles/jp/CA/sector_1_hit.png",
					"img/tiles/jp/CA/sector_2_hit.png",
					"img/tiles/jp/CA/sector_3_hit.png"
				],
				[
					"img/tiles/jp/CA/sector_1_sunk.png",
					"img/tiles/jp/CA/sector_2_sunk.png",
					"img/tiles/jp/CA/sector_3_sunk.png"
				]
			],
			[
				[
					"img/tiles/jp/DD/sector_1_normal.png",
					"img/tiles/jp/DD/sector_2_normal.png"
				],
				[
					"img/tiles/jp/DD/sector_1_hit.png",
					"img/tiles/jp/DD/sector_2_hit.png"
				],
				[
					"img/tiles/jp/DD/sector_1_sunk.png",
					"img/tiles/jp/DD/sector_2_sunk.png"
				]

			],
			[]
		],
		[
			[
				[
					"img/tiles/us/BB/sector_1_normal.png",
					"img/tiles/us/BB/sector_2_normal.png",
					"img/tiles/us/BB/sector_3_normal.png",
					"img/tiles/us/BB/sector_4_normal.png"
				],
				[
					"img/tiles/us/BB/sector_1_hit.png",
					"img/tiles/us/BB/sector_2_hit.png",
					"img/tiles/us/BB/sector_3_hit.png",
					"img/tiles/us/BB/sector_4_hit.png"
				],
				[
					"img/tiles/us/BB/sector_1_sunk.png",
					"img/tiles/us/BB/sector_2_sunk.png",
					"img/tiles/us/BB/sector_3_sunk.png",
					"img/tiles/us/BB/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/us/CV/sector_1_normal.png",
					"img/tiles/us/CV/sector_2_normal.png",
					"img/tiles/us/CV/sector_3_normal.png",
					"img/tiles/us/CV/sector_4_normal.png"
				],
				[
					"img/tiles/us/CV/sector_1_hit.png",
					"img/tiles/us/CV/sector_2_hit.png",
					"img/tiles/us/CV/sector_3_hit.png",
					"img/tiles/us/CV/sector_4_hit.png"
				],
				[
					"img/tiles/us/CV/sector_1_sunk.png",
					"img/tiles/us/CV/sector_2_sunk.png",
					"img/tiles/us/CV/sector_3_sunk.png",
					"img/tiles/us/CV/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/us/CA/sector_1_normal.png",
					"img/tiles/us/CA/sector_2_normal.png",
					"img/tiles/us/CA/sector_3_normal.png"
				],
				[
					"img/tiles/us/CA/sector_1_hit.png",
					"img/tiles/us/CA/sector_2_hit.png",
					"img/tiles/us/CA/sector_3_hit.png"
				],
				[
					"img/tiles/us/CA/sector_1_sunk.png",
					"img/tiles/us/CA/sector_2_sunk.png",
					"img/tiles/us/CA/sector_3_sunk.png"
				]
			],
			[
				[
					"img/tiles/us/DD/sector_1_normal.png",
					"img/tiles/us/DD/sector_2_normal.png"
				],
				[
					"img/tiles/us/DD/sector_1_hit.png",
					"img/tiles/us/DD/sector_2_hit.png"
				],
				[
					"img/tiles/us/DD/sector_1_sunk.png",
					"img/tiles/us/DD/sector_2_sunk.png"
				]

			],
			[]
		],
		[
			[
				[
					"img/tiles/uk/BB/sector_1_normal.png",
					"img/tiles/uk/BB/sector_2_normal.png",
					"img/tiles/uk/BB/sector_3_normal.png",
					"img/tiles/uk/BB/sector_4_normal.png"
				],
				[
					"img/tiles/uk/BB/sector_1_hit.png",
					"img/tiles/uk/BB/sector_2_hit.png",
					"img/tiles/uk/BB/sector_3_hit.png",
					"img/tiles/uk/BB/sector_4_hit.png"
				],
				[
					"img/tiles/uk/BB/sector_1_sunk.png",
					"img/tiles/uk/BB/sector_2_sunk.png",
					"img/tiles/uk/BB/sector_3_sunk.png",
					"img/tiles/uk/BB/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/uk/CV/sector_1_normal.png",
					"img/tiles/uk/CV/sector_2_normal.png",
					"img/tiles/uk/CV/sector_3_normal.png",
					"img/tiles/uk/CV/sector_4_normal.png"
				],
				[
					"img/tiles/uk/CV/sector_1_hit.png",
					"img/tiles/uk/CV/sector_2_hit.png",
					"img/tiles/uk/CV/sector_3_hit.png",
					"img/tiles/uk/CV/sector_4_hit.png"
				],
				[
					"img/tiles/uk/CV/sector_1_sunk.png",
					"img/tiles/uk/CV/sector_2_sunk.png",
					"img/tiles/uk/CV/sector_3_sunk.png",
					"img/tiles/uk/CV/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/uk/CA/sector_1_normal.png",
					"img/tiles/uk/CA/sector_2_normal.png",
					"img/tiles/uk/CA/sector_3_normal.png"
				],
				[
					"img/tiles/uk/CA/sector_1_hit.png",
					"img/tiles/uk/CA/sector_2_hit.png",
					"img/tiles/uk/CA/sector_3_hit.png"
				],
				[
					"img/tiles/uk/CA/sector_1_sunk.png",
					"img/tiles/uk/CA/sector_2_sunk.png",
					"img/tiles/uk/CA/sector_3_sunk.png"
				]
			],
			[
				[
					"img/tiles/uk/DD/sector_1_normal.png",
					"img/tiles/uk/DD/sector_2_normal.png"
				],
				[
					"img/tiles/uk/DD/sector_1_hit.png",
					"img/tiles/uk/DD/sector_2_hit.png"
				],
				[
					"img/tiles/uk/DD/sector_1_sunk.png",
					"img/tiles/uk/DD/sector_2_sunk.png"
				]

			],
			[]
		],
		[
			[
				[
					"img/tiles/de/BB/sector_1_normal.png",
					"img/tiles/de/BB/sector_2_normal.png",
					"img/tiles/de/BB/sector_3_normal.png",
					"img/tiles/de/BB/sector_4_normal.png"
				],
				[
					"img/tiles/de/BB/sector_1_hit.png",
					"img/tiles/de/BB/sector_2_hit.png",
					"img/tiles/de/BB/sector_3_hit.png",
					"img/tiles/de/BB/sector_4_hit.png"
				],
				[
					"img/tiles/de/BB/sector_1_sunk.png",
					"img/tiles/de/BB/sector_2_sunk.png",
					"img/tiles/de/BB/sector_3_sunk.png",
					"img/tiles/de/BB/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/de/CV/sector_1_normal.png",
					"img/tiles/de/CV/sector_2_normal.png",
					"img/tiles/de/CV/sector_3_normal.png",
					"img/tiles/de/CV/sector_4_normal.png"
				],
				[
					"img/tiles/de/CV/sector_1_hit.png",
					"img/tiles/de/CV/sector_2_hit.png",
					"img/tiles/de/CV/sector_3_hit.png",
					"img/tiles/de/CV/sector_4_hit.png"
				],
				[
					"img/tiles/de/CV/sector_1_sunk.png",
					"img/tiles/de/CV/sector_2_sunk.png",
					"img/tiles/de/CV/sector_3_sunk.png",
					"img/tiles/de/CV/sector_4_sunk.png"
				]
			],
			[
				[
					"img/tiles/de/CA/sector_1_normal.png",
					"img/tiles/de/CA/sector_2_normal.png",
					"img/tiles/de/CA/sector_3_normal.png"
				],
				[
					"img/tiles/de/CA/sector_1_hit.png",
					"img/tiles/de/CA/sector_2_hit.png",
					"img/tiles/de/CA/sector_3_hit.png"
				],
				[
					"img/tiles/de/CA/sector_1_sunk.png",
					"img/tiles/de/CA/sector_2_sunk.png",
					"img/tiles/de/CA/sector_3_sunk.png"
				]
			],
			[
				[
					"img/tiles/de/DD/sector_1_normal.png",
					"img/tiles/de/DD/sector_2_normal.png"
				],
				[
					"img/tiles/de/DD/sector_1_hit.png",
					"img/tiles/de/DD/sector_2_hit.png"
				],
				[
					"img/tiles/de/DD/sector_1_sunk.png",
					"img/tiles/de/DD/sector_2_sunk.png"
				]

			],
			[]
		]
	]
};

var sfx_url = {
	"gun_fire": "sound/sfx/gunfire.ogg",
	"explosion": "sound/sfx/explosion.ogg",
	"plane_attack": "sound/sfx/plane.ogg",
	"plane_attack_enemy": "sound/sfx/plane-aa-gun.ogg",
	"plane_start_engine": "sound/sfx/plane-start-engine.ogg",
	"explosion_water": "sound/sfx/explosion-water.ogg",
	"explosion_distant": "sound/sfx/explosion-distant.ogg",
	"buzzer": "sound/sfx/buzzer-alarm.ogg"
};