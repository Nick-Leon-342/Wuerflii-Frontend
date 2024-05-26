
# Kniffel
___


Use `npm start` to start the dev-server.
Use `npm build` to get the optimized frontend as html. Copy the folder **build** to the destination and get started with a apache or nginx server.

In */src/logic/utils-env* set the REACT_APP_BACKEND_URL to your backend url.
`export const REACT_APP_BACKEND_URL = ... `
Other env-variables have to be changed in the backend because the frontend just requests them.

Kniffel uses `domain.com/kniffel` as url but you can change it by editing **homepage** in package.json.

