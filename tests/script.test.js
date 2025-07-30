
/**
 * @jest-environment jsdom
 */


beforeEach(() => {
  // Set up required DOM nodes
  document.body.innerHTML = `
    <div id="map"></div>
    <select id="crime-type"></select>
    <div class="crime-items"><ul></ul></div>
    <div id="last-date"></div>
  `;
});


const  {
    setupEventListeners,
    setupPage,
    initMap,
    lastMonthDate,
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
    displayErrorMessage,
    displayTopCrimes
      } = require('../assets/js/script.js');


    // mocks leafket
jest.mock('leaflet', () => {
    return {
        map: jest.fn(() => ({
            setView: jest.fn().mockReturnThis(),
            setMaxBounds: jest.fn(),
            setMinZoom: jest.fn(),
            setMaxZoom: jest.fn(),
            remove: jest.fn()
        })),
        tileLayer: jest.fn(() => ({
            addTo: jest.fn()
        })),
        marker: jest.fn(() => ({
            addTo: jest.fn().mockReturnThis(),
            bindPopup: jest.fn().mockReturnThis(),
            on: jest.fn()
        })),
        latLngBounds: jest.fn()
    };

});

    // Test for setupEventListeners function


    // Test for setupPage function


    // Test for initMap function

    // Test for lastMonthDate function
    describe('lastMonthDate', () => {
  test('returns a date in YYYY-MM format', () => {
    const date = lastMonthDate();
    expect(date).toMatch(/^\d{4}-\d{2}$/); // YYYY-MM format
  });
});


    // Test for fetchCrimeData function


    // Test for addCrimeMarkers function


    // Test for highlightListedItem function
   describe('highlightListedItem', () => {
  test('highlights the correct list item and removes highlight from others', () => {
    const ul = document.querySelector('.crime-items ul');

    const listItem1 = document.createElement('li');
    listItem1.textContent = 'Crime 1';
    listItem1.classList.add('highlight');

    const listItem2 = document.createElement('li');
    listItem2.textContent = 'Crime 2';
    listItem2.scrollIntoView = jest.fn(); // Spy on scrollIntoView

    ul.appendChild(listItem1);
    ul.appendChild(listItem2);

    highlightListedItem(listItem2);

    expect(listItem1.classList.contains('highlight')).toBe(false);
    expect(listItem2.classList.contains('highlight')).toBe(true);
    expect(listItem2.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
    });
  });
});
    
    
    // Test for loadCrimes function


    // Test for filterCrimesByCategory function


    // Test for clearMarkers function


    // Test for updateMarkersByCategory function



    // Test for populateCrimeDropdown function



    // Test for formatCrimeCategory function
    test('formatCrimeCategory returns formatted category', () => {
        const category = 'violent-crime';
        const formatted = formatCrimeCategory(category);
        expect(formatted).toBe('Violent Crime');
    });



    // Test for displayLastUpdatedDate function



    // Test for updateCrimeList function



    // Test for displayErrorMessage function
   describe('displayErrorMessage', () => {  
    test("displays an error message in the error-message div", () => {
        const errorDiv = document.createElement("div");
        errorDiv.id = "error-message";
        document.body.appendChild(errorDiv);

        const message = "An error occurred while loading data.";
        displayErrorMessage(message);
        expect(errorDiv.innerHTML).toBe(`<p>${message}</p>`);
        expect(errorDiv.style.display).toBe("block"); // Check if the error message is displayed
    });
  });   


      