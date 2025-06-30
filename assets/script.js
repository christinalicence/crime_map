// Lat and long for Brighton
const BRIGHTON_LAT = 50.83;
const BRIGHTON_LNG = -0.15;

//Script to initialize the Leaflet map
var map = L.map('map').setView([BRIGHTON_LAT, BRIGHTON_LNG], 12.3);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Api link to fetch crime data, includes long and lat
const ApiLink = 'https://data.police.uk/api/crimes-street/all-crime?lat=${BRIGHTON_LAT}&lng=${BRIGHTON_LNG}&date=${lastMonthDate}`';


// Function to get the last month date in YYYY-MM format
function LastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    return `${year}-${month}`;
}

// Function to fetch crime data
async function fetchCrimeData() {
    try {
        const response = await fetch(ApiLink);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to add markers to the map
function addMarkers(data) {
    data.forEach(crime => {
        const { location, category } = crime;
        if (location && location.latitude && location.longitude) {
            const marker = L.marker([location.latitude, location.longitude]).addTo(map);
            marker.bindPopup(`<b>Category:</b> ${category}<br><b>Date:</b> ${crime.date}`);
        }
    });
}

// Main function to initialize the map and fetch data
async function initMap() {
    const lastMonthDate = LastMonthDate();
    const crimeData = await fetchCrimeData(lastMonthDate);
    if (crimeData && crimeData.length > 0) {
        addMarkers(crimeData);
    } else {
        console.log('No crime data available for the last month.');
    }
}