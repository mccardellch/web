/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
*/

import * as utils from './utils.js';
import * as audio from './audio.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, boomboxColor;

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	
    // create a gradient that runs top to bottom //startX, startY, endX, endY
	gradient = utils.getLinearGradient(ctx,0,0,canvasWidth,0,[{percent:0,color:"#000428"},{percent:1,color:`#004e92`}]);
	
    // keep a reference to the analyser node
	analyserNode = analyserNodeRef;
    
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);
}

//most important function
//draws everything to the canvas
/* 
 - option to:
    - show Gradient,
    - show Bars,
    - show Circles,
    - show Noise,
    - show Invert,
    - show Emboss
*/

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);

	// draw background
	ctx.save();
    ctx.fillStyle = 'white';
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();

    //draw text on the canvas
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.font = '50px serif';
    ctx.fillText('Audio Visualizer', canvasWidth/2 - 150, 100)
    ctx.restore();
    
    /* PROJECT 2 START-------------------*/
    if(params.showP2){       
        let numBars = audioData.length;
        let barSpacing = 10;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (numBars * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / numBars;
        let barHeight = 100;
        let topSpacing = 600;
        
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,0.50)`;
        ctx.strokeStyle = `rgba(0,0,0,0.50)`;
        
        
        let barGradient = ctx.createLinearGradient(0, 0, canvasWidth, 0); //x0 y0 x1 y1
        barGradient.addColorStop(0, 'red');
        barGradient.addColorStop(.2, 'orange');
//        barGradient.addColorStop(.4, 'yellow');
        barGradient.addColorStop(.6, 'green');
        barGradient.addColorStop(.8, 'blue');
//        barGradient.addColorStop(1, 'violet');
        
        
        //loop through the data and draw!
        for (let i=0; i < audioData.length; i++){
            if(audioData[i] != 0){
                ctx.save();
                ctx.fillStyle = 'red';
                ctx.fillRect(30, margin + audioData[i], audioData[i] * (i * .01), 1);
//                ctx.fillRect(30, margin + audioData[i], barWidth, 1);
                ctx.restore();

                ctx.save();
                //ctx.fillStyle = utils.getRandomColor();
                ctx.fillStyle = barGradient;
                ctx.strokeStyle = barGradient;
//                ctx.fillRect(margin + i * (barWidth + barSpacing), 200 + 256 - audioData[i], barWidth, barHeight);
                ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
                ctx.restore();
            }
        }
        ctx.restore();
        
        

    }
    
	// 3 - draw gradient
	if(params.showGradient){
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
    
	// 4 - draw bars
	if(params.showBars){
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (64 * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / 64;
        let barHeight = 200;
        let topSpacing = 600;
        
        ctx.save();
        ctx.fillStyle = `rgba(255,255,255,0.50)`;
        ctx.strokeStyle = `rgba(0,0,0,0.50)`;
        
        //loop through the data and draw!
        for (let i=0; i < 64; i++){
            ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
        }
        ctx.restore();
    }
    
	// 5 - draw circles
    if(params.showCircles){
        let maxRadius = canvasHeight / 4;
        for (let i = 10; i < 40; i++){
            if (audioData[i] != 0){
                let percent = audioData[i] / 255;
                let circleRadius = percent * maxRadius;

                //yellow ish circles, smaller
                ctx.save();
                ctx.beginPath();
                ctx.fillStyle = utils.makeColor(200,200,0, 0.5 - percent/5.0);
                ctx.strokeStyle = utils.makeColor(200,200,0, 0.5 - percent/5.0);
                ctx.lineWidth = 2;
                ctx.arc(canvasWidth/2, canvasHeight/2, 15 * (i/2), Math.PI/2, audioData[i] / 150 - 90, false); //x,y, radius, startA, endA, bool direction
    //            ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
                i++;
            }
        }
    }
    
    // 6 - show noise amd invert colors
	let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    
	// Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4){
		// randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < 0.05){
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = 136;
            data[i+1] = 224; // zero out the red and green and blue channels
            data[i+2] = 128; // make the red channel 100% red
		} 
        
        //invert colors
        if(params.showInvert){
            let red = data[i], green = data[i+1], blue = data[i+2];
            data[i] = 255 - red; //set red value
            data[i+1] = 255 - green; //set blue value
            data[i+2] = 255 - blue; //set green value
            //data[i+3] is the alpha but we're leaving alone
        }
	} // end for
	
    // 7 - emboss
    if(params.showEmboss){
        for (let i = 0; i < length; i++){
            if (i%4 == 3) continue; //skip alpha channel
            data[i] = 127 + 2 * data[i] - data[i+4] - data[i + width *4];
        }       
    }
	
    // copy image data back to canvas
    ctx.putImageData(imageData,0,0);
    
    
//canvas draw boombox
    ctx.save();
    ctx.fillStyle = params.boomboxColor;
    utils.roundRect(ctx, canvasWidth/2-300,canvasHeight/2-100, 600, 400, 7, params.boomboxColor); //ctx, x,y, w, h, rad, fill, stroke
    
    ctx.fillStyle = 'black';
    let radius = 100;
    let widthAdjust = 170;
    let heightAdjust = 190;
     
    let maxRadius = 100;
    ctx.save();
//    ctx.globalAlpha = 0.5;
    
    //STATIC SPEAKERS
    //left speaker
    ctx.beginPath();
    ctx.fillStyle = 'black'
    ctx.arc(canvasWidth/2-widthAdjust, canvasHeight/2+heightAdjust, maxRadius, 0, 2 * Math.PI, false); //x,y,r, startA, endA, bool
    ctx.closePath();
    ctx.fill();

    //right speaker
    ctx.beginPath();
    ctx.arc(canvasWidth/2+widthAdjust, canvasHeight/2+heightAdjust, maxRadius, 0, 2 * Math.PI, false); //x,y,r, startA, endA, bool
    ctx.closePath();
    ctx.fill();
    
    //drawing DYNAMIC speakers
    for (let i=5; i < 12; i++){
        if(audioData[i] != 0){
            let percent = audioData[i] / 255;
            let circleRadius = percent * maxRadius;

            //left speaker
            ctx.beginPath();
    //        ctx.fillStyle = utils.makeColor(255,111,111, 0.34 - percent/3.0); //redish circle
            ctx.fillStyle = 'gray'
            ctx.arc(canvasWidth/2-widthAdjust, canvasHeight/2+heightAdjust, circleRadius, 0, 2 * Math.PI, false); //x,y,r, startA, endA, bool
            ctx.closePath();
            ctx.fill();
            
            //right speaker
            ctx.beginPath();
//            ctx.fillStyle = utils.makeColor(0,0,255, 0.10 - percent/10.0); //blueish
            ctx.arc(canvasWidth/2+widthAdjust, canvasHeight/2+heightAdjust, circleRadius, 0, 2 * Math.PI, false); //x,y,r, startA, endA, bool
            ctx.closePath();
            ctx.fill();
            
            //left speaker
            ctx.beginPath();
    //        ctx.fillStyle = utils.makeColor(255,111,111, 0.34 - percent/3.0); //redish circle
            ctx.fillStyle = 'white'
            ctx.arc(canvasWidth/2-widthAdjust, canvasHeight/2+heightAdjust, circleRadius-10, 0, 2 * Math.PI, false); //x,y,r, startA, endA, bool
            ctx.closePath();
            ctx.fill();
            
            //right speaker
            ctx.beginPath();
//            ctx.fillStyle = utils.makeColor(0,0,255, 0.10 - percent/10.0); //blueish
            ctx.arc(canvasWidth/2+widthAdjust, canvasHeight/2+heightAdjust, circleRadius-10, 0, 2 * Math.PI, false); //x,y,r, startA, endA, bool
            ctx.closePath();
            ctx.fill();
        }
    }
    ctx.restore();
    ctx.fillRect(canvasWidth/2 - 125, canvasHeight/2 - 40, 250, 125); //small screen
    
    let trackSelect = document.querySelector('#trackSelect');
    let text = trackSelect.value;
    text = text.substr(6);
    
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = '20px serif';
    let size = ctx.measureText(text).width;
    ctx.fillText(text, canvasWidth/2 - size/2, canvasHeight/2);
    
    let seconds = audio.returnTime();
    size = ctx.measureText(text).width;
    ctx.fillText(seconds, canvasWidth/2 - size/2, canvasHeight/2+30);

    ctx.restore();
    
    
    ctx.restore();
}

export {setupCanvas,draw};



















