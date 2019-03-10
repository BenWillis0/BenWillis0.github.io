class Gun{
    constructor(){
        this.r = 5;
        this.fired = false;
        this.speed = 10;
        this.vel = {x: 0, y: 0}
        this.lastPos = {};
        this.lives = 3;
    }
	draw(){
		c.beginPath();
		c.fillStyle = 'black';
		c.arc(this.x,this.y,this.r,0,2*Math.PI,false);
		c.fill()
		c.closePath();
	}

	update(){
		if(this.fired === false){
			this.x = player.x;
			this.y = player.y;
			this.lastPos = {x: this.x, y: this.y};
		}else{
			this.x = this.lastPos.x;
			this.y = this.lastPos.y;
			this.lastPos.x += this.vel.x;
			this.lastPos.y += this.vel.y;
		}
		
		if(keyDown.space === true && this.fired === false){
			let xChange = mouse.x - this.x + window.pageXOffset;
			let yChange = mouse.y - this.y + window.pageYOffset;

			let len = Math.sqrt(xChange**2 + yChange**2);

			this.vel.x = (xChange*this.speed) / len;
			this.vel.y = (yChange*this.speed) / len;
			this.fired = true;
		}

		for(let i = zombies.length-1;i >= 0;i--){//backwards to stop elements being skipped if one is removed
			let dist = getDistance(zombies[i].x,zombies[i].y,this.x,this.y);
			if(dist - (this.r + zombies[i].r) < 0 && this.fired === true){
                zombies.splice(i,1);
                zombiesKilled++;
                this.lives -= 1;
			}
		}
		for(let i = humans.length-1;i >= 0;i--){//backwards to stop elements being skipped if one is removed
			let dist = getDistance(humans[i].x,humans[i].y,this.x,this.y);
			if(dist - (this.r + humans[i].r) < 0 && this.fired === true){
                humans.splice(i,1);
                humansKilled++;
                this.lives -= 1;
			}
		}
        
        for(let b of boxes){
			if(this.lastPos.x + this.r + this.vel.x >= b.x && this.lastPos.x <= b.x + b.w && this.lastPos.y >= b.y && this.lastPos.y <= b.y + b.h){ //coming from left
                this.vel.x = -this.vel.x;
                this.lives -= 1;
			}
			if(this.lastPos.x - this.r + this.vel.x <= b.x + b.w && this.lastPos.x >= b.x && this.lastPos.y >= b.y && this.lastPos.y <= b.y + b.h){ //coming from right
				this.vel.x = -this.vel.x;
                this.lives -= 1;
			}
			if(this.lastPos.y + this.r + this.vel.y >= b.y && this.lastPos.y <= b.y + b.h && this.lastPos.x >= b.x && this.lastPos.x <= b.x + b.w){ //coming from top
				this.vel.y = -this.vel.y;
                this.lives -= 1;
			}
			if(this.lastPos.y - this.r + this.vel.y <= b.y + b.h && this.lastPos.y >= b.y && this.lastPos.x >= b.x && this.lastPos.x <= b.x + b.w){ //coming from bottom
				this.vel.y = -this.vel.y;
                this.lives -= 1;
			}
        }
        
        if(this.lives <= 0){
            for(let i = 0;i < bullets.length; i++){
                if(this === bullets[i] || this.lastPos.x >= canvas.width || this.lastPos.x <= 0 || this.lastPos.y <= canvas.height || this.lastPos.y <= 0){
                    bullets.splice(i,1);
                }
            }
        }

		this.draw();
	}
}

