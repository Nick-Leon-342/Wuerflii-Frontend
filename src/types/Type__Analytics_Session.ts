

import type { Type__Player } from '@/types/Zod__Player'

export interface Type__Analytics_Session__Data {
	Games_Played:	number
	Draws:			number
	Wins:			Record<Type__Player['id'], number>
}

export interface Type__Analytics_Session {
	Total__Games_Played:	number
	Total__Wins: 			Record<Type__Player['id'], number>
	Total__Draws: 			number

	Scores__Lowest: 		Record<Type__Player['id'], number>
	Scores__Average: 		Record<Type__Player['id'], number>
	Scores__Highest: 		Record<Type__Player['id'], number>
	Scores__Total: 			Record<Type__Player['id'], number>
	
	Data: 					Record<string, Type__Analytics_Session__Data>
}