let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');
canvas.width = 4000;
canvas.height = 2000;
let frame;

let zombieFace = document.getElementById('zombieFace');
let humanFace = document.getElementById('humanFace');
let playerFace = document.getElementById('playerFace');
let box = document.getElementById('box');
zombieFace.width = 0;
zombieFace.height = 0;
humanFace.width = 0;
humanFace.height = 0;
playerFace.width = 0;
playerFace.height = 0;
box.width = 0;
box.height = 0;

let noHumans = 70;
let noZombies = 3;

let boxes = [];
let zombies = [];
let humans = [];
let bullets = [];
let agents = [];

let humansKilled = 0;
let zombiesKilled = 0;
let humansToZombies = 0;

let gameOver = false;

let keyDown = {
	a: false,
	d: false,
	w: false,
	s: false,
	space: false
};

let mouse = {
	x: undefined,
	y: undefined
};

window.onkeydown = function(event){
	if(event.key == 'a'){
		keyDown.a = true;
	}
	if(event.key == 'd'){
		keyDown.d = true;
	}
	if(event.key == 'w'){
		keyDown.w = true;
	}
	if(event.key == 's'){
		keyDown.s = true;
	}
	if(event.key == ' '){
		keyDown.space = true;
		event.preventDefault();//stops from scrolling
	}
};

window.onkeyup = function(event){
	if(event.key == 'a'){
		keyDown.a = false;
	}
	if(event.key == 'd'){
		keyDown.d = false;
	}
	if(event.key == 'w'){
		keyDown.w = false;
	}
	if(event.key == 's'){
		keyDown.s = false;
	}
	if(event.key == ' '){
		keyDown.space = false;
		bullets.push(new Gun());
	}
};

window.addEventListener('mousemove',function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

function getDistance(x1,y1,x2,y2){
	return ((x2 - x1)**2 + (y2 - y1)**2)**0.5;
}

function collision(z1,z2){
	let m1 = z1.mass;
	let m2 = z2.mass;
	
	let u1x = z1.vel.x;
	let u1y = z1.vel.y;

	let u2x = z2.vel.x;
	let u2y = z2.vel.y;

	let v1x = (u1x * (m1-m2) + 2  * m2 * u2x) / (m1 + m2);
	let v1y = (u1y * (m1-m2) + 2  * m2 * u2y) / (m1 + m2);

	let v2x = (u2x * (m2-m1) + 2  * m1 * u1x) / (m1 + m2);
	let v2y = (u2y * (m2-m1) + 2  * m1 * u1y) / (m1 + m2);

	let newVel1 = {x: v1x, y: v1y};
	let newVel2 = {x: v2x, y: v2y};

	return {newVel1, newVel2};

}

function pushCollision(p1,p2, dist){
	let xDist = p1.x - p2.x;				
	let yDist = p1.y - p2.y;
	let distVec = {x: xDist, y: yDist};

	distVec.x /= dist / (p1.r + p2.r - dist);
	distVec.y /= dist / (p1.r + p2.r - dist);

	p1.x += distVec.x / 2;
	p1.y += distVec.y / 2;

	p2.x -= distVec.x / 2;
	p2.y -= distVec.y / 2;
}

function randVelVal(){
	return (Math.round(Math.random()) * 2 - 1) * (Math.random() + 0.5);
}

function createMap(){
	for(let row = 0; row < map.length; row++){
		for(let i = 0; i < map[row].length; i++){
			if(map[row][i] == 'B'){
				let w = canvas.width / map[0].length;
				let h = canvas.height / map.length;
				let x = i * w;
				let y = row * h;
				boxes.push(new Box(x,y,w,h,box));
			}
		}
	}
}

function inWall(x,y){
	for(let b of boxes){
		if(x >= b.x && x <= b.x + b.w || y >= b.y && y <= b.y + b.h){
			return true;
		}
	}
}

function endGame(wl){
	zombies.map(a=>a.exists = false);
	humans.map(a=>a.exists = false);
	bullets.map(a=>a.exists = false);
	boxes.map(a=>a.exists = false);
	player.exists = false;
	document.body.style.background = 'none';
	if(wl === 'win'){document.getElementById('end1').textContent = "You Win!";}else{document.getElementById('end1').textContent = 'You Lose!';}
	document.getElementById('end2').textContent = 'You killed ' + humansKilled + ' humans';
	document.getElementById('end3').textContent = 'You killed ' + zombiesKilled + ' zombies';
	document.getElementById('end4').textContent = humansToZombies + ' humans became zombies';
	scrollTo(0,0);
	gameOver = true;
}

function updateOffset(){
	if(player.exists){
		window.scrollTo(player.x - window.innerWidth/2,player.y - window.innerHeight/2);
	}
}


function init(){

	createMap();
	
	zombies = [];
	let radius = 25;
	for(let i = 0;i < noZombies;i++){
	let x = canvas.width * 0.8 + Math.random() * (canvas.width*0.2 - radius);
	let y = Math.random() * (canvas.height*0.2 - radius*2) + radius;
	for(let z of zombies){
		while(Math.sqrt((z.x - x)**2 + (z.y - y)**2) <= z.r + radius){
			x = canvas.width * 0.8 + Math.random() * (canvas.width*0.2 - radius);
			y = Math.random() * (canvas.height*0.2 - radius*2) + radius;
		}
	}
	let dx = randVelVal();//random number between 0.5 and 1.5 or negative version
	let dy = randVelVal();
	let vel = {x: dx, y: dy};
	let colour = 'green';
	zombies.push(new Zombie(x,y,radius,vel,colour,zombieFace));
	}
	for(let i of zombies){
		agents.push(i);
	}

	radius = 20;
	let colour = 'FireBrick';
	player = new Player(canvas.width*0.2, canvas.height*0.8, radius, {x: 0, y: 0}, colour,playerFace);

	bullets.push(new Gun());
	gun = bullets[0];


	let r = 25;
	for(let i = 0;i < noHumans;i++){
		let x = Math.random() * (canvas.width - r*2) + r;
		let y = Math.random() * (canvas.height - r*2) + r;
		for(let a of agents){
			while(Math.sqrt((a.x - x)**2 + (a.y - y)**2) <= a.r + r || inWall(x,y)){
				x = Math.random() * (canvas.width - r*2) + r;
				y = Math.random() * (canvas.height - r*2) + r;
			}
		}
		
		let dx = randVelVal();//random number between 0.5 and 1.5 or negative version
		let dy = randVelVal();
		let vel = {x: dx, y: dy};
		let colour = 'black';
		let newHuman = new Human(x,y,r,vel,colour,humanFace);
		humans.push(newHuman);
		agents.push(newHuman);
	}
	
	
	
}

function animate(){
	frame = requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);

	if(bullets.length === 0){
		bullets.push(new Gun());
	}
	
	for(let z of zombies){
		if(z.exists){
			z.update();
		}
	}
	if(player.exists){
		player.update();
	}

	for(let b of bullets){
		if(b.exists){
			b.update();
		}
	}

	for(let h of humans){
		if(h.exists){
			h.update();
		}
	}

	for(let b of boxes){
		if(b.exists){
			b.draw();
		}
	}

	if(humans.length === 0 && gameOver == false){
		endGame('loss');
	}
	if(zombies.length === 0 && gameOver == false){
		endGame('win');
	}

	updateOffset();
	
}

init();
animate();
