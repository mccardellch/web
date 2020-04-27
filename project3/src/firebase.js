/* removed for security purposes
const config = {
  apiKey: ,
  authDomain: ,
  databaseURL: ,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: ,
  measurementId: 
};
*/

//variables for references to firebase nodes
let fbParks;
let fbShops;
let fbSpots;

function initFirebase(){
    firebase.initializeApp(config);   // Initialize Firebase
    let db = firebase.database(); //get a ref to the database
    
    //create references to the firebase nodes
    fbParks = db.ref('parks'); // refer to a root named 'parks'
    fbShops = db.ref('shops'); // refer to a root named 'shops'
    fbSpots = db.ref('spots'); // refer to a root named 'spots'
}

//class Location
class Location {
    constructor(name, type, lng, lat){
        this.name = name;
        this.type = type;
        this.location = [lng,lat];
    }
    
    //getter methods 
    get description(){ //return the class object
        return this;
    }
    
    get location() { //return the location 
        return this.locaiton();
    }
}


    
//Write to the firebase
function write(name, type, longitude, latitude) {    
    let newLocation = new Location(name, type, longitude, latitude);

    switch(type)
    {
        case park:
            //send location to /parks
            fbParks.push(data);
            break;
        case shop:
            //send location to /shops
            fbShops.push(data);
            break;
        case spot:
            //send location to /spots
            fbSpots.push(data);
            break;
    }
}

//Read from the firebase
function read(type){
    switch(type)    //get firebase information based on the type passed in
    {  
        case park:
            fbParks.once('value');
            break;
        case shop:
            fbShops.once('value');
            break;
        case spot:
            fbSpots.once('value');
            break;
    }
}

export{initFirebase, write, read};
