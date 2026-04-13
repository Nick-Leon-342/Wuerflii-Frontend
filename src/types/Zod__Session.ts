

import { COLOR__REGEX, MAX_COLUMNS, MAX_LENGTH_SESSION_NAME } from '@/logic/utils'
import { Enum__Statistics_View } from './Enum/Enum__Statistics_View'
import { Zod__Player_List__With_PlayerID } from './Zod__Player'
import { Enum__Input_Type } from './Enum/Enum__Input_Type'
import { Enum__View } from './Enum/Enum__View'
import * as z from 'zod'
import { Enum__Months } from './Enum/Enum__Months'





export const Zod__Session = z.object({
	id: 							z.number().int, 
	Name:							z.string()
										.min(1, 'Session name too short.')
										.max(MAX_LENGTH_SESSION_NAME, `Max session name length is ${MAX_LENGTH_SESSION_NAME} characters.`),
	Color:							z.string()
										.regex(COLOR__REGEX, 'Color invalid.'),
	Columns:						z.string()
										.min(1, 'Less than 1 column is not valid.')
										.max(MAX_COLUMNS, `Max amount of columns is ${MAX_COLUMNS}.`),

	// Checkbox_Checked_To_Delete?:	boolean

	View__List_Years:				z.array(z.number().int()), 
	CurrentGameStart:				z.date().nullable(), 
	LastPlayed:						z.date().nullable(), 

	Input_Type:						z.enum(Enum__Input_Type), 
	Show_Scores:					z.boolean(), 

	View: 							z.enum(Enum__View), 
	View__Month: 					z.enum(Enum__Months), 
	View__Year: 					z.number().int(), 
	View__Custom_Date:				z.date(), 

	Statistics__Show_Border: 		z.boolean(), 
	Statistics__View_Month:			z.enum(Enum__Months), 
	Statistics__View_Year: 			z.number().int(), 
	Statistics__View: 				z.enum(Enum__Statistics_View), 

	List__Players:					z.array(Zod__Player_List__With_PlayerID).nullish()
})

export type Type__Session = z.infer<typeof Zod__Session>





export const Zod__Session_POST = Zod__Session.pick({
	Columns: true, 
	Color: true, 
	Name: true, 
})

export type Type__Session_POST = z.infer<typeof Zod__Session_POST>





export const Zod__Session_PATCH = Zod__Session.partial({
	Name: true, 
	Color: true, 
	Columns: true, 

	View: true, 
	View__Month: true, 
	View__Year: true, 

	Input_Type: true, 
	Show_Scores: true, 

	Statistics__Show_Border: true, 
	Statistics__View_Month: true, 
	Statistics__View_Year: true, 
	Statistics__View: true, 
})

export type Type__Session_PATCH = z.infer<typeof Zod__Session_PATCH>
