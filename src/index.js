

import App from './App'
import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Error } from './context/Error'
import { AuthProvider } from './context/AuthProvider'
import { ServerVersion } from './context/Server_Version'
import { UniversalLoader } from './context/Universal_Loader'

const query_client = new QueryClient()





ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={query_client}>
			<AuthProvider>
				<ServerVersion>
					<UniversalLoader>
						<Error>
							<App />
							<ReactQueryDevtools/>
						</Error>
					</UniversalLoader>
				</ServerVersion>
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>
)





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
