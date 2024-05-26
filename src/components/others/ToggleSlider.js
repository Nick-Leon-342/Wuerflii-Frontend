

import './scss/ToggleSlider.scss'





export default function ToggleSlider({ checked, onChange }) {

	return (
		<label className='toggleslider'>

			<input type='checkbox' checked={checked} onChange={onChange}/>

			<span/>

		</label>
	)

}
