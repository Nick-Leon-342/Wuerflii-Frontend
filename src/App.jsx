

import './App.scss'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Reglog/Login'
import PersistLogin from './logic/PersistLogin'
import Registration from './pages/Reglog/Registration'

import Profile from './pages/Profile'


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

	return <>
		<div className='App' id='App'>
			<Router>
				<Routes>

					{/* 'Public' routes --> routes that can be accessed without token */}
					<Route path='/login' element={<Login />} />
					<Route path='/registration' element={<Registration />} />
					{/* <Route path='/joingame' element={<JoinGame />} /> */}


					{/* 
						Routes that are protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
					*/}
					<Route element={<PersistLogin />}>

						<Route path='/profile' element={<Profile />} />


						{/* __________ Session __________ */}

						<Route path='/' element={<SessionSelect />} />
						<Route path='/session' element={<SessionAddAndEdit />} /> 
						<Route path='/session/:session_id' element={<SessionAddAndEdit />} /> 
						<Route path='/session/:session_id/players' element={<SessionPlayers />} />
						<Route path='/session/:session_id/preview' element={<SessionPreview />} />
						<Route path='/session/:session_id/preview/table/:finalscore_id' element={<SessionPreviewTable />} />


						{/* __________ Game __________ */}

						<Route path='/game' element={<Game />} />
						<Route path='/game/end' element={<End />} />
						
					</Route>

					<Route path='*' element={<SessionSelect />} />

				</Routes>
			</Router>
		</div>
	</>

}
