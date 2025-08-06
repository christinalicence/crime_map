
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
    lastMonthDate,
    highlightListedItem,
    formatCrimeCategory,
    displayErrorMessage,
    displayTopCrimes,
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


// Test for lastMonthDate function
  describe('lastMonthDate', () => {
    test('returns a date in YYYY-MM format', () => {
      const date = lastMonthDate();
      expect(date).toMatch(/^\d{4}-\d{2}$/); // YYYY-MM format
    });
  });

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
    

  // Test for formatCrimeCategory function
    test('formatCrimeCategory returns formatted category', () => {
        const category = 'violent-crime';
        const formatted = formatCrimeCategory(category);
        expect(formatted).toBe('Violent Crime');
    });



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


// Test for displayTopCrimes function
describe('displayTopCrimes', () => { 
    test('displays the top 3 crimes with percentages', () => {
      // Mock the crime data from the API  
      const crimes = [
            { category: 'violent-crime' },
            { category: 'violent-crime' },
            { category: 'violent-crime' },
            { category: 'violent-crime' },
            { category: 'violent-crime' },
            { category: 'burglary' },
            { category: 'burglary' },
            { category: 'burglary' },
            { category: 'vehicle-crime' },
            { category: 'vehicle-crime' }
        ];
        const highestCrimeList = document.createElement('ul');
        highestCrimeList.id = 'highest-crimes-list';
        document.body.appendChild(highestCrimeList);

        displayTopCrimes(crimes);
        const listItems = highestCrimeList.querySelectorAll('li');
        expect(listItems.length).toBe(3); // Check if only top 3 crimes
        expect(listItems[0].textContent).toContain('Violent Crime: (50.0%)');
        expect(listItems[1].textContent).toContain('Burglary: (30.0%)');
        expect(listItems[2].textContent).toContain('Vehicle Crime: (20.0%)');
    });
});