import * as map from './map.js';
import * as fb from './firebase.js';

function init(){
    map.initMap();
    fb.initFirebase();
    setupUI();
    console.log(window.innerWidth);
}

/* this happens onload */
//declare consts for localstorage capability
const searchField = document.querySelector('#search');
const prefix = document.querySelector('#username').value + '-';
const locationKey = prefix + 'location';

//grab the stored data
const storedSearch = localStorage.getItem(locationKey);

//if there's a previously set location value, display it
if(storedSearch){
    searchField.value = storedSearch;
}

searchField.onchange = e => {
    localStorage.setItem(locationKey, e.target.value); 
};

function setupUI(){
    // [longitude,latitude] - http://geojson.io/
    const rocCity = [-77.608125, 43.150860];
    const veniceBeach = [-118.475288, 33.987127];
    const fdr = [-75.176443, 39.899861];
    
    //Roc City Skatepark
    btn1.onclick = () => {
        map.setZoomLevel(14);
        map.setPitchAndBearing(0,0);
        map.flyTo(rocCity);
    }
    
    //Venice beach
    btn2.onclick = () => {
        map.setZoomLevel(14);
        map.setPitchAndBearing(0,0);
        map.flyTo(veniceBeach);
    }
    
    //FDR
    btn3.onclick = () => {
        map.setZoomLevel(14);
        map.setPitchAndBearing(0,0);
        map.flyTo(fdr);
    }
    
    //World Zoom 0
    btn4.onclick = () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0,0);
        map.flyTo();
    }
    
    navSearch.onclick = () => {
        setActive(navSearch);
        removeActive(navAdd);
        removeActive(navFull);
        
        // update the display of the divs
        div_search.style.display = 'inherit';
        div_add.style.display = 'none';
    }
    
    navAdd.onclick = () => {
        setActive(navAdd);
        removeActive(navSearch);
        removeActive(navFull);
        
        // update the display of the divs
        div_search.style.display = 'none';
        div_add.style.display = 'inherit';
    }
    
    navFull.onclick = () => {
        setActive(navFull);
        removeActive(navSearch);
        removeActive(navAdd);
    }
    
    document.querySelector('#reset').onclick = resetPage;
}

function setActive(e){
    let el = document.querySelector(`#${e.id}`);
    el.classList.add('active');
}

function removeActive(e){
    let el = document.querySelector(`#${e.id}`);
    el.classList.remove('active');
}

function resetPage(){
    console.log('page reset');
    
    //clear all fields
    let elements = document.getElementsByTagName('input');
    for(let node of elements){
        node.value = "";
    }
    
    //reset select
    document.querySelector('#locationType').value = '0';
    
    //show search
    setActive(navSearch);
    removeActive(navAdd);
    removeActive(navFull);    
    
    //minmize map
    let mapCanvas = document.querySelectorAll('.mapboxgl-canvas')[0];
    let mapDiv = document.querySelector('#map');

    navFull.onclick = function() {
        mapDiv.style.width = '750px';
        mapCanvas.style.width = '100%';
    }
    
    //return map to world view
    map.setPitchAndBearing();
    map.flyTo([-99, 34]);    
}

export{init};
