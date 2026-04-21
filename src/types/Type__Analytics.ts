

interface Type__Games_Played {
	Games_Played:	number
}

export interface Type__Analytics__Data {
	[key: string]:	Type__Games_Played
}

export interface Type__Analytics {
	Total__Sessions:		number
	Total__Games_Played:	number
	Data:					Type__Analytics__Data
}
