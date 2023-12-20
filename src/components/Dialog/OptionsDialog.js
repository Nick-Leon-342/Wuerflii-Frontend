

import ToggleSlider from '../ToggleSlider'
import JoinGameInput from '../JoinGameInput'

import { useEffect, useState } from 'react'





export default function OptionsDialog() {
	
	const [ darkModeToggled, setDarkModeToggled ] = useState(sessionStorage.getItem('darkMode') === 'true' || false)
	const closeOptions = () => {document.getElementById('modal-options').close()	}





	useEffect(() => {

		sessionStorage.setItem('darkMode', darkModeToggled)
		if(darkModeToggled) {document.body.classList.add('dark')
		} else {document.body.classList.remove('dark')}

	}, [darkModeToggled])





	return (
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

				<JoinGameInput/>

			</div>
			
		</dialog>
	)

}
