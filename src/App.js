

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { resizeEvent } from './pages/utils'

import Login from './pages/Login'
import PersistLogin from './pages/PersistLogin'
import Registration from './pages/Registration'

import CreateGame from './pages/CreateGame'
import EnterNames from './pages/EnterNames'

import SelectSession from './pages/SelectSession'
import SessionPreview from './pages/SessionPreview'

import Game from './pages/Game'
import EndScreen from './pages/EndScreen'


function App() {

	return (
		<div style={{ display: 'flex', alignItems: 'center', padding: '150px' }}>
			<div className="App" id='App'>
				<Router>
					<Routes>
						{/* 'Public' routes --> routes that can be accessed without token */}
						<Route path='/' element={<Login />} />
						<Route path='/login' element={<Login />} />
						<Route path='/registration' element={<Registration />} />


						{/* 
						routes that have to be protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
						*/}
						<Route element={<PersistLogin />}>

							<Route path='/CreateGame' element={<CreateGame />} />
							<Route path='/EnterNames' element={<EnterNames />} />
							
							<Route path='/SelectSession' element={<SelectSession />} />
							<Route path='/SessionPreview' element={<SessionPreview />} />
							
							<Route path='/Game' element={<Game />} />
							<Route path='/EndScreen' element={<EndScreen />} />
							
						</Route>

					</Routes>
				</Router>
			</div>
		</div>
	)

}

export default App
