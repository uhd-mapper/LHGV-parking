"use strict";
// export {};
class InteractiveValues {
    constructor() {
        this.data = [];
        this.callback = (v) => { };
    }
    append(v) {
        this.data.push(v);
        this.callback(this.data);
    }
    ;
}
let latestLocations = new InteractiveValues();
latestLocations.callback = (data) => {
    console.log('values ' + data);
    // const dataElement = document.getElementById('data');
    // if(dataElement){
    //     dataElement.innerHTML = data.map((v,idx)=>`${idx} @ ${new Date(v.timestamp).toISOString()} [${v.coords.longitude} ${v.coords.latitude}] alt ${v.coords.altitude} speed ${v.coords.speed}`).join('<br>');
    // }
    applyPositionToMap();
};
const geoLocationOptions = {
    maximumAge: 0,
    timeout: 3000,
    enableHighAccuracy: true
};
navigator.geolocation.watchPosition((position) => {
    latestLocations.append(position);
}, (err) => {
    console.log('values ' + err);
}, geoLocationOptions);
let map;
const euCenter = { lat: 48.8, lng: 19.8 };
// initMap is now async
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: euCenter,
        zoom: 6,
        mapId: "123"
    });
}
initMap();
async function applyPositionToMap() {
    if (map) {
        let latestPosition = latestLocations.data[latestLocations.data.length - 1];
        let pos = { lat: latestPosition.coords.latitude, lng: latestPosition.coords.longitude };
        map.setCenter(pos);
        map.setZoom(17);
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
        const marker = new AdvancedMarkerElement({
            position: pos,
            map
        });
    }
}
