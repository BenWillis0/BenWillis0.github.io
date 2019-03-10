
class Human extends NonPlayer{
	constructor(x,y,r,vel,colour, face){
        super(x,y,r,vel,colour,face);
		this.following = false;
		this.mass = 1;
		this.speed = Math.sqrt(this.vel.x**2 + this.vel.y**2); 
	}

	update(){

		this.randomDir();
		
		this.collisionTest(humans);
		
		this.collisionWithWalls();
		
		this.stopStickingInWalls();
		
		this.boxCollision();
		
		this.draw();
	}
	
}