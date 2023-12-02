

export default function ToggleSlider({ scale, toggled, setToggled, marginLeft, marginTop, marginRight, marginBottom }) {

	return (
		<label 
			className='toggleButton'
			style={{
				marginLeft: marginLeft, 
				marginTop: marginTop, 
				marginRight: marginRight, 
				marginBottom: marginBottom, 
				scale: scale, 
			}}
		>

			<input type='checkbox' checked={toggled} onChange={() => setToggled(!toggled)}/>

			<span className='toggleButton-slider'/>

		</label>
	)

}
