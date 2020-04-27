// .js file for the player and methods related
"use strict";

let n = 0;
let divergence = 137.5;
let c = 4;
let a, r, x, y;
let y_Firework = 550;
let x_Firework = 0

//player's x-value
let movement = 100;
     
//player class
let player = {
	y:500,
	width: 20,
	height: 10,
    move(){
	   if (keyA == true){
            movement -= 5;
        }
        if(keyD == true){
            movement += 5;
        }
	},
    shootFirework(x=x_Firework,y=y_Firework, color='red'){
        let color1 = color;
        if (y < 125){
            this.fireworkLoop(true, x_Firework);
            y_Firework = 0;
        }else{    
            ctx.save();
            ctx.fillStyle='black';
            ctx.globalAlpha = 10/fps;
            ctx.fillRect(0,0,canvasWidth, canvasHeight);
            ctx.restore();
            
            y_Firework -= 5;
            hhmLIB.drawCircle(ctx,x,y,2,color1);
        }
    },
    fireworkLoop(run,xPos){
        if (run){
            if (n <= 100){
                ctx.save();
                ctx.fillStyle='black';
                ctx.globalAlpha = 5/fps;
                ctx.fillRect(0,0,canvasWidth, this.y);
                ctx.restore();
                
                if(fireworkShape == 'circle'){
                    let a = n * hhmLIB.dtr(divergence);
                    let r = c * Math.sqrt(n);
                    let x = r * Math.cos(a) + xPos;
                    let y = r * Math.sin(a) + 100;

                    hhmLIB.drawCircle(ctx,x,y,sliderValue, hhmLIB.getRandomColor());
                }else if(fireworkShape == 'spiral'){
                    let a = n * 2 * hhmLIB.dtr(divergence);
                    let r = c * Math.sqrt(n * 2);
                    let x = r * Math.cos(a) + xPos;
                    let y = r * Math.sin(a) + 100;

                    hhmLIB.drawCircle(ctx,x,y,sliderValue, hhmLIB.getRandomColor());
                }else if(fireworkShape == 'oval'){
                    let a = n * 2 * hhmLIB.dtr(divergence);
                    let r = c * Math.sqrt(n);
                    let x = r * Math.cos(a + 100) + xPos;
                    let y = r * Math.sin(a) + 100;

                    hhmLIB.drawCircle(ctx,x,y,sliderValue, hhmLIB.getRandomColor());
                }
                
                n++;
            }else{
                ctx.save();
                ctx.fillStyle='black';
                ctx.fillRect(0,0,canvasWidth, this.y);
                ctx.restore();
                state = mode.CLEAR;
                hhmLIB.resetValues();
            }
        }
    }
};

 //make a separate canvas for the 'ship'
 function drawPlayer(){
     ctx.clearRect(0,player.y,canvasWidth, canvasHeight);
     ctx.save();
     ctx.fillStyle = 'blue';
     ctx.fillRect(0,player.y+9,canvas.width, canvas.height);   
     ctx.restore();
     ctx.save();
     ctx.fillStyle = boatColor;   
     ctx.fillRect(movement, player.y, player.width, player.height);
     ctx.restore();

     
     player.move(); 
 }

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

//keys set to false (aka not pressed)
let keyA = false;
let keyD = false;
let spaceActive = false;

//key press event
function onKeyDown(event) {
    let keyCode = event.keyCode;
    switch (keyCode) {
        case 68: //d - right
            keyD = true;
            break;
        case 65: //a - left
            keyA = true;
            break;
        case 32:
            spaceActive = true;
            break;
    }
}

//key release event
function onKeyUp(event) {
    let keyCode = event.keyCode;        
    switch (keyCode) {
        case 68: //d - right
            keyD = false;
            break;
        case 65: //a - left
            keyA = false;
            break;
        case 32: //spacebar - shoot firework
            spaceActive = false;
            break;
    }
}