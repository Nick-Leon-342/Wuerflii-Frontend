

export const REACT_APP_MAX_PLAYERS = 16
export const REACT_APP_MAX_COLUMNS = 10





// __________________________________________________RegEx for username and password__________________________________________________
// has to be the same on server

export const REACT_APP_USERNAME_MIN_CHARACTER = 4
export const REACT_APP_USERNAME_MAX_CHARACTER = 64

export const NAME_REGEX = new RegExp(`^[A-z][A-z0-9-_]{${REACT_APP_USERNAME_MIN_CHARACTER - 1},${REACT_APP_USERNAME_MAX_CHARACTER - 1}}$`)
export const NAME_REGEX_MINMAX = new RegExp(`^.{${REACT_APP_USERNAME_MIN_CHARACTER},${REACT_APP_USERNAME_MAX_CHARACTER}}$`)
export const NAME_REGEX_LETTERFIRST = /^[A-z]/
export const NAME_REGEX_ALLOWEDCHARS = /^[a-zA-Z0-9_-]+$/


export const REACT_APP_PASSWORD_MIN_CHARACTER = 8
export const REACT_APP_PASSWORD_MAX_CHARACTER = 128

export const PASSWORD_REGEX = new RegExp(`^(?=.*[-_!#%@$])[a-zA-Z0-9-_!#%@$]{${REACT_APP_PASSWORD_MIN_CHARACTER},${REACT_APP_PASSWORD_MAX_CHARACTER}}$`)
export const PASSWORD_REGEX_MINMAX = new RegExp(`^.{${REACT_APP_PASSWORD_MIN_CHARACTER},${REACT_APP_PASSWORD_MAX_CHARACTER}}$`)
export const PASSWORD_REGEX_ALLOWEDCHARS = /[a-zA-Z0-9]+/
export const PASSWORD_REGEX_ALLOWEDSYMBOLS = /[-_!#%@$]+/





// export const REACT_APP_BACKEND_URL = 'http://localhost:10001'
// export const REACT_APP_BACKEND_URL = 'http://192.168.178.41:10001'
// export const REACT_APP_BACKEND_URL = 'http://192.168.178.2:10001'
export const REACT_APP_BACKEND_URL = 'https://kniffel-server.mmtn-schneider.com'
