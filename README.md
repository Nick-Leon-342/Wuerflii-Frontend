
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


Wuerflii uses only `wuerflii.domain.com/` as url but you can change it by editing **homepage** in _package.json_.


### Development

Create a _.env.development.local_-file (e.g. edit _.env.example_). Keep in mind that you have to completely restart ReactJS if you edited any _.env_-file for React to correctly implement those values.
Use `npm start` to start the dev-server.

You can set the backend URL in a `.env.development.local` file. (Make a copy of `.env.example`)

For generating icons: `https://www.npmjs.com/package/pwa-asset-generator`
```
npx pwa-asset-generator public/default.svg public -m public/manifest.json --icon-only --favicon
```


### Production

The backend url can only be edited in nginx.conf.
Use `npm build` to get the optimized frontend as html. Copy the folder **build** to the destination and get started with a apache or nginx server.

Other env-variables have to be changed in the backend because the frontend just requests them.

