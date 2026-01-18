

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'



import App from './App'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Provider_And_Context__Auth } from './Provider_And_Context/Provider_And_Context__Auth'
import { Provider_And_Context__Error } from './Provider_And_Context/Provider_And_Context__Error'
import { Provider_And_Context__Regex } from './Provider_And_Context/Provider_And_Context__Regex'
import { Provider_And_Context__Server_Version } from './Provider_And_Context/Provider_And_Context__Server_Version'
import { Provider_And_Context__Universal_Loader } from './Provider_And_Context/Provider_And_Context__Universal_Loader'

const query_client = new QueryClient()


createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={query_client}>
			<Provider_And_Context__Auth>
				<Provider_And_Context__Server_Version>
					<Provider_And_Context__Universal_Loader>
						<Provider_And_Context__Regex>
							<Provider_And_Context__Error>
								<App />
								<ReactQueryDevtools/>
							</Provider_And_Context__Error>
						</Provider_And_Context__Regex>
					</Provider_And_Context__Universal_Loader>
				</Provider_And_Context__Server_Version>
			</Provider_And_Context__Auth>
		</QueryClientProvider>
	</StrictMode>,
)
