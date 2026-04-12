

import type { Type__Player } from '../Type__Player'

export interface Type__Server_Response__Analytics_Session__GET__Data {
	Games_Played:	number
	Draws:			number
	Wins:			Record<Type__Player['id'], number>
}

export interface Type__Server_Response__Analytics_Session__GET__Total {
	Total__Games_Played:	number
	Total__Wins: 			Record<Type__Player['id'], number>
	Total__Draws: 			number

	Scores__Lowest: 		Record<Type__Player['id'], number>
	Scores__Average: 		Record<Type__Player['id'], number>
	Scores__Highest: 		Record<Type__Player['id'], number>
	Scores__Total: 			Record<Type__Player['id'], number>
	
	Data: 					Record<string, Type__Server_Response__Analytics_Session__GET__Data>
}

export interface Type__Server_Response__Analytics_Session__GET {
	List__Years:	Array<number>
	Total:			Type__Server_Response__Analytics_Session__GET__Total
}
