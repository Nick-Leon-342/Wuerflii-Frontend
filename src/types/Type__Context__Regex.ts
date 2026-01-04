

export interface Type__Context__Regex {
	NAME_MIN_CHARACTER: 			number
	NAME_MAX_CHARACTER: 			number

	NAME_REGEX: 					RegExp | null
	NAME_REGEX_MINMAX:				RegExp | null
	NAME_REGEX_LETTERFIRST: 		RegExp | null
	NAME_REGEX_ALLOWEDCHARS:		RegExp | null

	PASSWORD_MIN_CHARACTER: 		number
	PASSWORD_MAX_CHARACTER: 		number

	PASSWORD_REGEX:					RegExp | null
	PASSWORD_REGEX_MINMAX:			RegExp | null
	PASSWORD_REGEX_ALLOWEDCHARS: 	RegExp | null
	PASSWORD_REGEX_ALLOWEDSYMBOLS: 	RegExp | null
}
