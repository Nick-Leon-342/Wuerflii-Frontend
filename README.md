
# Wuerflii
___


This is a classic dice game where players roll five dice to form specific combinations and achieve the highest score. Players have multiple rolls per turn to strategically choose which dice to keep and which to reroll. The game rewards combinations like three of a kind, full house, and a five-of-a-kind (often called "Yahtzee" or "Kniffel"). Plan carefully, maximize your points, and aim for the perfect roll!



Use `npm start` to start the dev-server.
Use `npm build` to get the optimized frontend as html. Copy the folder **build** to the destination and get started with a apache or nginx server.

In */src/logic/utils-env* set the REACT_APP_BACKEND_URL to your backend url.
`export const REACT_APP_BACKEND_URL = ... `
Other env-variables have to be changed in the backend because the frontend just requests them.

Wuerflii uses `domain.com/wuerflii` as url but you can change it by editing **homepage** in package.json.

