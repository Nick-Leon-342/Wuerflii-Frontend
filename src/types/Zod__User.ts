

import * as z from 'zod'

import { Enum__Statistics_View } from './Enum/Enum__Statistics_View.js'
import { Enum__View_Sessions } from './Enum/Enum__View_Sessions.js'
import { Enum__Months } from './Enum/Enum__Months.js'





export const Zod__User = z.object({
	id:			z.number().int(), 
	Name:		z.string(), 
	Password:	z.string(), 

	DarkMode:					z.boolean(), 

	Show__Session_Names:		z.boolean(), 
	Show__Session_Date:			z.boolean(), 

	View__Sessions:				z.enum(Enum__View_Sessions), 
	View__Sessions_Desc:		z.boolean(), 

	Statistics__View:			z.enum(Enum__Statistics_View), 
	Statistics__View_Month:		z.enum(Enum__Months), 
	Statistics__View_Year:		z.number().int(), 

	updatedAt:					z.date(), 
	createdAt:					z.date(), 
})

export type Type__User = z.infer<typeof Zod__User>





export const Zod__User_POST = Zod__User.pick({
	Password: true, 
	Name: true, 
})

export type Type__User_POST = z.infer<typeof Zod__User_POST>





export const Zod__User_PATCH = Zod__User.pick({
	Name: true, 
	Password: true, 
	DarkMode: true, 

	Show__Session_Names: true, 
	Show__Session_Date: true, 

	View__Sessions: true, 
	View__Sessions_Desc: true, 

	Statistics__View: true, 
	Statistics__View_Month: true, 
	Statistics__View_Year: true, 
}).partial()

export type Type__User_PATCH = z.infer<typeof Zod__User_PATCH>
