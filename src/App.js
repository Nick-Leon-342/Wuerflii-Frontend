

import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import ToggleSlider from './components/ToggleSlider'

import Login from './pages/Login'
import PersistLogin from './logic/PersistLogin'
import Registration from './pages/Registration'

import CreateGame from './pages/CreateGame'
import EnterNames from './pages/EnterNames'

import SelectSession from './pages/SelectSession'
import SessionPreview from './pages/SessionPreview'
import SessionPreviewTable from './pages/SessionPreview-Table'

import JoinGame from './pages/JoinGame'
import Game from './pages/Game'
import EndScreen from './pages/EndScreen'


function App() {

	const [ darkModeToggled, setDarkModeToggled ] = useState(sessionStorage.getItem('darkMode') === 'true' || false)

	const showOptions = () => {	document.getElementById('modal-options').showModal()}
	const closeOptions = () => {document.getElementById('modal-options').close()	}

	useEffect(() => {

		sessionStorage.setItem('darkMode', darkModeToggled)
		if(darkModeToggled) {document.body.classList.add('dark')
		} else {document.body.classList.remove('dark')}

	}, [darkModeToggled])





	return (
		<div style={{ display: 'flex', alignItems: 'center', padding: '150px' }}>
			<div className="App" id='App'>

				<dialog id='modal-options' className='modal'>
					<div style={{ display: 'flex', flexDirection: 'column' }}>

						<div style={{ display: 'flex', justifyContent: 'right', width: '100%' }}>
							<svg className='button-responsive' onClick={closeOptions} height='28' viewBox='0 -960 960 960'>
								<path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z'/
							></svg>
						</div>

						<div style={{ display: 'flex', marginTop: '10px' }}>
							<label
								style={{
									fontSize: '20px', 
									paddingTop: '5px', 
								}}
							>Dark mode</label>
							<ToggleSlider toggled={darkModeToggled} setToggled={setDarkModeToggled} scale='.7'/>
						</div>

					</div>
				</dialog>

				<svg 
					className='button-responsive' 
					style={{ 
						position: 'fixed', 
						top: '5px', 
						left: '5px' 
					}} 
					onClick={showOptions} 
					height='30' 
					viewBox='0 -960 960 960' 
				>
					<path d='m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z'/>
				</svg>

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

							<Route path='/CreateGame' element={<CreateGame />} />
							<Route path='/EnterNames' element={<EnterNames />} />
							
							<Route path='/SelectSession' element={<SelectSession />} />
							<Route path='/SessionPreview' element={<SessionPreview />} />
							<Route path='/SessionPreview/Table' element={<SessionPreviewTable />} />

							<Route path='/Game' element={<Game />} />
							<Route path='/EndScreen' element={<EndScreen />} />
							
						</Route>

						<Route path='*' element={<CreateGame />} />

					</Routes>
				</Router>
			</div>
		</div>
	)

}

export default App
