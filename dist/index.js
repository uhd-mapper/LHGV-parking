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
        dataElement.innerHTML = data.map((v, idx) => `${idx} @ ${new Date(v.timestamp).toISOString()} [${v.coords.longitude} ${v.coords.latitude}] alt ${v.coords.altitude} speed ${v.coords.speed}`).join('<br>');
    }
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
// function getGeoLocation(options?: PositionOptions):Promise<GeolocationPosition> {
//     return new Promise((resolve, reject) => 
//         navigator.geolocation.getCurrentPosition(resolve, reject, options)
//     );
// };
// console.log('before async');
// (async () => {
//     let position = await getGeoLocation(geoLocationOptions);
//     console.log('Hello Typescript'+position);
// })();
// console.log('after async');
