var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var c = canvas.getContext('2d');//c = context

var mouse = {
	x: undefined,
	y: undefined
}

var maxRadius = 80;
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


function Circle(x,y,radius,dx,dy){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dx = dx;
	this.dy = dy;
	this.minRadius = this.radius;
	this.color = colorArray[Math.floor(Math.random() * 5) + 1];
	
	this.draw = function(){
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);//x,y,r,start angle,end angle, counter clokwise
		c.stroke();
		c.fillStyle = this.color;
		c.fill();
	}
	
	this.update = function(){
	if(this.x + this.radius > innerWidth || this.x - this.radius < 0){
		this.dx = -this.dx;
	}
	
	if(this.y + this.radius > innerHeight || this.y - this.radius < 0){
		this.dy = -this.dy;
	}
	
	this.x += this.dx;
	this.y += this.dy;
	
	
	//interactivity
	
	if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && 
		mouse.y - this.y < 50 && mouse.y - this.y > -50){
		if(this.radius < maxRadius){
			this.radius += 2;
		}
	}else if(this.radius > this.minRadius){
		this.radius -= 2;
	}
	
	this.draw();
	}
}


var circleArray = [];

function innit(){
	circleArray = [];
	
	for(var i = 0;i < 700;i++){
		var x = Math.random() * (innerWidth - radius * 2) + radius;
		var dx = (Math.random() - 0.5) * 10;
		var y = Math.random() * (innerHeight - radius * 2) + radius;
		var dy = (Math.random() - 0.5) * 10;
		var radius = Math.floor(Math.random() * 5) + 2;
	
		circleArray.push(new Circle(x,y,radius,dx,dy));
	
	}
}

function animate(){
	requestAnimationFrame(animate);
	c.clearRect(0,0,window.innerWidth,window.innerHeight);
	
	for(var j = 0;j < circleArray.length;j++){
		circleArray[j].update();
	}
	
}

innit();
animate();