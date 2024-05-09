

import './scss/ToggleSlider.scss'





export default function ToggleSlider(props) {

	return (
		<label className={`toggleslider${props.additionalClassName ? ' ' + props.additionalClassName : ''}`}>

			<input type='checkbox' checked={props.toggled} onChange={({ target }) => props.onChange(target.value)}/>

			<span/>

		</label>
	)

}
