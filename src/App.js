

import './App.scss'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Reglog/Login'
import PersistLogin from './logic/PersistLogin'
import Registration from './pages/Reglog/Registration'

// __________ Session __________
import Select from './pages/Session/Select'
import Preview from './pages/Session/Preview'
import PreviewTable from './pages/Session/Preview-Table'

// __________ Game __________
import End from './pages/Game/End'
import Game from './pages/Game/Game'
import Create from './pages/Game/Create'


export default function App() {

	return (
		<div className='App' id='App'>
			<Router>
				<Routes>
					{/* 'Public' routes --> routes that can be accessed without token */}
					<Route path='/' element={<Login />} />
					<Route path='/login' element={<Login />} />
					<Route path='/registration' element={<Registration />} />
					{/* <Route path='/joingame' element={<JoinGame />} /> */}


					{/* 
						Routes that are protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
					*/}
					<Route element={<PersistLogin />}>

						{/* __________ Session __________ */}
						<Route path='/session/select' element={<Select />} />
						<Route path='/session/preview' element={<Preview />} />
						<Route path='/session/preview/table' element={<PreviewTable />} />

						{/* __________ Game __________ */}
						<Route path='/game/create' element={<Create />} />
						<Route path='/game' element={<Game />} />
						<Route path='/game/end' element={<End />} />
						
					</Route>

					<Route path='*' element={<Select />} />

				</Routes>
			</Router>
		</div>
	)

}
