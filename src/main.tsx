

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'



import App from './App'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Provider_And_Context__Server_Version } from './Provider_And_Context/Provider_And_Context__Server_Version'

import './i18n/i18n'

const query_client = new QueryClient()


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={query_client}>
			<Provider_And_Context__Server_Version>
				<App />
				<ReactQueryDevtools/>
			</Provider_And_Context__Server_Version>
		</QueryClientProvider>
	</StrictMode>,
)
