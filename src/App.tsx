

import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Axios_Private_Route from './logic/Axios_Private_Route'
import { Toaster } from './components/ui/sonner'


// ____________________ RegistrationAndLogin ____________________

import Registration_And_Login from './pages/Registration_And_Login'

import Profile from './pages/Profile'


// ____________________ Analytics ____________________

import Analytics from './pages/Analytics/Analytics'
import Analytics__Session from './pages/Analytics/Analytics_Session'


// ____________________ Session ____________________

import Session__Add_And_Edit from './pages/Session/Session__Add_And_Edit'
import Session__Players from './pages/Session/Session__Players'
import Session__Preview from './pages/Session/Session__Preview'
import Session__Preview_Table from './pages/Session/Session__Preview_Table'

import Session__Select from './pages/Session/Session__Select'


// ____________________ Game ____________________

import End from './pages/Game/End'
import Game from './pages/Game/Game'
import Public_Route from './logic/Public_Route'





export default function App() {
	
	
	return <>
		<div className='App' id='App'>
			<Toaster/>
			<Router>
				<Routes>

					{/* 'Public' routes --> routes that can be accessed without token */}
					<Route element={<Public_Route/>}>
						<Route path='/registration_and_login' element={<Registration_And_Login />} />
					</Route>





					{/* 
						Routes that are protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
					*/}
					<Route element={<Axios_Private_Route />}>

						<Route path='/profile' element={<Profile />} />


						{/* __________ Analytics __________ */}

						<Route path='/analytics' element={<Analytics />} />
						<Route path='/session/:session_id/analytics' element={<Analytics__Session />} />


						{/* __________ Session __________ */}

						<Route path='/' element={<Session__Select />} />
						<Route path='/session' element={<Session__Add_And_Edit />} /> 
						<Route path='/session/:session_id' element={<Session__Add_And_Edit />} /> 
						<Route path='/session/:session_id/players' element={<Session__Players />} />
						<Route path='/session/:session_id/preview' element={<Session__Preview />} />
						<Route path='/session/:session_id/preview/table/:finalscore_id' element={<Session__Preview_Table />} />


						{/* __________ Game __________ */}

						<Route path='/game' element={<Game />} />
						<Route path='/game/end' element={<End />} />
						
					</Route>

					<Route path='*' element={<Session__Select />} />

				</Routes>
			</Router>
		</div>
	</>

}
