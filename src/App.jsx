

import './App.scss'

import { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import PopupError from './components/Popup/Popup_Error'


// ____________________ Reglog ____________________

import Login from './pages/Reglog/Login'
import PersistLogin from './logic/PersistLogin'
import Registration from './pages/Reglog/Registration'

import Profile from './pages/Profile'


// ____________________ Analytics ____________________

import Analytics from './pages/Analytics/Analytics'
import AnalyticsSession from './pages/Analytics/Analytics_Session'


// ____________________ Session ____________________

import SessionAddAndEdit from './pages/Session/Session_AddAndEdit'
import SessionPlayers from './pages/Session/Session_Players'
import SessionPreview from './pages/Session/Session_Preview'
import SessionPreviewTable from './pages/Session/Session_Preview-Table'

import SessionSelect from './pages/Session/Session_Select'


// ____________________ Game ____________________

import End from './pages/Game/End'
import Game from './pages/Game/Game'





export default function App() {

	const [ error, setError ] = useState('')

	return <>
		<div className='App' id='App'>

			<PopupError
				error={error}
				setError={setError}
			/>



			<Router>
				<Routes>

					{/* 'Public' routes --> routes that can be accessed without token */}
					<Route path='/login' element={<Login setError={setError}/>} />
					<Route path='/registration' element={<Registration setError={setError} />} />


					{/* 
						Routes that are protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
					*/}
					<Route element={<PersistLogin />}>

						<Route path='/profile' element={<Profile setError={setError} />} />


						{/* __________ Analytics __________ */}

						<Route path='/analytics' element={<Analytics setError={setError} />} />
						<Route path='/session/:session_id/analytics' element={<AnalyticsSession setError={setError} />} />


						{/* __________ Session __________ */}

						<Route path='/' element={<SessionSelect setError={setError} />} />
						<Route path='/session' element={<SessionAddAndEdit setError={setError} />} /> 
						<Route path='/session/:session_id' element={<SessionAddAndEdit setError={setError} />} /> 
						<Route path='/session/:session_id/players' element={<SessionPlayers setError={setError} />} />
						<Route path='/session/:session_id/preview' element={<SessionPreview setError={setError} />} />
						<Route path='/session/:session_id/preview/table/:finalscore_id' element={<SessionPreviewTable setError={setError} />} />


						{/* __________ Game __________ */}

						<Route path='/game' element={<Game setError={setError} />} />
						<Route path='/game/end' element={<End setError={setError} />} />
						
					</Route>

					<Route path='*' element={<SessionSelect />} />

				</Routes>
			</Router>
		</div>
	</>

}
