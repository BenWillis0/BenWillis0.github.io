var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');//c = context

var friction = 0.95;
var speedUp = 1.1;

var ballNum = 1;

var pScore = 0;
var aScore = 0;

var keyDown = {
	w: false,
	s:false
}


document.addEventListener('keydown',function(event){
	if(event.key == 'w'){
		keyDown.w = true;
	}else if(event.key == 's'){
		keyDown.s = true;
	}
});

document.addEventListener('keyup',function(event){
	if(event.key == 'w'){
		keyDown.w = false;
	}else if(event.key == 's'){
		keyDown.s = false;
	}
});

function Ball(x,y,radius,dx,dy){
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.dx = dx;
	this.dy = dy;
	this.color = "#fff";
	
	this.draw = function(){
		c.beginPath();
		c.arc(this.x,this.y,this.radius,0,Math.PI * 2,false);//x,y,r,start angle,end angle, counter clokwise
		c.stroke();
		c.fillStyle = this.color;
		c.fill();
	}
	var delay = true;
	
	this.update = function(){
	if(delay){
		reset();
		delay = false;
	}
	
	if(this.x + this.radius + this.dx > innerWidth){//Hits right
		pScore += 1;
		if(pScore < 10){
			reset();
		}else{end();}
	}
	
	if(this.x - this.radius + this.dx < 0){
		aScore += 1;
		if(aScore < 10){
			reset();
		}else{end();}
	}
	
	if(this.y + this.radius + this.dy > innerHeight || this.y - this.radius + this.dy < 0){
		this.dy = -this.dy * friction;
		this.dx *= friction;
	}
	
	if(this.x - this.radius + this.dx < player.x + player.w){
		if(this.y + this.radius + this.dy >= player.y && this.y - this.radius - this.dy <= player.y + (player.h)){
			this.dx = -this.dx * speedUp;
		}
	}
	
	if(this.x + this.radius  + this.dx > ai.x - ai.w){
		if(this.y - this.radius - this.dy <= ai.y + (ai.h/2) && this.y + this.radius + this.dy >= ai.y ){
			this.dx = -this.dx * speedUp;
		}
	}
	
	this.x += this.dx;
	this.y += this.dy;
	
	this.draw();
	}
}

function Player(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.speed = 10;
	this.color = 'white';
	
	this.draw = function(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.w,this.h); 
	}
	
	this.update = function(){
		console.log(keyDown);
		if(keyDown.w && this.y > 0){
			this.y -= this.speed;
		}
		if(keyDown.s && this.y + this.h < canvas.height){
			this.y += this.speed;
		}
		
		
		this.draw();
		keyDown.keyD = undefined;
	}
	
}

function Ai(x,y,w,h){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.speed = 10;
	this.color = 'red';
	
	this.draw = function(){
		c.fillStyle = this.color;
		c.fillRect(this.x,this.y,this.w,this.h); 
	}
	
	this.update = function(){
		for(var i = 0;i < circleArray.length;i++){
		if(this.y > circleArray[i].y && this.y > 0){
				this.y -= this.speed;
		}else if(this.y < circleArray[i].y && this.y + this.h < canvas.height){
			this.y += this.speed;
		}
		}
		this.draw();
	}
	
}

function reset(){
for(var i = 0;i < circleArray.length;i++){
	circleArray[i].x = canvas.width/2;
	circleArray[i].y = canvas.height/2;
	circleArray[i].dx = 0;
	circleArray[i].dy = 0;
}
	setTimeout(function(){
	for(var i = 0;i < circleArray.length;i++){
		circleArray[i].dx = (Math.round(Math.random()) * 2 - 1)*(Math.random()*5+7);
		circleArray[i].dy = (Math.round(Math.random()) * 2 - 1)*(Math.random()*5+7);
		}
	}, 2500);
	
}

var circleArray = [];

function innit(){

	circleArray = [];

	for(var i = 0;i < ballNum;i++){
	var x = canvas.width/2;
	var y = canvas.height/2;
	var dx = (Math.round(Math.random()) * 2 - 1)*(Math.random()*5+7);
	var	dy = (Math.round(Math.random()) * 2 - 1)*(Math.random()*5+7);
	var radius = 10;
		
	circleArray.push(new Ball(x,y,radius,dx,dy));
	}
	
	var w = 20;
	var h = 70; 
	var x = 100;
	var y = (canvas.height/2)-(h/2);
	
	player = new Player(x,y,w,h);
	
	x = canvas.width - x;
	
	ai = new Ai(x,y,w,h);
}



function animate(){
	if(pScore < 9 || aScore < 9){
		requestAnimationFrame(animate);
	}
	c.clearRect(0,0,window.innerWidth,window.innerHeight);
	c.fillStyle = '#000';
	c.fillRect(0,0,canvas.width,canvas.height);
	
	for(var j = 0;j < circleArray.length;j++){
		circleArray[j].update();
	}
	player.update();
	ai.update();
	c.font = '20px Arial';
	c.fillStyle = 'white';
	c.fillText('SCORE: ' + pScore,50,50);
	c.fillText('SCORE: ' + aScore,canvas.width - 150,50);
	
}

function end(){
	requestAnimationFrame(end);
	c.clearRect(0,0,window.innerWidth,window.innerHeight);
	c.fillStyle = '#000';
	c.fillRect(0,0,canvas.width,canvas.height);
	document.getElementById('winner').style.margin = canvas.height/2;
	if(pScore >= 10){
		document.getElementById('winner').innerHTML = 'Player won!';
		pScore = 10;
	}
	if(aScore >= 10){
		document.getElementById('winner').innerHTML = 'Computer won!';
		aScore = 10;
	}
	
}

innit();
animate();