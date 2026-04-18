

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'

import App from './App'

import { Provider_And_Context__Server_Version } from './Provider_And_Context/Provider_And_Context__Server_Version'
import { Provider_And_Context__ENV_Variables } from './Provider_And_Context/Provider_And_Context__ENV_Variables'

import './i18n/i18n'

const query_client = new QueryClient()


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={query_client}>
			<Provider_And_Context__Server_Version>
				<Provider_And_Context__ENV_Variables>
					<App />
					<ReactQueryDevtools/>
				</Provider_And_Context__ENV_Variables>
			</Provider_And_Context__Server_Version>
		</QueryClientProvider>
	</StrictMode>,
)
