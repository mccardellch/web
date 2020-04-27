"use strict";

const canvasWidth = 800;
const canvasHeight = 600;
let ctx;
let fps = 30;

let sliderValue = 2;
let boatColor = 'yellow';
let fireworkShape = 'circle';

//using enums to run through the loops
const mode = {
    SHOOT: 'shoot',
    CLEAR: 'clear'
};
   
let state = mode.CLEAR; //start on clear
     
//event listener
window.onload = init;


function init(){
    ctx = canvas.getContext("2d");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
    
    document.querySelector('#shoot').onclick = function(){
        state = mode.SHOOT;
        hhmLIB.resetValues();
    }
    
    document.querySelector('#boatColorChooser').onchange = function(e){
        boatColor = e.target.value;  
    };
    
    document.querySelector('#fireworkShapeChooser').onclick = function(e){
        fireworkShape = e.target.value;
    }
    
    mainloop();
}
   
function mainloop(){
    sliderValue = document.querySelector('#sizeSlider').value;
    setTimeout(mainloop, 1000/fps);
    if(spaceActive == true){
        state = mode.SHOOT;
        hhmLIB.resetValues();
     }
    
    //Draws Visual State
    switch (state) {
        case mode.SHOOT:
            player.shootFirework(x_Firework, y_Firework, 'red');
            break; 
        case mode.CLEAR:    
            break;                 
    }
    drawPlayer();
}

    
