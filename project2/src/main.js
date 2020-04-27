/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as canvas from './canvas.js';
import * as audio from './audio.js';
import * as utils from './utils.js';

const drawParams = {
    showP2 : true,
    showGradient : true,
    showBars : false,
    showCircles : false,
    showNoise : false,
    showInvert : false,
    showEmboss : false,
    boomboxColor : 'red'
};

// faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "./media/New Adventure Theme.mp3"
});

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyserNode);
    loop();
}

//basic main loop
function loop(){
	requestAnimationFrame(loop);
    canvas.draw(drawParams);    
}

/* Set up the User Interface
 - create button event listeners (play, pause, full screen)
 - hook up volume slider
 - create track selector
 - create event listeners for checkboxes
*/

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
    
    playButton.onclick = e => {
        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);
        
        if (audio.audioCtx.state == 'suspended'){
            audio.audioCtx.resume();
        }
        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
        if(e.target.dataset.playing == 'no'){
            audio.playCurrentSound();
            e.target.dataset.playing = 'yes';
        }else{
            audio.pauseCurrentSound();
            e.target.dataset.playing = 'no';
        }
    }
    
    /* 
    Set up volume, bass and treble sliders and labels
    */ 
    let volumeSlider = document.querySelector('#volumeSlider');
    let volumeLabel = document.querySelector('#volumeLabel');
    
    //add .oninput event to slider
    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value); //set the gain
        volumeLabel.innerHTML = Math.round(e.target.value); //update value of label to match value of slider
    };
    
    //set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event('input'));

    let bassSlider = document.querySelector('#bassSlider');
    let bassLabel = document.querySelector('#bassLabel');
    
    //add .oninput event to slider
    bassSlider.oninput = e => {
        audio.setBass(e.target.value); //set the gain
        bassLabel.innerHTML = Math.round(e.target.value); //update value of label to match value of slide
    };
    
    //set value of label to match initial value of slider
    bassSlider.dispatchEvent(new Event('input'));
    
    let trebleSlider = document.querySelector('#trebleSlider');
    let trebleLabel = document.querySelector('#trebleLabel');
    
    //add .oninput event to slider
    trebleSlider.oninput = e => {
        audio.setTreble(e.target.value); //set the gain
        trebleLabel.innerHTML = Math.round((e.target.value/2 * 100)); //update value of label to match value of slide
    };
    
    //set value of label to match initial value of slider
    trebleSlider.dispatchEvent(new Event('input'));
    
    // Choose a song - setup track <select>
    let trackSelect = document.querySelector('#trackSelect');
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        
        //pause the current track if it is playing
        if (playButton.dataset.playing = 'yes'){
            playButton.dispatchEvent(new MouseEvent('click'));
        }
    }   
    
    // Choose boombox color
    let colorSelect = document.querySelector('#colorSelect');
    colorSelect.onchange = e => {
        drawParams.boomboxColor = e.target.value;
    } 
    
    /* 
    Event listeners for checkboxes
    */
    document.querySelector('#gradientCB').onclick = e => {
        if(document.querySelector('#gradientCB').checked){
            drawParams.showGradient = true;
        }
        if(!document.querySelector('#gradientCB').checked) {
            drawParams.showGradient = false;
        }
    }    
    
    document.querySelector('#barsCB').onclick = e => {
        if(document.querySelector('#barsCB').checked){
            drawParams.showBars = true;
        }
        if(!document.querySelector('#barsCB').checked) {
            drawParams.showBars = false;
        }
    }    
        
    document.querySelector('#circlesCB').onclick = e => {
        if(document.querySelector('#circlesCB').checked){
            drawParams.showCircles = true;
        }
        if(!document.querySelector('#circlesCB').checked) {
            drawParams.showCircles = false;
        }
    }    

    document.querySelector('#noiseCB').onclick = e => {
        if(document.querySelector('#noiseCB').checked){
            drawParams.showNoise = true;
        }
        if(!document.querySelector('#noiseCB').checked) {
            drawParams.showNoise = false;
        }
    }    
    
    document.querySelector('#invertCB').onclick = e => {
        if(document.querySelector('#invertCB').checked){
            drawParams.showInvert = true;
        }
        if(!document.querySelector('#invertCB').checked) {
            drawParams.showInvert = false;
        }
    }
    
    document.querySelector('#embossCB').onclick = e => {
        if(document.querySelector('#embossCB').checked){
            drawParams.showEmboss = true;
        }
        if(!document.querySelector('#embossCB').checked) {
            drawParams.showEmboss = false;
        }
    }
    
    document.querySelector('#myCB').onclick = e => {
        if(document.querySelector('#myCB').checked){
            drawParams.showP2 = true;
        }
        if(!document.querySelector('#myCB').checked) {
            drawParams.showP2 = false;
        }
    }
    
} // end setupUI

export {init};