

import type { Type__Server_Reponse__Player__Get } from './Type__Server_Response__Player__GET'

export interface Type__Server_Response__Analytics_Session__GET__Data {
	Games_Played:	number
	Draws:			number
	Wins:			Record<Type__Server_Reponse__Player__Get['id'], number>
}

export interface Type__Server_Response__Analytics_Session__GET__Total {
	Total__Games_Played:	number
	Total__Wins: 			Record<Type__Server_Reponse__Player__Get['id'], number>
	Total__Draws: 			number

	Scores__Lowest: 		Record<Type__Server_Reponse__Player__Get['id'], number>
	Scores__Average: 		Record<Type__Server_Reponse__Player__Get['id'], number>
	Scores__Highest: 		Record<Type__Server_Reponse__Player__Get['id'], number>
	Scores__Total: 			Record<Type__Server_Reponse__Player__Get['id'], number>
	
	Data: 					Record<string, Type__Server_Response__Analytics_Session__GET__Data>
}

export interface Type__Server_Response__Analytics_Session__GET {
	List__Years:	Array<number>
	Total:			Type__Server_Response__Analytics_Session__GET__Total
}
