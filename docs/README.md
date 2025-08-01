# crime_map

## Table of Contents

### 1. User Experience
#### a. Purpose of the Webstie
#### b. User Stories
#### c. Wireframes
#### d. Colour Palette
#### e. Fonts
#### f. Features

### 2. Technologies Used
#### a. APIs Used
#### b. Map Information
#### c. Other Code Credits

### 3. Deployment Information
#### a. Version Control
#### b. Deployment to Github Pages
#### c. Clone the Code Locally

### 4. Testing (See seperate Testing.md file)

### 5. Improvements for Future Releases


### 1. User Experience

#### Purpose of the Website

This website is built to allow people to see how much crime has happened in an area in the last 3 months and understand what type of crime it is. The website is able to search across England and Wales using official UK Police data. It is as up to date as the latest data revealed by the Police (which is usually approximately a month old). The date that the data was most recently updated is shown on the website.

#### User Stories

##### Story A

Someone is looking to buy/rent a house in a local area and wants to understand how much crime is committed to get a feel for how safe the area is.
    - They need an easily searchable and viewable map and the ability to look at each crime incident in more detail.

#### Story B

Someone wants to undersand the types of crimes committed in their area to get a more in depth feel of the local social issues.
    - They need a filter that easily allows you to see the type and location of each crime. 
    - They also want to see the numbers of the crimes that have been committed locally.

#### Story C

A tourist is visiting a town and they want to understand to the safest area of town to stay in.
    - They need a map that can be moved around within an area and the map regenerates to show the crimes within the new area.

#### Story D

A car owner wants to know if it is safe to park their car in an area.
    - They need to be able to filter vehicle crime and see how common it is in an area.


### Wireframes

Wireframe for the desktop version -

![wireframe for desktop](assets/docs-images/desktopn-wireframe.png)

The design is as simple and visually easy as possible. There is a sidebar that contains the postcode search, a list of crimes in the area and a summary of the top 3 crimes. 

![wireframe for mobile](assets/docs-images/mobile-wireframe.png)

### Colour Scheme

### Fonts

Nunito sans from Google Fonts is used to give a clean look that is easy to read.

### Features

#### Map

The webiste uses Leaflet maps to generate a map with markers in the locations where crimes hav occured. You can scroll on this map and select an area you would like to see the crime information for.

#### Postcode Search

You can search using a UK postcode to find an area you want.

#### Dropdown to filter crime types

There is a dropdown menu that allows you to filter the crime types to only the ones you are interested in searching within a selected area. 

#### There is a box showing the top 3 crimes in your selected area and the percentage of those crimes.

This is showing a summary of the most common crimes in the selected area.

#### There is a date that shows when the the information was last updated.

This is date is fetched directly from the Police API to explain when it was last updated, so people can understand how up to date the information they are looking at is.


### 2. Technologies Used
The website is built using HTML, CSS and javascript.

#### APIs Used

The website uses 2 APIs.

It uses the official UK Police API for street level crimes. The documentation can be found here -

[https://data.police.uk/docs/method/crime-street/](https://data.police.uk/docs/method/crime-street/)

It also uses a postode API to calculate to longitude and latitude for each postcode to position the map correctly. The documentation can be found here -

[https://postcodes.io/](https://postcodes.io/)

#### Map Information

The map and the markers are generated using Leaflet Maps, a javascript library for interactive maps. The documentation can be found here -

[https://leafletjs.com/](https://leafletjs.com/)


#### Other Code Credits

Some code is used for formatting dates that was found on stackoverflow.

The exact post I used is here - 

[https://stackoverflow.com/questions/6040515/how-do-i-get-month-and-date-of-javascript-in-2-digit-format](https://stackoverflow.com/questions/6040515/how-do-i-get-month-and-date-of-javascript-in-2-digit-format)

### 3. Deployment Information
#### a. Version Control

The site was created using the Visual Studio code editor and pushed to github to the remote repository ‘Swiftsparrow-rec’.

The following git commands were used throughout development to push code to the remote repo:

git add <file> - This command was used to add the file(s) to the staging area before they are committed.

git commit -m “commit message” - This command was used to commit changes to the local repository queue ready for the final step.

git push - This command was used to push all committed code to the remote repository on github.

#### b. Deployment to Github Pages

The site was deployed to GitHub pages. The steps to deploy are as follows:
- In the GitHub repository, navigate to the Settings tab
- From the menu on left select 'Pages'
- From the source section drop-down menu, select the Branch: main
- Click 'Save'
- A live link will be displayed in a green banner when published successfully.

The live link can be found here - [https://christinalicence.github.io/crime_map/](https://christinalicence.github.io/crime_map/)

#### c. Clone the Code Locally

Navigate to the GitHub Repository you want to clone to use locally:

- Click on the code drop down button
- Click on HTTPS
- Copy the repository link to the clipboard
- Open your IDE of choice (git must be installed for the next steps)
- Type git clone copied-git-url into the IDE terminal
- The project will now have been cloned on your local machine for use.

### 4. Testing (See seperate Testing.md file)

The manual and automated testing is documented in the testing.md file.

### 5. Improvements for Future Releases.

There are still various improvments that could be made to the map.

- Improve the map bounds with completeley accurate longitude and latitude for the country. At the moment they are approximate. You could also blur out areas not within England and Wales, or make them grey.

- Improve mobile responsiveness to include landscape and touch screen.

- Make the marker for a selected crime highlighted to improve the visual affect.

- Include more information on the pop-up for each crime, including the exact date of the crime and the status of whether it is solved/concluded.

- Improve the map so you can see exactly what are is being searched in a postcode or a click.

- Include a search feature to allow you to search the road names of the crimes in the sidebar.