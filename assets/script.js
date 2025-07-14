let map; // Declare map variable globally
let markers = []; // Declare markers array globally, filled as site runs
let allCrimes = []; // Declare allCrimes array globally, filled as site runs
let crimeIndex = {}; // stores all crimes by a unique id
const DEFAULT_ZOOM= 14; // Default zoom level for the map
const BRIGHTON_LAT = 50.86; // Lat and long for North Brighton
const BRIGHTON_LNG = -0.16;

// Function to set up event listeners after the DOM is loaded, before rest of code so testing works
function setupEventListeners() {
    const crimeTypeDropdown = document.getElementById("crime-type");
  if (crimeTypeDropdown) {
    crimeTypeDropdown.addEventListener("change", function() {
      const selectedCategory = this.value;
      updateMarkersByCategory(selectedCategory);
    });
  }
}

// Function to initialize the page
// This function is called when the DOM is loaded, and it sets up the map, loads crimes, displays the last updated date, and sets up event listeners.
function setupPage() {
  initMap();
  loadCrimes();
  displayLastUpdatedDate();
  setupEventListeners();
}


document.addEventListener("DOMContentLoaded", function() {
    setupPage(); // Initialize the page when the DOM is fully loaded
});
   

//Script to initialize the Leaflet map
function initMap() {
    if (map) {
        map.remove(); // Reset existing map if reinitializing
    }
map = L.map("map").setView([BRIGHTON_LAT, BRIGHTON_LNG], 14);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
// Set the map bounds to stop people scrolling away 
const tightBounds = L.latLngBounds(
    [50.82, -0.20],  
    [50.88, -0.10]   
);
map.setMaxBounds(tightBounds);
map.setMinZoom(13);  
map.setMaxZoom(18);  
}


// Function to get the last 3 months date in YYYY-MM format
function lastMonthDate() {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);//set to 3 months to get more data, data seems to be delayed (so in June, it will fetch April)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

// Fetch crime data
async function fetchCrimeData() {
    const lastMonth = lastMonthDate(); 
    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${BRIGHTON_LAT}&lng=${BRIGHTON_LNG}&date=${lastMonth}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(`Found ${data.length} crimes`);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        displayErrorMessage('Sorry, something went wrong while fetching crime data. Please try again later.');
        return []; // Return an empty array if there's an error
    }
}

// Function to add markers to the map
function addCrimeMarkers(crimes) {
    crimes.forEach(crime => {
        const lat = parseFloat(crime.location.latitude);
        const lng = parseFloat(crime.location.longitude);
        
        if (lat && lng) {
            // Create a unique ID for each crime based on its category and location
            const crimeId = `${crime.category}-${lat}-${lng}`;

            // Store in the crimeIndex object
            crime.crimeId = crimeId;
            crimeIndex[crimeId] = crime;

            const marker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<b>${formatCrimeCategory(crime.category)}</b><br>${crime.location.street.name}`);
            
            marker.crimeId = crimeId;
            crime._marker = marker;
            markers.push(marker);

            marker.on("click", () => {
                const linkedCrime = crimeIndex[marker.crimeId];
                if (linkedCrime && linkedCrime._listItem) {
                    highlightListedItem(linkedCrime._listItem);
             }
            });
        }
    }); 
}

// Function to highlight the list item when its marker is clicked and remove previous highlights
function highlightListedItem(listItem) {
    // Remove highlight from all items
    const allListItems = document.querySelectorAll(".crime-items li");
    allListItems.forEach(li => {
        li.classList.remove("highlight");
    });
    // Add highlight to the clicked item
    if (listItem) {
        listItem.classList.add("highlight");
        // Scroll to the highlighted item
        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

// Load and display crimes
async function loadCrimes() {
  try {
    const crimes = await fetchCrimeData();
    if (crimes) {
      allCrimes = crimes;
      addCrimeMarkers(crimes);
      updateCrimeList(crimes);
      populateCrimeDropdown(crimes);
    }
  } catch (error) {
    console.error('Failed to load crimes:', error);
    displayErrorMessage('Sorry, something went wrong while loading crime data. Please try again later.');
  }
}


// Dropdown functionality

// Function to filter crimes by category
function filterCrimesByCategory(category) {
    if (category === "all") {
        console.log(`Returning all ${allCrimes.length} crimes`);
        return allCrimes; // Return all crimes if 'all' is selected
    } else {
        return allCrimes.filter(crime => crime.category === category);
    }
}

// Function to clear existing markers from the map
function clearMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = []; // Resets markers array
}

// Function to load new markers on map by crime category
function updateMarkersByCategory(category) {
    clearMarkers();
    const filteredCrimes = filterCrimesByCategory(category);
    map.setView([BRIGHTON_LAT, BRIGHTON_LNG], DEFAULT_ZOOM);
    addCrimeMarkers(filteredCrimes);
    updateCrimeList(filteredCrimes); 
}

//Function to generate the dropdown options dynamically from the API's crime categories
function populateCrimeDropdown(crimes) {
    const dropdown = document.getElementById("crime-type");
    // Calls categories from the API
    const uniqueCategories = Array.from(new Set(crimes.map(crime => crime.category)));
    //Sort categories alphabetically
    uniqueCategories.sort();
    // Add an "All" option at the top
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Crime Types";
    dropdown.appendChild(allOption);
    // Populate dropdown with unique crime categories
    const optionsHTML = [...uniqueCategories].map(category => {
        const formattedCategory = formatCrimeCategory(category);
        return `<option value="${category}">${formattedCategory}</option>`;
    }).join("");
    dropdown.innerHTML += optionsHTML;
}

//Function to format the crime category for display in the dropdown (removes hyphens and capitalizes)
function formatCrimeCategory(category) {
    return category
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}




// Function to display most recent date for data in the info div
function displayLastUpdatedDate() {
    fetch("https://data.police.uk/api/crime-last-updated")
        .then(response => response.json())
        .then(data => {
            const lastUpdatedDate = new Date(data.date);
            const formattedDate = lastUpdatedDate.toLocaleDateString('en-GB');
            document.getElementById("last-date").textContent = formattedDate;
        });
}

// Function to generate info for the crime list div

function updateCrimeList(crimes) {
    const listContainer = document.querySelector(".crime-items");
    listContainer.innerHTML = ""; // Clear existing items

    // Convert the first letter of the string to lower case (used for location names)
    const lowerCaseFirstLetter = (str) => str.charAt(0).toLowerCase() + str.slice(1);

    if (crimes.length === 0) {
        listContainer.innerHTML = "<li>No crimes found for this category.</li>";
        return;
    }
    crimes.forEach(crime => {
        const listItem = document.createElement("li");
        const formattedStreetName = lowerCaseFirstLetter(crime.location.street.name);
        listItem.textContent = `${formatCrimeCategory(crime.category)} ${formattedStreetName}`;
        listContainer.appendChild(listItem);

        // Attach crime ID to the list item for later reference
        listItem.dataset.crimeId = crime.crimeId;

        // Save the crime ID in the crime object for linking later
        crime._listItem = listItem;

        // Add click event to the list item to focus on the marker
        listItem.addEventListener("click", function() {
            const crimeId = this.dataset.crimeId;
            const crimeData = crimeIndex[crimeId]; // Get the crime data from the index
            if (crimeData && crimeData._marker) {
                map.setView(crimeData._marker.getLatLng(), 15.5); // Zoom in on the marker
                crimeData._marker.openPopup(); // Open the popup for the marker
                highlightListedItem(this); // Highlight the clicked list item
            }
        });
    });
}


//Function to display error message

function displayErrorMessage(message) {
    const errorMessageDiv = document.getElementById("error-message");
    if (errorMessageDiv) {
        errorMessageDiv.innerHTML = `<p>${message}</p>`;
        errorMessageDiv.style.display = "block"; // Show the error message
    }
}

// Export functions for testing

module.exports = {
    setupEventListeners,
    setupPage,
    initMap,
    lastMonthDate,
    fetchCrimeData,
    addCrimeMarkers,
    highlightListedItem,
    loadCrimes,
    filterCrimesByCategory,
    clearMarkers,
    updateMarkersByCategory,
    populateCrimeDropdown,
    formatCrimeCategory,
    displayLastUpdatedDate,
    updateCrimeList,
    displayErrorMessage
};