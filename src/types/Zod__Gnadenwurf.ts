

import * as z from 'zod'

export const Zod__Gnadenwurf = z.object({
	Gnadenwurf_Used: z.boolean(), 
})

export type Type__Gnadenwurf = z.infer<typeof Zod__Gnadenwurf>
