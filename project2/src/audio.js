// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element;
let sourceNode;
let analyserNode;
let gainNode;
let bassNode;
let trebleNode;
let bass = 0;
let treble = 0;

// faking an enumeration
const DEFAULTS = Object.freeze({
    gain    :   .5,
    bass    :   0,
    treble  :   0,
    numSamples : 256
});

// create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

function setupWebaudio(filePath){
    const AudioContext = window.AudioContext || window.webkitAudioContext; //The || is because WebAudio has not been standardized across browsers yet

    audioCtx = new AudioContext();

    element = new Audio();     //this creates an <audio> element

    loadSoundFile(filePath);    //have it point at a sound file

    sourceNode = audioCtx.createMediaElementSource(element);    //create an a source node that points at the <audio> element

    analyserNode = audioCtx.createAnalyser();    //create an analyser node

    
    /*
    We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
    across the sound spectrum.
    If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
    the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
    the amplitude of that frequency.
    */ 

    analyserNode.fftSize = DEFAULTS.numSamples;    // fft stands for Fast Fourier Transform

    gainNode = audioCtx.createGain();    //create a gain (volume) node
    gainNode.gain.value = DEFAULTS.gain;

    //add bass boost
    bassNode = audioCtx.createBiquadFilter();
    bassNode.type = "lowshelf";
    bassNode.frequency.value = 200;
    bassNode.gain.value = DEFAULTS.bass;
    
    //add treble boost
    trebleNode = audioCtx.createBiquadFilter();
    trebleNode.type = "highshelf";
    trebleNode.frequency.value = 2000;
    trebleNode.gain.value = DEFAULTS.bass;
    
    //connect the nodes to make audio graph
    sourceNode.connect(bassNode);
    bassNode.connect(trebleNode);
    trebleNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

function returnTime(){
    return element.currentTime;
}

function loadSoundFile(filePath){
    element.src = filePath;
} 

function playCurrentSound(){
    element.play();
}

function pauseCurrentSound(){
    element.pause();
}

function setVolume(value){
    value = Number(value); // make sure that it's a Number rather than a String
    gainNode.gain.value = value;
}

function setBass(value){
    value = Number(value); // make sure that it's a Number rather than a String
    bassNode.gain.value = value;
}

function setTreble(value){
    value = Number(value); // make sure that it's a Number rather than a String
    trebleNode.gain.value = value;
}

export {audioCtx, setupWebaudio, returnTime, loadSoundFile, playCurrentSound, pauseCurrentSound, setVolume, setBass, setTreble, analyserNode};