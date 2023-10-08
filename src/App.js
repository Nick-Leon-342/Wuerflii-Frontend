

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import PersistLogin from './pages/PersistLogin'
import Registration from './pages/Registration'

import Home from './pages/Home'

function App() {

	return (
		<div className="App">
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

						<Route path='/home' element={<Home />} />

					</Route>

				</Routes>
			</Router>
		</div>
	)

}

export default App
