canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let mouseDown = false;
let X = [];
let Y = [];

document.addEventListener('mousedown',e=>{
    mouseDown = true;
});

document.addEventListener('mousemove',ev=>{
    if(mouseDown){
        c.beginPath();
        c.arc(ev.x,ev.y,1.5,0,2*Math.PI,false);
        c.fill();
        c.closePath();
        X.push(ev.x);
        Y.push(ev.y);
    }
    
});

document.addEventListener('mouseup',e=>{
    mouseDown = false;
    run(X, Y);
});

