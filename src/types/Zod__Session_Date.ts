

import * as z from 'zod'

export const Zod__Session_Date__PATCH = z.object({
	View__Custom_Date:	z.coerce.date(), 
})

export type Type__Session_Date__PATCH = z.infer<typeof Zod__Session_Date__PATCH>
