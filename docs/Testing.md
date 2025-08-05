# Manual Tesing

## Are the User Stories Accomplished?

## JS Hint

I used [JSHint](https://jshint.com/) to check my javascript file.

It gave me a warning for using async functions as they are a more up to date function than is compatible with JSHint

![JS Hint ES8 warning](../assets/docs-images/jshint-es8-warning.png)

The async functions used while fetching data from the API are important for functionality, so I didn't adjust the code based on this warning.

It also listed an undefined variable. 

![JS Hint 'L' undefined variable](../assets/docs-images/jshint-lmap-warning.png)

This is a result of the code used by Leaflet Maps which I used to generate the map. I didn't adjust code based on this as it is important for the running of the website.


## HTML validator

I used the [W3C HTML validator](https://validator.w3.org/)

It had no warnings, but there were same "trailing slash on void elements' pointed out 

![HTML validator info points](../assets/docs-images/html-validator.png)


## CSS Validator

I used the [W3C CSS validator](https://jigsaw.w3.org/css-validator/)

It passed with no errors
![CSS validator pass](../assets/docs-images/css-validator.png)

There was one warning because external imports are not checked, this appeared because I used Google fonts.

## Wave Testing

I used the [WAVE accessibility evaluation tool](https://wave.webaim.org/) to test for any accessibility issues. 

The report showed one error

![Wave Report](../assets/docs-images/wave-report.png)

This was a missing aria label for my postcode search.

![Wave error](../assets/docs-images/wave-error.png)

I have corrected this issue by adding an Aria label.

## Lighthouse testing

The Lighthouse testing has created some interesting issues.

### Performance

The Performance Score is 86

![Lighthouse Performance Score](../assets/docs-images/lighthouse-performance-score.png)

The metrics are

![Lighthouse Performance Metrics](../assets/docs-images/lighthouse-performance-metrics.png)

I think these are acceptible.

### Accessibility

The accessibility report has created consistent issues. It has repeatedly crashed, doesn't give a score and doesn't flag any elements that need attention.

![Lighthouse accessibility score, just showing an explanation mark](../assets/docs-images/lighthouse-problem-report.png)

There are no details to fix given in the report

![The dropdown without further details given by Lighthouse](../assets/docs-images/lighthouse-accessibility-error.png)










### Best Practice

The Best Practice is 100% when run on a desktop

![Lighthouse Best Practice Score when run on a desktop](../assets/docs-images/lighthouse-best-practice-desktop.png)

But only 96% when run on a mobile 

![Lighthouse Best Practice Score when run on a mobile](../assets/docs-images/lighthouse-best-practice-mob-score.png)

It flags that some of the map images are low resolution in this format

![Lighthouse report showing low resolution maps](../assets/docs-images/lighthouse-images-low-res.png)

As these are imported using the Leflet maps and open streep maps I haven't adjusted these images.

### SEO

The Lighthouse SEO report is 100%

![Lighthouse SEO Report](../assets/docs-images/lighthouse-seo.png)



# Automated Testing

## Automated Testing with Jest