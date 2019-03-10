class NonPlayer extends Agent{
	constructor(x,y,r,vel,colour,face){
		super(x,y,r,vel,colour,face);
	}
	
	randomDir(){
		if(Math.random() < 0.01){
			this.vel = {
				x: randVelVal(),
				y: randVelVal()
			}
		}
	}

	humanToZombie(h,i){
		humans.splice(i,1);
		zombies.unshift(new Zombie(h.x - 2*h.vel.x, h.y - 2*h.vel.y, h.r, {x: h.vel.x,y: h.vel.y}, 'green', zombieFace));
	}

	collisionTest(group){
		for(let i = 0;i < group.length;i++){
			if(this !== group[i]){  // stops from testing against itself
				let dist = getDistance(this.x,this.y,group[i].x,group[i].y);
				if(dist <= group[i].r + this.r){ // if they are touching 
					 if(this.following === false){
						let newVel = collision(this,group[i]);
						this.vel = newVel.newVel1;
						group[i].vel = newVel.newVel2;
					}else{
						pushCollision(this, group[i], dist);
					}
				}
			
				
			}
		}
		
	}

	collisionWithWalls(){
		if(this.x + this.r + this.vel.x >= canvas.width || this.x - this.r + this.vel.x <= 0){//collision detection
			this.vel.x = -this.vel.x;
		}else if(this.y + this.r + this.vel.y >= canvas.height || this.y - this.r + this.vel.y <= 0){
			this.vel.y = -this.vel.y;
		}else{// if no collision, move normally
			this.x += this.vel.x;
			this.y += this.vel.y;
		}
	}

	stopStickingInWalls(){
		if(this.x + this.r + this.vel.x >= canvas.width){
			this.x = canvas.width - this.r;
		}else if(this.x - this.r + this.vel.x <= 0){
			this.x = this.r;
		}

		if(this.y + this.r + this.vel.y >= canvas.height){
			this.y = canvas.height - this.r;
		}else if(this.y - this.r + this.vel.y <= 0){
			this.y = this.r;
		}
	}

	boxCollision(){
		for(let b of boxes){
			if(this.x + this.r >= b.x && this.x <= b.x + b.w && this.y >= b.y && this.y <= b.y + b.h){ //coming from left
				this.vel.x = -this.vel.x - 0.5;
			}
			if(this.x - this.r <= b.x + b.w && this.x >= b.x && this.y >= b.y && this.y <= b.y + b.h){ //coming from right
				this.vel.x = -this.vel.x + 0.5;
			}
			if(this.y + this.r >= b.y && this.y <= b.y + b.h && this.x >= b.x && this.x <= b.x + b.w){ //coming from top
				this.vel.y = -this.vel.y - 0.5;
			}
			if(this.y - this.r <= b.y + b.h && this.y >= b.y && this.x >= b.x && this.x <= b.x + b.w){ //coming from bottom
				this.vel.y = -this.vel.y + 0.5;
			}
		}
	}

}