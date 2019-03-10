class Player extends Agent{
	constructor(x,y,r,vel,colour,face){
		super(x,y,r,vel,colour,face);
		this.speed = 5;
	}
	


	update(){
		

		if(keyDown.d){
			this.vel.x = this.speed;
		}
		if(keyDown.a){
			this.vel.x = -this.speed;
		}
		if(keyDown.w){
			this.vel.y = this.speed;
		}
		if(keyDown.s){
			this.vel.y = -this.speed;
		}
		if(keyDown.a == keyDown.d){
			this.vel.x = 0;
		}
		if(keyDown.w == keyDown.s){
			this.vel.y = 0;
		}

		if(this.x + this.r + this.vel.x >= canvas.width || this.x - this.r + this.vel.x <= 0){
			this.vel.x = 0;
		}
		if(this.y + this.r - this.vel.y >= canvas.height || this.y - this.r - this.vel.y <= 0){
			this.vel.y = 0;
        }
        
        for(let b of boxes){
            if(this.x + this.r >= b.x && this.x <= b.x + b.w && this.y >= b.y && this.y <= b.y + b.h){ //coming from left
				this.vel.x = -0.5;
			}
			if(this.x - this.r <= b.x + b.w && this.x >= b.x && this.y >= b.y && this.y <= b.y + b.h){ //coming from right
				this.vel.x = 0.5;
			}
			if(this.y + this.r >= b.y && this.y <= b.y + b.h && this.x >= b.x && this.x <= b.x + b.w){ //coming from top
				this.vel.y = 0.5;
			}
			if(this.y - this.r <= b.y + b.h && this.y >= b.y && this.x >= b.x && this.x <= b.x + b.w){ //coming from bottom
				this.vel.y = -0.5;
			}
        }
        
        for(let h of humans){
            let dist = getDistance(this.x,this.y,h.x,h.y);
            if(dist <= this.r + h.r){
                pushCollision(this, h, dist);
            }
        }

        for(let z of zombies){
            let dist = getDistance(this.x,this.y,z.x,z.y);
            if(dist <= this.r + z.r){
                endGame();
            }
        }

		
		if(this.vel.x != 0 && this.vel.y != 0){
			this.vel.x /= Math.sqrt(this.vel.x**2 + this.vel.y**2);
			this.vel.y /= Math.sqrt(this.vel.x**2 + this.vel.y**2);

			this.vel.x *= this.speed;
			this.vel.y *= this.speed;
		}
        
        

		this.x += this.vel.x;
        this.y -= this.vel.y;
        

		this.draw();
	}
	
}

