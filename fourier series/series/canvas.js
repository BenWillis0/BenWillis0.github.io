const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let waveStart = canvas.width * 0.6;
let waveWidth = canvas.width * 0.4;
let time = 0;
let delta = 0.03;
let wave = [];

let cols = 50;
let rows = 52;

//grid
// let gridX = i => {
//     c.moveTo(canvas.width*0.5 + ((time*(1/delta) + (i*((canvas.width*0.5) / 50)))%(canvas.width*0.5)),0);
//     c.lineTo(canvas.width*0.5 + ((time*(1/delta) + (i*((canvas.width*0.5) / 50)))%(canvas.width*0.5)),canvas.height);
//     c.strokeStyle = 'black';
//     c.stroke();
//     c.closePath();
// } 

// let gridY = i => {
//     c.beginPath();
//     c.moveTo(canvas.width*0.5,i * (canvas.height/rows));
//     c.lineTo(canvas.width,i * (canvas.height/rows));
//     c.strokeStyle = 'black';
//     c.stroke();
//     c.closePath();
// } 

let flag = true;



function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);

    
    // for(let i=0;i<50;i++){
    //     gridX(i);
    // }
    // for(let i=0;i<rows;i++){
    //     gridY(i);
    // }

    c.beginPath();
    c.globalAlpha = 0.5;
    c.rect((canvas.width/2)-2, canvas.height/2, canvas.width/2, 2);
    c.fillStyle = 'black';
    c.fill();
    c.globalAlpha = 1;
    c.closePath();
    
    //particle
    let x = (canvas.width * 0.3);
    let y = (canvas.height / 2);
    let numC = 20;
    let func;

    for(let i=0;i<numC;i++){
        let prevx = x;
        let prevy = y;
        let n = 2 * i + 1;
        //Square wave
        // let radius = (4 / n * Math.PI) * 10;
        // x += (radius * Math.cos(n * time));
        // y += (radius * Math.sin(n * time));

        //Saw tooth wave
        let radius = (2 * Math.pow(-1, i+1) / (i+1) * Math.PI) * 20;
        x += radius * Math.cos(n * time);
        y += radius * Math.sin((i+1) * time);
            
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

    
    wave.unshift([x,y]);//add particle to beginning
    
    for(let i = 1;i < wave.length-1;i++){
        //curve
        c.beginPath();
        c.strokeStyle = 'red';
        c.quadraticCurveTo((i-1)+(canvas.width * 0.6),wave[i][1],(i-1) + (canvas.width * 0.6), wave[i+1][1]);
            

        //drawing line
        c.moveTo(canvas.width * 0.6, y);
        c.lineTo(x, y);
        c.stroke();
        c.closePath();

        // c.beginPath();
        // c.fillStyle = 'green';
        // c.quadraticCurveTo(wave[i-1][0],wave[i-1][1],wave[i][0], wave[i][1]);
        // c.arc(wave[i][0],wave[i][1],3, Math.PI * 2, false);
        // c.fill();
        // c.closePath();
        
        
    //     if(1 - Math.cos(time) <= 0.01){
    //         flag = false;
    //     }
        
    //     c.beginPath();
    //     c.strokeStyle = 'green';
    //             // move to the first point
    //             if(flag){
    //             c.moveTo(wave[0][0], wave[0][1]);
    //     }

    //     for (j = 1; j < wave.length - 2; j ++){
    //         var xc = (wave[j-1][0] + wave[j][0]) / 2;
    //         var yc = (wave[j-1][1] + wave[j][1]) / 2;
    //         c.quadraticCurveTo(wave[j-1][0], wave[j-1][1], xc, yc);
    //     }
    //     // curve through the last two points
    
    //     c.quadraticCurveTo(wave[j-1][0], wave[j-1][1], wave[j][0],wave[j][1]);
    //    c.stroke();
    //    c.closePath();
    
}

    if (wave.length >= 750){
        wave.pop();
    }

    time += delta;
}


animate();