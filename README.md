
# Wuerflii
___


The name wuerflii can be somewhat translated into dicelii.

This is a classic dice game where players roll five dice to form specific combinations and achieve the highest score. Players have multiple rolls per turn to strategically choose which dice to keep and which to reroll. The game rewards combinations like three of a kind, full house, and a five-of-a-kind (often called "Yahtzee" or "Kniffel"). Plan carefully, maximize your points, and aim for the perfect roll!
~ ChatGPT

I made this project for my parents, so that they are able to store their matches and have a better history of their matches. 
This is my first ever ReactJS build and therefore also a bit of a playground to test new concepts I learned or want to try out. The UI is german only at this point. 

The backend can be found at wuerflii-backend.

If anyone ever sees this project and wants to help me improve this project, I would be really grateful and also a bit proud. ;) 


___


Use `npm start` to start the dev-server.
Use `npm build` to get the optimized frontend as html. Copy the folder **build** to the destination and get started with a apache or nginx server.

In */src/logic/utils-env* set the REACT_APP_BACKEND_URL to your backend url.
`export const REACT_APP_BACKEND_URL = ... `
Other env-variables have to be changed in the backend because the frontend just requests them.

Wuerflii uses `domain.com/wuerflii` as url but you can change it by editing **homepage** in package.json.

