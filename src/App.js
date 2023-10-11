

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import PersistLogin from './pages/PersistLogin'
import Registration from './pages/Registration'

import CreateGame from './pages/CreateGame'
import EnterNames from './pages/EnterNames'

import SelectSession from './pages/SelectSession'

function App() {

	return (
		<div className="App">
			<div id='application'>
				
				<a href='https://games.mmtn-schneider.com'><button className='button'>Home</button></a>

				<div className='interface'>
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
								
								<Route path='/CreateGame' element={<CreateGame />} />
								<Route path='/CreateGame' element={<CreateGame />} />

							</Route>

						</Routes>
					</Router>
				</div>
			</div>
		</div>
	)

}

export default App
