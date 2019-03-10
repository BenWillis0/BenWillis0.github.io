
class Zombie extends NonPlayer{
	constructor(x,y,r,vel,colour,face){
        super(x,y,r,vel,colour,face);
		this.following = false;
		this.mass = 1;
		this.speed = Math.sqrt(this.vel.x**2 + this.vel.y**2); 
	}
	
	update(){

		this.randomDir();
		
		this.collisionTest(zombies);

		for(let i = 0; i < humans.length;i++){
			let dist = getDistance(this.x,this.y,humans[i].x,humans[i].y);
			if(dist <= humans[i].r + this.r){ // if they are touching 
                this.humanToZombie(humans[i],i);
                humansToZombies++;
			}

		}

        //////////////////FOLLOW HUMANS///////////////////////////
        let minDist = 99999999;
        for(let h of humans){
            let dist = getDistance(this.x,this.y,h.x,h.y);
            if(dist < minDist){
                minDist = dist;
                if(dist <= 250){
                    this.vel.x = h.x - this.x;//get distance between player and zombie
                    this.vel.y = h.y - this.y;

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
                    
                    let vel_len = Math.sqrt((this.vel.x)**2 + (this.vel.y)**2);//use pythag to get hyp, gives proportion for x/y change
                    
                    this.vel.x = (this.vel.x / vel_len)* this.speed;
                    this.vel.y = (this.vel.y / vel_len)* this.speed;
                    
                    this.following = true;
                }else{
                    if(this.following){//changes direction after following player
                        this.vel.x = randVelVal();
                        this.vel.y = randVelVal();
                    }
                    this.following = false;
                }
            }
        }
		
        this.collisionWithWalls();
        
        this.boxCollision();
		
		
		this.stopStickingInWalls();
		
		
		
		this.draw();
	}

	
}