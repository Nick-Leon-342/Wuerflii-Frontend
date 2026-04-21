

import type { Type__ENV_Variables } from '@/types/Type__ENV_Variables'
import { api } from './axios'

export function get__env(): Promise<Type__ENV_Variables> {
	return api.get('/env').then(({ data }) => data)
}
