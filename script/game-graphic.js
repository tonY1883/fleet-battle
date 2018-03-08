function showWaterSplash(grid) {
	var effectId;
	var canvas = grid.firstElementChild;
	var particles = [];
	for (var i = 0; i < 340; i++) {
		particles.push(new WaterParticle());
	}
	if (grid.classList.contains("ShipsTileHorizontal")) {
		effectId = setInterval(function () {
			WaterSplash(canvas, particles, true);
		}, 60);
	} else {
		effectId = setInterval(function () {
			WaterSplash(canvas, particles, false);
		}, 60);
	}
	return effectId;
}

function showHitEffect(grid) {
	grid.style.backgroundColor = '';
	//grid.style.backgroundImage = "url('" + img_url.ship_tiles[parseInt(grid.getAttribute("ship-class"))][1][parseInt(grid.getAttribute("sector"))] + "')";
	if (grid.hasAttribute("effectId")) {
		//stop all previous effects
		var effectId = parseInt(grid.getAttribute("effectId"));
		clearInterval(effectId);
	}
	//show explosion effect
	var canvas = grid.firstElementChild;
	var particles = [];
	for (var i = 0; i < 8; i++) {
		particles.push(new ExplosionParticle());
	}
	var eid = setInterval(function () {
		Explosion(canvas, particles, true);
	}, 40);
	setTimeout(function () {
		clearInterval(eid);
		if (!grid.hasAttribute("sunk")) {
			var hc = parseInt(grid.getAttribute("hit_count"));
			if (hc <= 1) {
				var canvas = grid.firstElementChild;
				var particles = [];
				var particle_count = 8;
				for (var i = 0; i < particle_count; i++) {
					particles.push(new SmokeParticle());
				}
				if (grid.classList.contains("ShipsTileHorizontal")) {
					var id = setInterval(function () {
						Smoke(canvas, particles, true);
					}, 40);
				} else {
					var id = setInterval(function () {
						Smoke(canvas, particles, false);
					}, 40);
				}
				grid.setAttribute("effectId", id);
			} else {
				//clear the old effect first
				var effectId = parseInt(grid.getAttribute("effectId"));
				clearInterval(effectId);
				var canvas = grid.firstElementChild;
				var fireParticles = [];
				var smokeParticles = [];
				for (var i = 0; i < 10; i++) {
					fireParticles.push(new FireParticle());
				}
				for (var i = 0; i < 5; i++) {
					smokeParticles.push(new SmokeParticle());
				}
				if (grid.classList.contains("ShipsTileHorizontal")) {
					var id = setInterval(function () {
						Fire(canvas, fireParticles, smokeParticles, true);
					}, 40);
				} else {
					var id = setInterval(function () {
						Fire(canvas, fireParticles, smokeParticles, false);
					}, 40);
				}
				grid.setAttribute("effectId", id);
			}

		}
	}, 1200);
}

//effects when a ship is hit
function Smoke(canvas, particleList, hBearing) {
	var ctx = canvas.getContext("2d");
	canvas.width = grid_size;
	canvas.height = grid_size;
	ctx.globalCompositeOperation = "source-over";
	if (hBearing == true) {
		//rotate the context
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(Math.PI / 2);
		ctx.translate(-canvas.width / 2, -canvas.height / 2);

	}
	ctx.clearRect(0, 0, grid_size, grid_size);
	for (var i = 0; i < particleList.length; i++) {
		var p = particleList[i];
		ctx.beginPath();
		p.opacity = Math.round(p.remaining_life / p.life * 100) / 100;
		var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
		gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
		gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
		ctx.fillStyle = gradient;
		ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
		ctx.fill();
		p.remaining_life--;
		p.location.x += p.speed.x;
		p.location.y += p.speed.y;
		if (p.remaining_life < 0) {
			particleList[i] = new SmokeParticle();
		}
	}
}

function Fire(canvas, particleListFire, particleListSmoke, hBearing) {
	var ctx = canvas.getContext("2d");
	canvas.width = grid_size;
	canvas.height = grid_size;
	ctx.globalCompositeOperation = "source-over";
	if (hBearing == true) {
		//rotate the context
		ctx.translate(canvas.width / 2, canvas.height / 2); //move to origin first so it rotate along the center
		ctx.rotate(Math.PI / 2);
		ctx.translate(-canvas.width / 2, -canvas.height / 2); //move it back
	}
	ctx.clearRect(0, 0, grid_size, grid_size);
	for (var i = 0; i < particleListFire.length; i++) {
		var p = particleListFire[i];
		ctx.beginPath();
		p.opacity = Math.round(p.remaining_life / p.life * 100) / 100
		var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
		gradient.addColorStop(0, "rgba(" + p.colorStop1.r + ", " + p.colorStop1.g + ", " + p.colorStop1.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.4, "rgba(" + p.colorStop2.r + ", " + p.colorStop2.g + ", " + p.colorStop2.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.6, "rgba(" + p.colorStop3.r + ", " + p.colorStop3.g + ", " + p.colorStop3.b + ", " + p.opacity + ")");
		gradient.addColorStop(1, "rgba(" + p.colorStop1.r + ", " + p.colorStop1.g + ", " + p.colorStop1.b + ", 0)");
		ctx.fillStyle = gradient;
		ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
		ctx.fill();
		p.remaining_life--;
		p.location.x += p.speed.x;
		p.location.y += p.speed.y;
		if (p.remaining_life < 0) {
			particleListFire[i] = new FireParticle();
		}
	}
	for (var i = 0; i < particleListSmoke.length; i++) {
		var p = particleListSmoke[i];
		ctx.beginPath();
		p.opacity = Math.round(p.remaining_life / p.life * 100) / 100;
		var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
		//TODO better effects by randomizing the colorstop size
		gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
		gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
		ctx.fillStyle = gradient;
		ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
		ctx.fill();
		p.remaining_life--;
		p.location.x += p.speed.x;
		p.location.y += p.speed.y;
		if (p.remaining_life < 0) {
			particleListSmoke[i] = new SmokeParticle();
		}
	}
}

function Explosion(canvas, particleListFire) {
	var ctx = canvas.getContext("2d");
	canvas.width = grid_size;
	canvas.height = grid_size;
	ctx.globalCompositeOperation = "lighter";
	ctx.clearRect(0, 0, grid_size, grid_size);
	for (var i = 0; i < particleListFire.length; i++) {
		var p = particleListFire[i];
		ctx.beginPath();
		p.opacity = Math.round(p.remaining_life / p.life * 100) / 100;
		var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
		gradient.addColorStop(0, "rgba(" + p.colorStop1.r + ", " + p.colorStop1.g + ", " + p.colorStop1.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.4, "rgba(" + p.colorStop2.r + ", " + p.colorStop2.g + ", " + p.colorStop2.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.6, "rgba(" + p.colorStop3.r + ", " + p.colorStop3.g + ", " + p.colorStop3.b + ", " + p.opacity + ")");
		gradient.addColorStop(0.8, "rgba(" + p.colorStop4.r + ", " + p.colorStop4.g + ", " + p.colorStop4.b + ", " + p.opacity + ")");
		gradient.addColorStop(1, "rgba(" + p.colorStop4.r + ", " + p.colorStop4.g + ", " + p.colorStop4.b + ", 0)");
		ctx.fillStyle = gradient;
		ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
		ctx.fill();
		p.remaining_life--;
		p.location.x += p.speed.x;
		p.location.y += p.speed.y;
	}
}

function WaterSplash(canvas, particleListWater, hBearing) {
	var ctx = canvas.getContext("2d");
	canvas.width = grid_size;
	canvas.height = grid_size;
	ctx.globalCompositeOperation = "source-over";
	if (hBearing == true) {
		//rotate the context
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(Math.PI / 2);
		ctx.translate(-canvas.width / 2, -canvas.height / 2);
	}
	ctx.clearRect(0, 0, grid_size, grid_size);
	for (var i = 0; i < particleListWater.length; i++) {
		var p = particleListWater[i];
		ctx.beginPath();
		ctx.fillStyle = "rgb(" + p.color.r + ", " + p.color.g + ", " + p.color.b + ")";
		ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
		ctx.fill();
		p.location.x += p.speed.x;
		p.location.y += p.speed.y;
		p.speed.y = p.speed.y - p.gravityPull;
	}
}

function SmokeParticle() {
	this.speed = {
		x: -0.5 + Math.random() * 1,
		y: -2 + Math.random() * 2
	};
	this.location = {
		x: grid_size / 2,
		y: grid_size / 2
	};
	this.radius = 9;
	this.life = 18 + Math.random() * 5;
	this.remaining_life = this.life;
	var cc = Math.round(60 + Math.random() * 40);
	this.r = cc;
	this.g = cc;
	this.b = cc;
}

function FireParticle() {
	this.speed = {
		x: -0.7 + Math.random() * 1,
		y: -0.5 + Math.random() * 0.5
	};
	this.location = {
		x: grid_size / 2,
		y: grid_size / 2
	};
	this.radius = 8;
	this.life = 8 + Math.random() * 3;
	this.remaining_life = this.life;
	this.colorStop1 = {
		r: 255,
		g: 255,
		b: 255
	};
	this.colorStop2 = {
		r: 255,
		g: 255,
		b: Math.round(200 + Math.random() * 30)
	};
	this.colorStop3 = {
		r: 255,
		g: 235,
		b: Math.round(90 + Math.random() * 30)
	};
}

function ExplosionParticle() {
	this.speed = {
		x: -0.5 + Math.random() * 1,
		y: -0.5 + Math.random() * 1
	};
	this.location = {
		x: grid_size / 2,
		y: grid_size / 2
	};
	this.radius = 8;
	this.life = 15 + Math.random() * 5;
	this.remaining_life = this.life;
	this.colorStop1 = {
		r: 255,
		g: 255,
		b: 255
	};
	this.colorStop2 = {
		r: 255,
		g: 255,
		b: Math.round(200 + Math.random() * 30)
	};
	this.colorStop3 = {
		r: 255,
		g: 235,
		b: Math.round(90 + Math.random() * 30)
	};
	this.colorStop4 = {
		r: 255,
		g: 204,
		b: Math.round(0 + Math.random() * 10)
	};
}

function WaterParticle() {
	this.speed = {
		x: (-0.25 + Math.random() * 0.5) / DEFAULT_GRID_SIZE * grid_size,
		y: (-2.5 + Math.random() * 3) / DEFAULT_GRID_SIZE * grid_size
	};
	this.gravityPull = -0.2;
	this.location = {
		x: grid_size / 2 - 1.5 + Math.random() * (3 / DEFAULT_GRID_SIZE * grid_size),
		y: grid_size - 1
	};
	this.radius = 1;
	this.color = {
		r: 160,
		g: 210,
		b: Math.round(200 + Math.random() * 30)
	};
}

function clearCanvas(canvas) {
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, grid_size, grid_size);
}