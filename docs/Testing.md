# Manual Tesing

## Are the User Stories Accomplished?

## HTML validator

I used the [W3C HTML validator](https://validator.w3.org/)

It had no warnings, but there were same "trailing slash on void elements' pointed out 

![Image of HTML validator info points](assets/docs-images/html-validator.png)

## JS Hint

## CSS Validator

I used the [W3C CSS validator](https://jigsaw.w3.org/css-validator/)

It passed with no errors
![Image of CSS validator pass](assets/docs-images/css-validator.png)

There was one warning because external imports are not checked, this appeared because I used Google fonts.

## Lighthouse testing

## Wave Testing

I used the [WAVE accessibility evaluation tool](https://wave.webaim.org/) to test for any accessibility issues. 

The report showed one error

![Image of Wave Report](assets/docs-images/wave-report.png)

This was a missing aria label for my postcode search.

![Image of Wave error](assets/docs-images/wave-error.png)

I have corrected this issue by adding an Aria label.

# Automated Testing

## Automated Testing with Jest