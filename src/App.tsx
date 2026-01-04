

import './App.scss'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'


// ____________________ RegistrationAndLogin ____________________

import RegistrationAndLogin from './pages/Registration_And_Login/Registration_And_Login'
// import PersistLogin from './logic/PersistLogin'

// import Profile from './pages/Profile'


// // ____________________ Analytics ____________________

// import Analytics from './pages/Analytics/Analytics'
// import AnalyticsSession from './pages/Analytics/Analytics_Session'


// // ____________________ Session ____________________

// import SessionAddAndEdit from './pages/Session/Session_AddAndEdit'
// import SessionPlayers from './pages/Session/Session_Players'
// import SessionPreview from './pages/Session/Session_Preview'
// import SessionPreviewTable from './pages/Session/Session_Preview-Table'

// import SessionSelect from './pages/Session/Session_Select'


// // ____________________ Game ____________________

// import End from './pages/Game/End'
// import Game from './pages/Game/Game'





export default function App() {
	
	return <>
		<div className='App' id='App'>
			<Router>
				<Routes>

					{/* 'Public' routes --> routes that can be accessed without token */}
					<Route path='/registration_and_login' element={<RegistrationAndLogin />} />


					{/* 
						Routes that are protected by a token
						PersistLogin is needed, so that the user doesn't have to login after page refresh
					*/}

				</Routes>
			</Router>
		</div>
	</>

}
