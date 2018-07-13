var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');//c = context

function RandomIntFromRange(min, max){
	return Math.floor(Math.random() * (max - min + 1) + min);
}

var mouse = {
	x: undefined,
	y: undefined
}

var maxRadius = 50;
var minRadius = 5;

var colorArray = [
	'#2C3E50',
	'#E74C3C',
	'#ECF0F1',
	'#3498DB',
	'#2980B9'
];

window.addEventListener('mousemove',function(event){
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener('resize',function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	innit();
});


function Particle(x,y,radius){
	this.x = window.innerWidth / 2;
	this.y = window.innerHeight / 2;
	this.radius = radius;
	this.color = colorArray[Math.floor(Math.random() * 5) + 1];
	this.radians = Math.random() * Math.PI * 2;
	this.velocity = 0.05;
	this.distanceFromCenter = RandomIntFromRange(80,170);
	this.lastMouse = {
		x: x,
		y: y
	}
	
	this.draw = function(lastPoint){
		c.beginPath();
		c.strokeStyle = this.color;
		c.lineWidth = this.radius;
		c.moveTo(lastPoint.x,lastPoint.y);
		c.lineTo(this.x,this.y);
		c.stroke();
		c.closePath();
	}
	
	this.update = function(){
	const lastPoint = {x: this.x, y: this.y};
	
	//Drag effect
	this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
	this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
	
	//Move points over time
	this.radians += this.velocity;
	
	//circular motion
	this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
	this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
	
	
	this.draw(lastPoint);
	}
}


var particleArray = [];

function innit(){
	particleArray = [];
	
	for(var i = 0;i < 52;i++){
		var x = window.innerWidth / 2;
		var y = window.innerHeight / 2;
		var radius = Math.floor(Math.random() * 5) + 2;
	
		particleArray.push(new Particle(x,y,radius));
	
	}
	console.log(particleArray);
}

function animate(){
	requestAnimationFrame(animate);
	c.fillStyle = 'rgba(255,255,255,0.05)';
	c.fillRect(0,0,window.innerWidth,window.innerHeight);
	
	for(var j = 0;j < particleArray.length;j++){
		particleArray[j].update();
	}
	
}

innit();
innit();
animate();