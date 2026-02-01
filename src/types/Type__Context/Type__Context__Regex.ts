

export interface Type__Context__Regex {
	requesting_regex:				boolean
	
	NAME__MIN_CHARACTER: 			number
	NAME__MAX_CHARACTER: 			number

	NAME__REGEX: 					RegExp
	NAME__REGEX_MINMAX:				RegExp
	NAME__REGEX_LETTERFIRST: 		RegExp
	NAME__REGEX_ALLOWEDCHARS:		RegExp

	PASSWORD__MIN_CHARACTER: 		number
	PASSWORD__MAX_CHARACTER: 		number

	PASSWORD__REGEX:					RegExp
	PASSWORD__REGEX_MINMAX:			RegExp
	PASSWORD__REGEX_ALLOWEDCHARS: 	RegExp
	PASSWORD__REGEX_ALLOWEDSYMBOLS: 	RegExp
}
