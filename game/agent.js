class Agent{
	constructor(x,y,r,vel,colour,face){
		this.x = x;
		this.y = y;
		this.r = r;
		this.vel = vel;
        this.colour = colour;
        this.face = face;
		this.exists = true; 
	}
	draw(){
        c.beginPath();
		c.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
		c.fillStyle = this.colour;
		c.fill();
		c.closePath()
        c.drawImage(this.face,this.x-this.r,this.y-this.r,this.r*2,this.r*2);
		
	}
}