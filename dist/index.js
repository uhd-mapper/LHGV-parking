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
    const dataElement = document.getElementById('data');
    if (dataElement) {
        dataElement.innerHTML = data.map(v => `lon ${v.coords.longitude} lat ${v.coords.latitude} alt ${v.coords.altitude} speed ${v.coords.speed}  ts ${v.timestamp} <br>`).join('<br>');
    }
};
const geoLocationOptions = {
    maximumAge: 0,
    timeout: 3000,
    enableHighAccuracy: true
};
function getGeoLocation(options) {
    return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, options));
}
;
navigator.geolocation.watchPosition((position) => {
    latestLocations.append(position);
}, (err) => {
    console.log('values ' + err);
}, geoLocationOptions);
console.log('before async');
(async () => {
    let position = await getGeoLocation(geoLocationOptions);
    console.log('Hello Typescript' + position);
})();
console.log('after async');
