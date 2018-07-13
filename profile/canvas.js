var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize',function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	init()
});

var mouse = {
	x: undefined,
	y: undefined
};

document.getElementById('canvas').addEventListener('mousemove',function(event){
	mouse.x = event.pageX;
	mouse.y = event.pageY - window.innerHeight;
});


function Ball(x,y,radius,speed){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.initialRadius = radius;
	this.maxRadius = 2.5 * this.radius;
	this.speed = speed;
	
	this.colour = "white";
	this.vec = {
		x:0,
		y:0
	}
	
	this.draw = function(){
		c.beginPath();
		c.ellipse(this.x, this.y, this.radius*10, this.radius, 0, 0, 2 * Math.PI);
		c.fillStyle = this.colour;
		c.fill();
	}
	this.update = function(){
		this.vec.x = (Math.round(Math.random()) * 2 - 1) * (Math.random() * canvas.width);
		this.vec.y = (Math.round(Math.random()) * 2 - 1) * (Math.random() * canvas.height);
			
		vec_len = ((this.vec.x)**2 + (this.vec.y)**2)**0.5;//use pythag to get hyp, gives proportion for x/y change
			
		this.vec.x = (this.vec.x / vec_len)* this.speed;
		this.vec.y = (this.vec.y / vec_len)* this.speed;
		
		if(this.x + this.vec.x > canvas.width || this.x + this.vec.x < 0){
			this.vec.x *= -1;
		}
		if(this.y + this.vec.y > canvas.height || this.y + this.vec.y < 0){
			this.vec.y *= -1;
		}
		var mouseArea = 100;
		
		if(mouse.y <= 40){
			this.radius = this.initialRadius;
		}else if(Math.abs(mouse.x - this.x) < mouseArea && Math.abs(mouse.y - this.y) < mouseArea && this.radius < this.maxRadius){
			this.radius++;
		}else if(this.radius > this.initialRadius){
			this.radius--;
		}
		
		this.x += this.vec.x;
		this.y += this.vec.y;
		this.draw();
	}
}
balls = [];
function init(){
	balls = [];
	for(var i = 0;i < 250;i++){
		var radius = 1;
		var x = Math.random() * (canvas.width - radius * 2) + radius;
		var y = Math.random() * (canvas.height - radius * 2) + radius;
		var speed = (Math.floor(Math.random() * (5- 3 + 1) + 3));
		balls.push(new Ball(x,y,radius,speed));
	}
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	for(var i = 0;i < balls.length;i++){
		balls[i].update();
	}
}

init();
animate();