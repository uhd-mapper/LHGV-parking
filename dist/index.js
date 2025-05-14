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
;
class StopPoint {
    constructor() {
        this.lon = 0.0;
        this.lat = 0.0;
        this.fromTs = 0;
        this.toTs = 0;
    }
}
;
class PointsCluster {
    constructor() {
        this.cluster = 0;
        this.points = [];
    }
}
;
let latestLocations = new InteractiveValues();
let pointsClusters = [];
let clustersMarkers = [];
let clusterPointsMarkers = [];
latestLocations.callback = (data) => {
    console.log('values ' + data);
    // const dataElement = document.getElementById('data');
    // if(dataElement){
    //     dataElement.innerHTML = data.map((v,idx)=>`${idx} @ ${new Date(v.timestamp).toISOString()} [${v.coords.longitude} ${v.coords.latitude}] alt ${v.coords.altitude} speed ${v.coords.speed}`).join('<br>');
    // }
    // applyPositionToMap();
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
async function loadParkings(map, radiusMeters) {
    let mapCenter = map.getCenter();
    // let url = `http://localhost:8080/poi/parkings?lon=${mapCenter.lng()}&lat=${mapCenter.lat()}&r=${radiusMeters}`;
    let url = `https://lhgv-service-355552993992.europe-west9.run.app/poi/parkings?lon=${mapCenter.lng()}&lat=${mapCenter.lat()}&r=${radiusMeters}`;
    console.log(`url ${url}`);
    let response = await fetch(url, {
        method: 'GET'
    });
    let clustersJson = await response.json();
    pointsClusters = clustersJson;
    drawClusters();
    console.log(`resp ${JSON.stringify(pointsClusters)}`);
}
function createCenterControl(map) {
    const controlButton = document.createElement('button');
    // Set CSS for the control.
    controlButton.style.backgroundColor = 'rgb(0,0,164)';
    // controlButton.style.border = '2px solid #fff';
    // controlButton.style.borderRadius = '3px';
    // controlButton.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlButton.style.color = 'rgb(255,255,255)';
    // controlButton.style.cursor = 'pointer';
    // controlButton.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlButton.style.fontSize = '16px';
    controlButton.style.lineHeight = '38px';
    // controlButton.style.margin = '8px 0 22px';
    // controlButton.style.padding = '0 5px';
    // controlButton.style.textAlign = 'center';
    controlButton.textContent = 'PARKINGS';
    controlButton.title = 'Parking';
    controlButton.type = 'button';
    // Setup the click event listeners: simply set the map to Chicago.
    controlButton.addEventListener('click', async () => {
        //   map.setCenter(chicago);
        console.log("11111");
        loadParkings(map, 100000);
    });
    return controlButton;
}
async function initMap() {
    // Request libraries when needed, not in the script tag.
    const { Map } = await google.maps.importLibrary("maps");
    // Short namespaces can be used.
    map = new Map(document.getElementById("map"), {
        center: euCenter,
        zoom: 6,
        mapId: "123"
    });
    const centerControlDiv = document.createElement('div');
    const centerControl = createCenterControl(map);
    centerControlDiv.appendChild(centerControl);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");
}
initMap();
async function applyPositionToMap() {
    if (map) {
        let latestPosition = latestLocations.data[latestLocations.data.length - 1];
        let pos = { lat: latestPosition.coords.latitude, lng: latestPosition.coords.longitude };
        if (map.getZoom() < 17) {
            map.setCenter(pos);
            map.setZoom(17);
        }
        // const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: pos,
            map
        });
    }
}
function drawClusters() {
    if (map) {
        clusterPointsMarkers.forEach((marker) => marker.map = null);
        clustersMarkers.forEach((marker) => marker.map = null);
        clusterPointsMarkers = [];
        clustersMarkers = pointsClusters.map((pointsCluster) => {
            const lat = pointsCluster.points.map((p) => p.lat).reduce((res, v) => res + v, 0) / pointsCluster.points.length;
            const lng = pointsCluster.points.map((p) => p.lon).reduce((res, v) => res + v, 0) / pointsCluster.points.length;
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: lat, lng: lng },
                map: map
            });
            marker.addListener("click", () => {
                console.log(`drawing points ${pointsCluster}`);
                drawClusterPoints(pointsCluster);
            });
            return marker;
        });
    }
}
function drawClusterPoints(pointsCluster) {
    if (map) {
        clusterPointsMarkers.forEach((marker) => marker.map = null);
        clusterPointsMarkers = pointsCluster.points.map((stopPoint) => {
            const pinBackground = new google.maps.marker.PinElement({
                background: '#0000AA',
            });
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: stopPoint.lat, lng: stopPoint.lon },
                map: map,
                content: pinBackground.element
            });
            return marker;
        });
        const lat = pointsCluster.points.map((p) => p.lat).reduce((res, v) => res + v, 0) / pointsCluster.points.length;
        const lng = pointsCluster.points.map((p) => p.lon).reduce((res, v) => res + v, 0) / pointsCluster.points.length;
        let pos = { lat: lat, lng: lng };
        map.setCenter(pos);
        map.setZoom(16);
    }
}
