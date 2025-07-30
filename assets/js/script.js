let map; // Declare map variable globally
let markers = []; // Declare markers array globally, filled as site runs
let allCrimes = []; // Declare allCrimes array globally, filled as site runs
let crimeIndex = {}; // stores all crimes by a unique id
const DEFAULT_ZOOM = 6.5; // Wide Eng and and Wales view zoom level
const UK_CENTER_LAT = 52.355; // Latitude for UK center
const UK_CENTER_LNG = -1.5; // Longitude for UK center
const AREA_ZOOM = 14; // Zoom level when viewing specific area
// England & Wales bounds
const EW_BOUNDS = {
  north: 56.0,
  south: 49.6,
  east: 2.5,
  west: -7.0
};

function isInEnglandWales(lat, lng) {
  // Tighter check for actual England & Wales area without padding
  const tightBounds = {
    north: 55.5,
    south: 49.9,
    east: 1.8,
    west: -5.8
  };
  return (
    lat >= tightBounds.south &&
    lat <= tightBounds.north &&
    lng >= tightBounds.west &&
    lng <= tightBounds.east
  );
}

// Function to set up event listeners after the DOM is loaded, before rest of code so testing works
function setupEventListeners() {
  const crimeTypeDropdown = document.getElementById("crime-type");
  if (crimeTypeDropdown) {
    crimeTypeDropdown.addEventListener("change", function () {
      const selectedCategory = this.value;
      updateMarkersByCategory(selectedCategory);
    });
  }
  const searchButton = document.getElementById("search-button");
  const postcodeInput = document.getElementById("postcode-search");
  if (searchButton && postcodeInput) {
    searchButton.addEventListener("click", () => {
      const postcode = postcodeInput.value.trim().toUpperCase(); // Convert postcode to uppercase for consistency
      if (postcode) {
        searchPostcode(postcode);
      } else {
        displayErrorMessage("Please enter a valid postcode.");
      }
    });
    postcodeInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        const postcode = postcodeInput.value.trim().toUpperCase();
        if (postcode) {
          searchPostcode(postcode);
        }
      }
    });
  }
  // Reload button
  const reloadButton = document.getElementById("reload-button");
  if (reloadButton) {
    reloadButton.addEventListener("click", reloadCrimesInView);
  }
}   //Help Modal functionality
    const helpButton = document.getElementById("help-button");
    const helpModal = document.getElementById("help-modal");
    const closeButton = helpModal.querySelector(".close");

    if (helpButton && helpModal && closeButton) {
        helpButton.addEventListener("click", () => {
        helpModal.style.display = "block";
        });

    closeButton.addEventListener("click", () => {
        helpModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === helpModal) {
        helpModal.style.display = "none";
     }
  });
}

// Function to initialize the page
// This function is called when the DOM is loaded, and it sets up the map, loads crimes, displays the last updated date, and sets up event listeners.
function setupPage() {
  initMap();
  displayLastUpdatedDate();
  setupEventListeners();
}

document.addEventListener("DOMContentLoaded", function () {
  setupPage(); // Initialize the page when the DOM is fully loaded
});

// Script to initialize the Leaflet map
function initMap() {
  if (map) {
    map.remove(); // Reset existing map if reinitializing
  }

  map = L.map("map", {
    doubleClickZoom: false,
    scrollWheelZoom: false,
    zoomControl: true,
    boxZoom: false,
    touchZoom: false,
    dragging: true,
    keyboard: false,
    maxBounds: L.latLngBounds(
      [EW_BOUNDS.south, EW_BOUNDS.west],
      [EW_BOUNDS.north, EW_BOUNDS.east]
    ),
    maxBoundsViscosity: 1.0 // Prevents panning outside bounds
  }).setView([UK_CENTER_LAT, UK_CENTER_LNG], DEFAULT_ZOOM);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  // Click handler
  map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;

    // Check if the clicked location is within England and Wales bounds
    if (!isInEnglandWales(lat, lng)) {
      displayErrorMessage("Sorry this service only covers England and Wales.");
      return;
    }

    // If clicked location is valid, clear markers and load crimes for that area
    clearMarkers();
    map.setView([lat, lng], AREA_ZOOM);
    loadCrimesForArea(lat, lng);
  });

  // For mobile devices, ensure the map is redrawn after a short delay to fix initial display issues
  // This is a workaround for Leaflet's initial rendering issues on mobile devices
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}

// Force map redraw on window resize/orientation change
window.addEventListener("resize", () => {
  if (map) {
    map.invalidateSize();
  }
});

// Function to get the last 3 months date in YYYY-MM format
function lastMonthDate() {
  const date = new Date();
  date.setMonth(date.getMonth() - 3); //set to 3 months to get more data, data seems to be delayed (so in June, it will fetch April)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

// Function to add markers to the map
function addCrimeMarkers(crimes) {
  crimes.forEach((crime) => {
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
        .bindPopup(
          `<b>${formatCrimeCategory(crime.category)}</b><br>${
            crime.location.street.name
          }`
        );

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
  allListItems.forEach((li) => {
    li.classList.remove("highlight");
  });

  // Add highlight to the clicked item
  if (listItem) {
    listItem.classList.add("highlight");
    // Only scroll on non-mobile screens
    if (window.innerWidth > 768) {
      listItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

// Load and display crimes
async function loadCrimesForArea(lat, lng) {
  try {
    // Clear existing markers and crime data
    clearMarkers();
    // Scroll sidebar back to top
    document.getElementById("sidebar-container").scrollTop = 0;
    const lastMonth = lastMonthDate();
    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=${lastMonth}`;
    const response = await fetch(url);
    const crimes = await response.json();
    if (crimes && crimes.length > 0) {
      allCrimes = crimes;
      map.setView([lat, lng], AREA_ZOOM); // Zoom in on the clicked area
      addCrimeMarkers(crimes);
      updateCrimeList(crimes);
      populateCrimeDropdown(crimes);
      displayTopCrimes(crimes);
    }
  } catch (error) {
    console.error("Failed to load crimes:", error);
    displayErrorMessage(
      "Sorry, something went wrong while loading crime data. Please try again later."
    );
  }
}

// Dropdown crime filter functionality

// Function to filter crimes by category
function filterCrimesByCategory(category) {
  if (category === "all") {
    console.log(`Returning all ${allCrimes.length} crimes`);
    return allCrimes; // Return all crimes if 'all' is selected
  } else {
    return allCrimes.filter((crime) => crime.category === category);
  }
}

// Function to clear existing markers from the map
function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = []; // Resets markers array
  crimeIndex = {}; // Reset crime index to help with memory management
}

// Function to load new markers on map by crime category
function updateMarkersByCategory(category) {
  clearMarkers();
  const filteredCrimes = filterCrimesByCategory(category);
  //reset markers and call them in the location
  if (allCrimes.length > 0) {
    addCrimeMarkers(filteredCrimes);
    updateCrimeList(filteredCrimes);
    displayTopCrimes(filteredCrimes);
  }
}

//Function to generate the dropdown options dynamically from the API's crime categories
function populateCrimeDropdown(crimes) {
  const dropdown = document.getElementById("crime-type");
  // Calls categories from the API
  const uniqueCategories = Array.from(
    new Set(crimes.map((crime) => crime.category))
  );
  //Sort categories alphabetically
  uniqueCategories.sort();
  // Clear existing options
  dropdown.innerHTML = "";
  // Add an "All" option at the top
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Crime Types";
  dropdown.appendChild(allOption);
  // Add other categories
  uniqueCategories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = formatCrimeCategory(category);
    dropdown.appendChild(option);
  });
}

//Function to format the crime category for display in the dropdown (removes hyphens and capitalizes)
function formatCrimeCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Function to display most recent date for data in the info div
function displayLastUpdatedDate() {
  fetch("https://data.police.uk/api/crime-last-updated")
    .then((response) => response.json())
    .then((data) => {
      const lastUpdatedDate = new Date(data.date);
      const formattedDate = lastUpdatedDate.toLocaleDateString("en-GB");
      document.getElementById("last-date").textContent = formattedDate;
    });
}

// Function to generate info for the crime list div

function updateCrimeList(crimes) {
  const listContainer = document.querySelector(".crime-items");
  listContainer.innerHTML = ""; // Clear existing items

  // Convert the first letter of the string to lower case (used for location names)
  const lowerCaseFirstLetter = (str) =>
    str.charAt(0).toLowerCase() + str.slice(1);

  if (crimes.length === 0) {
    listContainer.innerHTML = "<li>No crimes found for this category.</li>";
    return;
  }
  crimes.forEach((crime) => {
    const listItem = document.createElement("li");
    const formattedStreetName = lowerCaseFirstLetter(
      crime.location.street.name
    );
    listItem.textContent = `${formatCrimeCategory(
      crime.category
    )} ${formattedStreetName}`;
    listContainer.appendChild(listItem);

    // Attach crime ID to the list item for later reference
    listItem.dataset.crimeId = crime.crimeId;

    // Save the crime ID in the crime object for linking later
    crime._listItem = listItem;

    // Add click event to the list item to focus on the marker
    listItem.addEventListener("click", function () {
      const crimeId = this.dataset.crimeId;
      const crimeData = crimeIndex[crimeId]; // Get the crime data from the index
      if (crimeData && crimeData._marker) {
        map.setView(crimeData._marker.getLatLng());
        crimeData._marker.openPopup(); // Open the popup for the marker
        highlightListedItem(this); // Highlight the clicked list item
      }
    });
  });
}

// Function to display top 3 crimes and percentage in the crimes-percentage div

function displayTopCrimes(crimes) {
  const crimeCounts = {};
  crimes.forEach((crime) => {
    const category = crime.category;
    // Add 1 to each category as a new crime in that category is counted while iterating through the crimes
    if (crimeCounts[category]) {
      crimeCounts[category] += 1;
    } else {
      crimeCounts[category] = 1;
    }
  });
  // Sort the categories by count in descending order and get top 3
  const topCategories = Object.entries(crimeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  // Reset the innerHTML of the crimes-percentage div
  const crimePercentageDiv = document.getElementById("highest-crimes-list");
  crimePercentageDiv.innerHTML = ""; // Clear existing content
  // Create a list to display the top 3 crimes and their percentages
  topCategories.forEach(([category, count]) => {
    const percentage = ((count / crimes.length) * 100).toFixed(1);
    const formattedCategory = formatCrimeCategory(category);
    const listItem = document.createElement("li");
    listItem.textContent = `${formattedCategory}: (${percentage}%)`;
    crimePercentageDiv.appendChild(listItem);
  });
}

// Function to make postcode search work, use postcodes.io API to get lat/lng from postcode
async function searchPostcode(postcode) {
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${postcode}`
    );
    if (!response.ok) {
      throw new Error("Postcode not found");
    }
    const data = await response.json();
    const { latitude, longitude } = data.result;

    // Check if the coordinates are within England and Wales bounds
    if (!isInEnglandWales(latitude, longitude)) {
      displayErrorMessage(
        "Sorry this service is only available for England and Wales."
      );
      return;
    }

    loadCrimesForArea(latitude, longitude);
  } catch (error) {
    console.error("Error fetching postcode:", error);
    displayErrorMessage("Invalid postcode. Please try again.");
  }
}

// Function to reload crimes in the current map view

async function reloadCrimesInView() {
  if (!map) return; // Ensure map is initialized
  const zoom = map.getZoom();
  const center = map.getCenter();
  const lastMonth = lastMonthDate();

  // If zoomed out too far or no previous area selected
  if (zoom < AREA_ZOOM) {
    displayErrorMessage(
      "Please zoom in or choose a location to search for crimes."
    );
    return;
  }

  try {
    // Scroll sidebar back to top
    document.getElementById("sidebar-container").scrollTop = 0;
    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${center.lat}&lng=${center.lng}&date=${lastMonth}`;
    const response = await fetch(url);
    const crimes = await response.json();
    if (crimes && crimes.length > 0) {
      clearMarkers();
      addCrimeMarkers(crimes);
      updateCrimeList(crimes);
      populateCrimeDropdown(crimes);
      displayTopCrimes(crimes);
    } else {
      displayErrorMessage("No crimes found in the current view.");
    }
  } catch (error) {
    console.error("Failed to reload crimes:", error);
    displayErrorMessage(
      "Sorry, something went wrong while reloading crime data. Please try again later."
    );
  }
}

//Function to display error message

function displayErrorMessage(message) {
  const errorMessageDiv = document.getElementById("error-message");
  if (errorMessageDiv) {
    errorMessageDiv.innerHTML = `<p>${message}</p>`;
    errorMessageDiv.style.display = "block"; // Show the error message
    // Auto-hide after 5 seconds
    setTimeout(() => {
      errorMessageDiv.style.display = "none";
    }, 5000);
  }
}

// Export functions for testing

module.exports = {
  setupEventListeners,
  setupPage,
  initMap,
  lastMonthDate,
  addCrimeMarkers,
  highlightListedItem,
  filterCrimesByCategory,
  clearMarkers,
  updateMarkersByCategory,
  populateCrimeDropdown,
  formatCrimeCategory,
  displayLastUpdatedDate,
  updateCrimeList,
  displayErrorMessage,
  displayTopCrimes,
};
