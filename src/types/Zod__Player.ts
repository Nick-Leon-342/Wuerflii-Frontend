

import * as z from 'zod'

import {
	MAX_PLAYERS, 
	COLOR__REGEX,
	MAX_LENGTH_PLAYER_NAME,
} from '../logic/utils'





const Zod__Player = z.object({
	Name:	z
		.string()
		.min(1, 'Name too short.')
		.max(MAX_LENGTH_PLAYER_NAME, 'Name too long.'), 
	Color:	z
		.string()
		.regex(COLOR__REGEX, 'Color invalid.')
})

export const Zod__Player_List__Without_PlayerID = z.object({
	List__Players: z
		.array(Zod__Player)
		.min(1, 'List__Players too short.')
		.max(MAX_PLAYERS, 'List__Players too long.')
})





const Zod__Player_With_ID = Zod__Player.extend({
	id:		z.number().int(), 
})

export const Zod__Player_List__With_PlayerID = z.object({
	List__Players: z
		.array(Zod__Player_With_ID)
		.min(1, 'List__Players too short.')
		.max(MAX_PLAYERS, 'List__Players too long.')
})
