

interface Type__Games_Played {
	Games_Played:	number
}

export interface Type__Server_Response__Analytics__GET__Data {
	[key: string]:	Type__Games_Played
}

export interface Type__Server_Response__Analytics__GET__Total {
	Total__Sessions:		number
	Total__Games_Played:	number
	Data:					Type__Server_Response__Analytics__GET__Data
}

export interface Type__Server_Response__Analytics__GET {
	Total:			Type__Server_Response__Analytics__GET__Total
	List__Years:	Array<number>
}
