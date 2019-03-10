//Idea and partial help from coding train video
//https://youtu.be/7_vKzcgpfvU

const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

function run(X, Y){

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let time = 0;
let path = [];

const xOffset = 200;
const yOffset = 200;


let  XY = [];
for (let i = 0;i < X.length;i++){
    XY.push([X[i],Y[i]]);
}

compFourier = dft(XY);

compFourier.sort((a,b)=> b.amp - a.amp);
function epicycles(x,y,rotation,fourier){
    for(let i=1;i<fourier.length;i++){
        let prevx = x;
        let prevy = y;
        
        let freq = fourier[i].freq;
        let radius = fourier[i].amp;
        let phase = fourier[i].phase;

         
        x -= radius * Math.cos(freq * time + phase + rotation);
        y += radius * Math.sin(freq * time + phase + rotation);
        
        //draws circle
        c.beginPath();
        c.arc(prevx, prevy, Math.abs(radius), Math.PI * 2,false);
        c.strokeStyle = 'black';
        c.stroke();
        c.closePath();
        
        
        //joints
        c.beginPath();
        c.arc(x, y, 2, Math.PI * 2,false);
        c.fill();
        c.closePath();
    
        //line to center
        c.beginPath();
        c.moveTo(prevx, prevy);
        c.lineTo(x, y);
        c.strokeStyle = 'black';
        c.stroke();
        c.closePath();
        
        
    }
    let delta = (2*Math.PI) / fourier.length;
    // if(time > 2*Math.PI){
    //     time = 0; 
    //     path = [];
    // }
    time += delta;
    return {x,y};
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);

    let vec = epicycles(canvas.width/2 - yOffset,canvas.height/2 + xOffset,Math.PI,compFourier);

    path.unshift({x: vec.x, y: vec.y});
    //draws shape
    c.beginPath();
    
    for(let z = 0;z < path.length-1;z++){
        //works out average between x and y
        let ax = xOffset+(path[z].x + path[z+1].x) / 2;
        let ay = (path[z].y + path[z+1].y) / 2 - yOffset;
        
        c.quadraticCurveTo(path[z].x+xOffset,path[z].y-yOffset,ax,ay);
        c.quadraticCurveTo(ax,ay,path[z+1].x+xOffset,path[z+1].y-yOffset);
    }
    
    c.stroke();
    c.closePath();

    //draws line to shape
    c.beginPath(); 
    c.strokeStyle = 'red';
    c.moveTo(vec.x, vec.y);
    c.lineTo(vec.x+xOffset,vec.y-yOffset);
    c.stroke();
    c.closePath();
     
    
    
}
animate();
}
