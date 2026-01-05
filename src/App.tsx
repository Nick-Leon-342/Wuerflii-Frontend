

import './App.scss'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'


// ____________________ RegistrationAndLogin ____________________

import Registration_And_Login from './pages/Registration_And_Login/Registration_And_Login'
import PersistLogin from './logic/PersistLogin'

import Profile from './pages/Profile'


// ____________________ Analytics ____________________

import Analytics from './pages/Analytics/Analytics'
import Analytics__Session from './pages/Analytics/Analytics_Session'


// ____________________ Session ____________________

import Session__Add_And_Edit from './pages/Session/Session__Add_And_Edit'
import Session__Players from './pages/Session/Session__Players'
import Session__Preview from './pages/Session/Session_Preview'
import Session__Preview_Table from './pages/Session/Session__Preview_Table'

import Session__Select from './pages/Session/Session_Select'


// ____________________ Game ____________________

import End from './pages/Game/End'
import Game from './pages/Game/Game'





export default function App() {
	
	return <>
		<div className='App' id='App'>
			<Router>
				<Routes>

					{/* 'Public' routes --> routes that can be accessed without token */}
					<Route path='/registration_and_login' element={<Registration_And_Login />} />


					{/* 
						Routes that are protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
					*/}
					<Route element={<PersistLogin />}>

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
