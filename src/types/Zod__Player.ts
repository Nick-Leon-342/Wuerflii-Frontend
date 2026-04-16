

import * as z from 'zod'

import type { Type__Table_Columns } from './Zod__Table_Columns'
import {
	MAX_PLAYERS, 
	COLOR__REGEX,
	MAX_LENGTH_PLAYER_NAME,
} from '../logic/utils'





export const Zod__Player = z.object({
	id:					z.number().int(), 
	Name:				z.string('player__name_invalid')
							.min(1, 'player__name_min')
							.max(MAX_LENGTH_PLAYER_NAME, 'player__name_max.'), 
	Color:				z.string('player__color_invalid')
							.regex(COLOR__REGEX, 'player__color_invalid'), 
	Order_Index: 		z.number().int(), 
	Gnadenwurf_Used: 	z.boolean(), 

	createdAt:			z.date(), 
	updatedAt:			z.date(), 
})

export type Type__Player = z.infer<typeof Zod__Player>

export const Zod__Player_POST = Zod__Player.pick({
	Name: true, 
	Color: true, 
})

export type Type__Player_POST = z.infer<typeof Zod__Player_POST>

export const Zod__Player_PATCH = Zod__Player.pick({
	id: true, 
	Name: true, 
	Color: true, 
})

export type Type__Player_PATCH = z.infer<typeof Zod__Player_PATCH>





export interface Type__Player_With_Table_Columns extends Type__Player {
	List__Table_Columns:	Array<Type__Table_Columns>
}





export const Zod__Player_List = z.array(Zod__Player)
									.min(1, 'player__list_min')
									.max(MAX_PLAYERS, 'player__list_max')

export type Type__Player_List = z.infer<typeof Zod__Player_List>

export const Zod__Player_List__POST = z.array(Zod__Player_POST)
									.min(1, 'player__list_min')
									.max(MAX_PLAYERS, 'player__list_max')

export type Type__Player_List__POST = z.infer<typeof Zod__Player_List__POST>

export const Zod__Player_List__PATCH = z.array(Zod__Player_PATCH)
									.min(1, 'player__list_min')
									.max(MAX_PLAYERS, 'player__list_max')

export type Type__Player_List__PATCH = z.infer<typeof Zod__Player_List__PATCH>
