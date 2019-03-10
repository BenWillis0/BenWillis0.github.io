class Box{
    constructor(x,y,w,h,img){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.img = img;
    }

    draw(){
        c.drawImage(this.img,this.x,this.y,this.w,this.h);
        // c.beginPath();
        // c.fillStyle = 'red';
        // c.fillRect(this.x,this.y,this.w,this.h);
        // c.closePath();
    }
}