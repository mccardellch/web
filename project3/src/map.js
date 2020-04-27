let map;
let biggerSmaller;
let parkList = { 
    type: 'FeatureCollection',
    features: []
};

function initMap(){
    //removed access token for security purposes
    //mapboxgl.accessToken = '';
    map = new mapboxgl.Map({
        container: 'map', //container id
        style: 'mapbox://styles/mapbox/outdoors-v11',
        zoom: 3,    //start zoom
        center: [-99, 34] //start pos [longitude, latitude]
    });
    
	//still working on this functionality
    //resize the canvas if navFull is clicked
//    map.on('load', function() {
//        let navFull = document.querySelector('#navFull');
//        let mapCanvas = document.querySelectorAll('.mapboxgl-canvas')[0];
//        let mapDiv = document.querySelector('#map');
//        
//        navFull.onclick = function() {
//            if (biggerSmaller !== 'smaller') {
//                mapDiv.style.width = '80%';
//                mapCanvas.style.width = '100%';
//                biggerSmaller = 'smaller';                
//            } else {
//                console.log('smaller');
//                mapDiv.style.width = '750px';
//                mapCanvas.style.width = '100%';
//                biggerSmaller = 'bigger';
//            }
//            map.resize();
//        }
//    }); //end map.on()
    
    loadMarkers();
    addMarkersToMap();
}

function addMarkersToMap(){
    // add markers to map
    for(let feature of parkList.features) {
        addMarker(feature.geometry.coordinates, feature.properties.title, feature.properties.description, 'marker');
    }
}

function addMarker(coordinates, title, description, className){
    let el = document.createElement('div');
    el.className = className;
    
    new mapboxgl.Marker(el)
        .setLngLat(coordinates)
        .setPopup(new mapboxgl.Popup({offset: 25}) //add popups
        .setHTML('<h3>' + title + '</h3><p>' + description + '</p>'))
        .addTo(map);
}


// Creats default locations and pushes them to list to be drawn on map
function loadMarkers(){
    //array skateParks to hold default locations
  const skateParks = [
    {
		latitude:33.987127,
		longitude:-118.475288,
		title:'Venice Beach Skatepark'
	},
	{
		latitude:32.818556,
		longitude:-79.955830,
		title:'SK8 Charleston'
	},
	{
		latitude:39.899861,
		longitude:-75.176443,
		title:'FDR Skatepark'
	},
	{
		latitude:43.150860,
		longitude:-77.608125,
		title:'Roc City Skatepark'
	}
  ];
    
    //now convert this data to GeoJSON
    for (let park of skateParks){
        //an empty GeoJSON feature
        const newFeature = {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: []
            },
            properties: {
                title: '',
                description: 'Skate Park'
            }
        };
        
        //add some properties for the current skate parks
        newFeature.geometry.coordinates[0] = park.longitude;
        newFeature.geometry.coordinates[1] = park.latitude;
        newFeature.properties.title = park.title;
        
        parkList.features.push(newFeature); //push to GeoJSON array
    } //-end for-
    
    //console.log(parkList.feautures);
}

function flyTo(center = [0,0]){
    map.flyTo({center: center});
}

function setZoomLevel(value = 0){
    map.setZoom(value);
}

function setPitchAndBearing(pitch=0, bearing=0){
    map.setPitch(pitch);
    map.setBearing(bearing);
}

export{initMap, addMarkersToMap, addMarker, loadMarkers, flyTo, setZoomLevel, setPitchAndBearing};

// Mapbox GL documentation - https://docs.mapbox.com/mapbox-gl-js/api/
