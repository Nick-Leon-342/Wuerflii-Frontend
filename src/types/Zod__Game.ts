

import * as z from 'zod'

export const Zod__Game = z.object({ Surrendered_PlayerID: z.number().int().nullish() })
export type Type__Game = z.infer<typeof Zod__Game>
