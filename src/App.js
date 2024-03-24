

import './App.css'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import PersistLogin from './logic/PersistLogin'
import Registration from './pages/Registration'

import CreateGame from './pages/CreateGame'

import SelectSession from './pages/SelectSession'
import SessionPreview from './pages/SessionPreview'
import SessionPreviewTable from './pages/SessionPreview-Table'

import JoinGame from './pages/JoinGame'
import Game from './pages/Game'
import EndScreen from './pages/EndScreen'


export default function App() {

	return (
		<div style={{ display: 'flex', alignItems: 'center', padding: '200px' }}>
			<div className='App' id='App'>
				<Router>
					<Routes>
						{/* 'Public' routes --> routes that can be accessed without token */}
						<Route path='/' element={<Login />} />
						<Route path='/login' element={<Login />} />
						<Route path='/registration' element={<Registration />} />
						<Route path='/joingame' element={<JoinGame />} />


						{/* 
						routes that have to be protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
						*/}
						<Route element={<PersistLogin />}>

							<Route path='/creategame' element={<CreateGame />} />
							
							<Route path='/selectsession' element={<SelectSession />} />
							<Route path='/sessionpreview' element={<SessionPreview />} />
							<Route path='/sessionpreview/table' element={<SessionPreviewTable />} />

							<Route path='/game' element={<Game />} />
							<Route path='/endscreen' element={<EndScreen />} />
							
						</Route>

						<Route path='*' element={<SelectSession />} />

					</Routes>
				</Router>
			</div>
		</div>
	)

}
