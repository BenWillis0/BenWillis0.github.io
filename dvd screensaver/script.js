let dvd = document.getElementById('dvd');

let colours = ['blue', 'orange', 'pink', 'purple', 'yellow'];

let Dvd = function(x,y,vel){
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.colour = 'blue';
    this.changeColour = function(){
        let index = colours.indexOf(this.colour);
        colours.splice(index,1); // stopsit picking the same colour twice
        let newColour = colours[Math.floor(Math.random()*colours.length)];
        dvd.style.backgroundImage = "url('dvd logos/"+newColour+".png')";
        colours.push(this.colour);
        return newColour;
    }
    this.colour = this.changeColour();

    this.update = function(){

        if (this.x <= 0 || this.x + dvd.offsetWidth >= window.innerWidth){
            this.vel.x = -this.vel.x;
            this.colour = this.changeColour();
        }

        if (this.y <= 0 || this.y + dvd.offsetHeight >= window.innerHeight){
            this.vel.y = -this.vel.y;
            this.colour = this.changeColour();
        }

        this.x += this.vel.x;
        this.y += this.vel.y;
        this.draw();
    }

    

    this.draw = () => {dvd.style.transform = 'translate('+this.x+'px,'+this.y+'px)';};
}

function init(){
    let x = Math.random() * (window.innerWidth - dvd.offsetWidth);
    let y = Math.random() * (window.innerHeight - dvd.offsetHeight);
    let speed = 1;
    let vel = {x: (Math.random() < 0.5 ? -1 : 1) * speed, y:(Math.random() < 0.5 ? -1 : 1) * speed}
    DVD = new Dvd(x,y,vel);
}


init();

setInterval(() => {
    DVD.update();
},1);