

import { COLOR__REGEX, MAX_COLUMNS, MAX_LENGTH_SESSION_NAME } from '@/logic/utils'
import { Enum__Statistics_View } from './Enum/Enum__Statistics_View'
import { Enum__Input_Type } from './Enum/Enum__Input_Type'
import { Enum__Months } from './Enum/Enum__Months'
import { Zod__Player_List } from './Zod__Player'
import { Enum__View } from './Enum/Enum__View'
import * as z from 'zod'





export const Zod__Session = z.object({
	id: 							z.number().int, 
	Name:							z.string('session__name_invalid')
										.min(1, 'session__name_min')
										.max(MAX_LENGTH_SESSION_NAME, 'session__name_max'),
	Color:							z.string('session__color')
										.regex(COLOR__REGEX, 'session__color'),
	Columns:						z.number('session__columns_invalid')
										.min(1, 'session__columns_min')
										.max(MAX_COLUMNS, 'session__columns_max'),

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

	Checkbox_Checked_To_Delete:		z.boolean(), 
	List__Players:					z.array(Zod__Player_List).nullish()
})

export type Type__Session = z.infer<typeof Zod__Session>





export const Zod__Session_POST = Zod__Session.pick({
	Columns: true, 
	Color: true, 
	Name: true, 
})

export type Type__Session_POST = z.infer<typeof Zod__Session_POST>





export const Zod__Session_PATCH = Zod__Session.pick({
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
}).partial()

export type Type__Session_PATCH = z.infer<typeof Zod__Session_PATCH>
